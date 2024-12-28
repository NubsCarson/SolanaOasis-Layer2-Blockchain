use anyhow::Result;
use libp2p::identity::Keypair;
use solana_oasis_node::{config::NetworkConfig, Node};
use std::path::PathBuf;

#[tokio::main]
async fn main() -> Result<()> {
    env_logger::init();

    let identity = Keypair::generate_ed25519();
    let state_db_path = PathBuf::from("state.db");

    let config = NetworkConfig {
        identity,
        state_db_path: state_db_path.to_str().unwrap().to_string(),
        listen_addresses: vec!["/ip4/127.0.0.1/tcp/0".to_string()],
        bootstrap_peers: vec![],
    };

    let mut node = Node::new(config).await?;
    node.start().await?;

    Ok(())
}
