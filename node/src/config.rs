use libp2p::identity::Keypair;
use std::fmt;

#[derive(Clone)]
pub struct NetworkConfig {
    pub identity: Keypair,
    pub listen_addresses: Vec<String>,
    pub bootstrap_peers: Vec<String>,
    pub state_db_path: String,
}

impl fmt::Debug for NetworkConfig {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("NetworkConfig")
            .field("listen_addresses", &self.listen_addresses)
            .field("bootstrap_peers", &self.bootstrap_peers)
            .field("state_db_path", &self.state_db_path)
            .field("identity", &"<keypair>")
            .finish()
    }
}

impl NetworkConfig {
    pub fn new(
        identity: Keypair,
        listen_addresses: Vec<String>,
        bootstrap_peers: Vec<String>,
        state_db_path: String,
    ) -> Self {
        Self {
            identity,
            listen_addresses,
            bootstrap_peers,
            state_db_path,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use libp2p::identity;

    #[test]
    fn test_network_config() {
        let config = NetworkConfig::new(
            identity::Keypair::generate_ed25519(),
            vec!["/ip4/127.0.0.1/tcp/0".to_string()],
            vec![],
            "test_db".to_string(),
        );

        assert_eq!(config.listen_addresses.len(), 1);
        assert_eq!(config.bootstrap_peers.len(), 0);
        assert_eq!(config.state_db_path, "test_db");
    }
} 