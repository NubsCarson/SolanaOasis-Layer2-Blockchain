use std::sync::Arc;
use anyhow::Result;
use sha2::{Sha256, Digest};
use tokio::sync::RwLock;

use crate::state::StateManager;
use crate::types::{Block, Transaction};

pub struct Rollup {
    state_manager: Arc<RwLock<StateManager>>,
}

impl Rollup {
    pub fn new(state_manager: Arc<RwLock<StateManager>>) -> Result<Self> {
        Ok(Self { state_manager })
    }

    pub async fn add_transaction(&mut self, transaction: Transaction) -> Result<()> {
        match transaction {
            Transaction::Transfer { from, to, amount } => {
                let mut state = self.state_manager.write().await;
                let from_key = [&b"balance:"[..], from.as_ref()].concat();
                let from_balance = match state.get_value(&from_key).await? {
                    Some(data) => bincode::deserialize(&data)?,
                    None => 0u64,
                };

                if from_balance < amount {
                    return Err(anyhow::anyhow!("Insufficient balance"));
                }

                let to_key = [&b"balance:"[..], to.as_ref()].concat();
                let to_balance = match state.get_value(&to_key).await? {
                    Some(data) => bincode::deserialize(&data)?,
                    None => 0u64,
                };

                state.set_value(&from_key, bincode::serialize(&(from_balance - amount))?)
                    .await?;
                state.set_value(&to_key, bincode::serialize(&(to_balance + amount))?)
                    .await?;
            }
        }
        Ok(())
    }

    pub async fn process_block(&mut self, block: Block) -> Result<()> {
        let mut hasher = Sha256::new();
        hasher.update(&bincode::serialize(&block.transactions)?);
        let transactions_root = hasher.finalize();

        if block.transactions_root != transactions_root.as_slice() {
            return Err(anyhow::anyhow!("Invalid transactions root"));
        }

        for tx in block.transactions {
            self.add_transaction(tx).await?;
        }

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    #[tokio::test]
    async fn test_rollup() -> Result<()> {
        let temp_dir = tempdir()?;
        let state_manager = Arc::new(RwLock::new(StateManager::new(&temp_dir)?));
        let mut rollup = Rollup::new(state_manager.clone())?;

        let from = [1u8; 32];
        let to = [2u8; 32];
        let amount = 100;

        // Initialize from balance
        let mut state = state_manager.write().await;
        let from_key = [&b"balance:"[..], &from[..]].concat();
        state.set_value(&from_key, bincode::serialize(&200u64)?).await?;

        // Process transaction
        let tx = Transaction::Transfer { from, to, amount };
        rollup.add_transaction(tx.clone()).await?;

        // Verify balances
        let from_balance: u64 = bincode::deserialize(
            &state.get_value(&from_key).await?.unwrap()
        )?;
        assert_eq!(from_balance, 100);

        let to_key = [&b"balance:"[..], &to[..]].concat();
        let to_balance: u64 = bincode::deserialize(
            &state.get_value(&to_key).await?.unwrap()
        )?;
        assert_eq!(to_balance, amount);

        Ok(())
    }
} 