use anyhow::{anyhow, Result};
use libp2p::{
    core::upgrade,
    gossipsub::{
        Gossipsub, GossipsubConfigBuilder, GossipsubEvent, IdentTopic, MessageAuthenticity,
    },
    kad::{store::MemoryStore, Kademlia, KademliaEvent},
    mdns::{Mdns, MdnsConfig, MdnsEvent},
    noise,
    swarm::NetworkBehaviourEventProcess,
    swarm::SwarmEvent,
    tcp::TokioTcpConfig,
    yamux, NetworkBehaviour, Transport,
};
use std::time::Duration;

use crate::config::NetworkConfig;
use crate::types::{Block, Message, Transaction};

const TRANSACTION_TOPIC: &str = "transactions";
const BLOCK_TOPIC: &str = "blocks";
const STATE_TOPIC: &str = "state";
const COMPUTE_TOPIC: &str = "compute";

#[derive(NetworkBehaviour)]
#[behaviour(out_event = "NetworkEvent")]
pub struct NetworkBehavior {
    gossipsub: Gossipsub,
    kademlia: Kademlia<MemoryStore>,
    mdns: Mdns,
}

impl NetworkBehaviourEventProcess<GossipsubEvent> for NetworkBehavior {
    fn inject_event(&mut self, event: GossipsubEvent) {
        if let GossipsubEvent::Message { message, .. } = event {
            match bincode::deserialize::<Message>(&message.data) {
                Ok(msg) => log::info!("Received message: {:?}", msg),
                Err(e) => log::error!("Failed to deserialize message: {}", e),
            }
        }
    }
}

impl NetworkBehaviourEventProcess<KademliaEvent> for NetworkBehavior {
    fn inject_event(&mut self, event: KademliaEvent) {
        if let KademliaEvent::OutboundQueryCompleted { result, .. } = event {
            if let Ok(peers) = result {
                for peer_id in peers.peers() {
                    log::info!("Found peer: {}", peer_id);
                }
            }
        }
    }
}

impl NetworkBehaviourEventProcess<MdnsEvent> for NetworkBehavior {
    fn inject_event(&mut self, event: MdnsEvent) {
        match event {
            MdnsEvent::Discovered(list) => {
                for (peer, _) in list {
                    log::info!("mDNS discovered peer: {}", peer);
                }
            }
            MdnsEvent::Expired(list) => {
                for (peer, _) in list {
                    log::info!("mDNS expired peer: {}", peer);
                }
            }
        }
    }
}

#[derive(Debug)]
pub enum NetworkEvent {
    Gossipsub(GossipsubEvent),
    Kademlia(KademliaEvent),
    Mdns(MdnsEvent),
}

impl From<GossipsubEvent> for NetworkEvent {
    fn from(event: GossipsubEvent) -> Self {
        NetworkEvent::Gossipsub(event)
    }
}

impl From<KademliaEvent> for NetworkEvent {
    fn from(event: KademliaEvent) -> Self {
        NetworkEvent::Kademlia(event)
    }
}

impl From<MdnsEvent> for NetworkEvent {
    fn from(event: MdnsEvent) -> Self {
        NetworkEvent::Mdns(event)
    }
}

pub struct Network {
    config: NetworkConfig,
    gossipsub: Gossipsub,
    kademlia: Kademlia<MemoryStore>,
    mdns: Mdns,
}

