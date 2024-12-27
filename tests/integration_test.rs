use anyhow::Result;
use solana_oasis::{
    ai::{AIComputeManager, ComputeRequest, ComputeInput},
    node::OasisNode,
    types::{Transaction, NodeConfig},
};
use std::{time::Duration, collections::HashMap};
use tempfile::tempdir;
use libp2p::identity;

#[tokio::test]
async fn test_local_node() -> Result<()> {
    // Create temporary directories for test data
    let state_dir = tempdir()?;
    let models_dir = tempdir()?;

    // Create node configuration
    let config = NodeConfig {
        identity: identity::Keypair::generate_ed25519(),
        listen_addresses: vec!["/ip4/127.0.0.1/tcp/0".to_string()],
        bootstrap_peers: vec![],
        state_db_path: state_dir.path().to_str().unwrap().to_string(),
        model_registry_path: models_dir.path().to_str().unwrap().to_string(),
        metrics_endpoint: "127.0.0.1:9090".to_string(),
        challenge_period: 3600,
    };

    // Create and start node
    let mut node = OasisNode::new(config).await?;
    
    // Start node in background
    let node_handle = tokio::spawn(async move {
        node.start().await
    });

    // Wait for node to initialize
    tokio::time::sleep(Duration::from_secs(2)).await;

    // Create test transaction
    let transaction = Transaction::Transfer {
        from: [1u8; 32],
        to: [2u8; 32],
        amount: 100,
        memo: Some("Test transfer".to_string()),
    };

    // Create test AI computation request
    let compute_request = ComputeRequest {
        model_id: "test_model".to_string(),
        input: ComputeInput {
            data: vec![1.0, 2.0, 3.0],
            shape: vec![1, 3],
        },
        parameters: HashMap::new(),
    };

    // TODO: Submit transaction and verify state
    // TODO: Submit computation request and verify result
    
    // Cleanup
    node_handle.abort();
    
    Ok(())
}

#[tokio::test]
async fn test_ai_computation() -> Result<()> {
    // Create temporary directory for models
    let models_dir = tempdir()?;
    
    // Initialize AI compute manager
    let manager = AIComputeManager::new(
        models_dir.path().to_str().unwrap()
    )?;

    // Create test computation request
    let request = ComputeRequest {
        model_id: "test_model".to_string(),
        input: ComputeInput {
            data: vec![1.0, 2.0, 3.0],
            shape: vec![1, 3],
        },
        parameters: HashMap::new(),
    };

    // TODO: Load test model and run computation
    // TODO: Verify computation result and proof

    Ok(())
} 