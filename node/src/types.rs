use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Block {
    pub number: u64,
    pub previous_hash: [u8; 32],
    pub transactions: Vec<Transaction>,
    pub transactions_root: Vec<u8>,
    pub timestamp: i64,
}

impl Block {
    pub fn new(
        number: u64,
        previous_hash: [u8; 32],
        transactions: Vec<Transaction>,
        timestamp: i64,
    ) -> Self {
        let mut block = Self {
            number,
            previous_hash,
            transactions,
            transactions_root: Vec::new(),
            timestamp,
        };
        block.update_transactions_root();
        block
    }

    pub fn update_transactions_root(&mut self) {
        let mut hasher = Sha256::new();
        hasher.update(&bincode::serialize(&self.transactions).unwrap_or_default());
        self.transactions_root = hasher.finalize().to_vec();
    }

    pub fn hash(&self) -> Vec<u8> {
        let mut hasher = Sha256::new();
        hasher.update(&bincode::serialize(self).unwrap_or_default());
        hasher.finalize().to_vec()
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum Transaction {
    Transfer {
        from: [u8; 32],
        to: [u8; 32],
        amount: u64,
    },
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum Message {
    Transaction(Transaction),
    Block(Block),
    State(Vec<u8>),
    Compute(Vec<u8>),
}

#[cfg(test)]
mod tests {
    use super::*;
    use chrono::Utc;

    #[test]
    fn test_block_hash() {
        let transactions = vec![Transaction::Transfer {
            from: [1u8; 32],
            to: [2u8; 32],
            amount: 100,
        }];

        let block = Block::new(1, [0u8; 32], transactions, Utc::now().timestamp());
        let hash = block.hash();
        assert_eq!(hash.len(), 32);
    }
}
