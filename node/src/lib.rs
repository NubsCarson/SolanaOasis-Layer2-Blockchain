pub mod config;
pub mod network;
pub mod state;
pub mod types;

use anyhow::Result;
use config::NetworkConfig;
use network::Network;
use state::StateManager;

pub struct Node {
    network: Network,
    state: StateManager,
}

impl Node {
    pub async fn new(config: NetworkConfig) -> Result<Self> {
        let network = Network::new(config.clone()).await?;
        let state = StateManager::new(&config.state_db_path)?;

        Ok(Self { network, state })
    }

    pub async fn start(&mut self) -> Result<()> {
        // TODO: Implement node startup logic
        Ok(())
    }
}