impl Network {
    pub async fn new(config: NetworkConfig) -> Result<Self> {
        let local_key = config.identity.clone();
        let local_peer_id = local_key.public().to_peer_id();

        let noise_keys = noise::Keypair::<noise::X25519Spec>::new()
            .into_authentic(&local_key)
            .expect("Failed to create noise keys");

        let _transport = TokioTcpConfig::new()
            .upgrade(upgrade::Version::V1)
            .authenticate(noise::NoiseConfig::xx(noise_keys).into_authenticated())
            .multiplex(yamux::YamuxConfig::default())
            .boxed();

        let gossipsub_config = GossipsubConfigBuilder::default()
            .heartbeat_interval(Duration::from_secs(1))
            .build()
            .expect("Valid config");

        let mut gossipsub = Gossipsub::new(
            MessageAuthenticity::Signed(local_key.clone()),
            gossipsub_config,
        )
        .expect("Failed to create gossipsub");

        let transaction_topic = IdentTopic::new(TRANSACTION_TOPIC);
        let block_topic = IdentTopic::new(BLOCK_TOPIC);
        let state_topic = IdentTopic::new(STATE_TOPIC);
        let compute_topic = IdentTopic::new(COMPUTE_TOPIC);

        gossipsub
            .subscribe(&transaction_topic)
            .expect("Failed to subscribe to transaction topic");
        gossipsub
            .subscribe(&block_topic)
            .expect("Failed to subscribe to block topic");
        gossipsub
            .subscribe(&state_topic)
            .expect("Failed to subscribe to state topic");
        gossipsub
            .subscribe(&compute_topic)
            .expect("Failed to subscribe to compute topic");

        let store = MemoryStore::new(local_peer_id);
        let kademlia = Kademlia::new(local_peer_id, store);

        let mdns = Mdns::new(MdnsConfig::default()).await?;

        Ok(Self {
            config,
            gossipsub,
            kademlia,
            mdns,
        })
    }

    pub async fn broadcast_transaction(&mut self, transaction: Transaction) -> Result<()> {
        let message = Message::Transaction(transaction);
        let data = bincode::serialize(&message)?;
        self.gossipsub
            .publish(IdentTopic::new(TRANSACTION_TOPIC), data)
            .map_err(|e| anyhow!("Failed to publish transaction: {:?}", e))?;
        Ok(())
    }

    pub async fn broadcast_block(&mut self, block: Block) -> Result<()> {
        let message = Message::Block(block);
        let data = bincode::serialize(&message)?;
        self.gossipsub
            .publish(IdentTopic::new(BLOCK_TOPIC), data)
            .map_err(|e| anyhow!("Failed to publish block: {:?}", e))?;
        Ok(())
    }

    pub async fn broadcast_state(&mut self, state: Vec<u8>) -> Result<()> {
        let message = Message::State(state);
        let data = bincode::serialize(&message)?;
        self.gossipsub
            .publish(IdentTopic::new(STATE_TOPIC), data)
            .map_err(|e| anyhow!("Failed to publish state: {:?}", e))?;
        Ok(())
    }

    pub async fn broadcast_compute(&mut self, compute: Vec<u8>) -> Result<()> {
        let message = Message::Compute(compute);
        let data = bincode::serialize(&message)?;
        self.gossipsub
            .publish(IdentTopic::new(COMPUTE_TOPIC), data)
            .map_err(|e| anyhow!("Failed to publish compute: {:?}", e))?;
        Ok(())
    }

    pub async fn handle_event(
        &mut self,
        event: SwarmEvent<NetworkEvent, impl std::error::Error>,
    ) -> Result<Option<Message>> {
        match event {
            SwarmEvent::Behaviour(NetworkEvent::Gossipsub(GossipsubEvent::Message {
                message,
                ..
            })) => match bincode::deserialize::<Message>(&message.data) {
                Ok(msg) => Ok(Some(msg)),
                Err(e) => {
                    log::error!("Failed to deserialize message: {}", e);
                    Ok(None)
                }
            },
            SwarmEvent::Behaviour(NetworkEvent::Kademlia(
                KademliaEvent::OutboundQueryCompleted { result, .. },
            )) => {
                if let Ok(peers) = result {
                    for peer_id in peers.peers() {
                        log::info!("Found peer: {}", peer_id);
                    }
                }
                Ok(None)
            }
            _ => Ok(None),
        }
    }
}
