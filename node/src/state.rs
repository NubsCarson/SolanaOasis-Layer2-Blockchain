use anyhow::Result;
use rocksdb::{ColumnFamilyDescriptor, Options, DB};
use serde;
use std::path::Path;

pub struct StateManager {
    db: DB,
    current_root: StateRoot,
}

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
pub struct StateRoot {
    pub root: [u8; 32],
    pub height: u64,
}

impl StateManager {
    pub fn new(path: &impl AsRef<Path>) -> Result<Self> {
        let mut opts = Options::default();
        opts.create_if_missing(true);
        opts.create_missing_column_families(true);

        let cf_roots = ColumnFamilyDescriptor::new("roots", Options::default());
        let cf_data = ColumnFamilyDescriptor::new("data", Options::default());

        let db = DB::open_cf_descriptors(&opts, path, vec![cf_roots, cf_data])?;

        let current_root = match db.get_cf(db.cf_handle("roots").unwrap(), "current")? {
            Some(data) => bincode::deserialize(&data)?,
            None => StateRoot {
                root: [0u8; 32],
                height: 0,
            },
        };

        Ok(Self { db, current_root })
    }

    pub async fn get_value(&self, key: &[u8]) -> Result<Option<Vec<u8>>> {
        let cf_data = self.db.cf_handle("data").unwrap();
        Ok(self.db.get_cf(cf_data, key)?)
    }

    pub async fn set_value(&mut self, key: &[u8], value: Vec<u8>) -> Result<()> {
        let cf_data = self.db.cf_handle("data").unwrap();
        self.db.put_cf(cf_data, key, value)?;
        Ok(())
    }

    pub async fn update_root(&mut self, root: StateRoot) -> Result<()> {
        let cf_roots = self.db.cf_handle("roots").unwrap();
        self.db
            .put_cf(cf_roots, "current", bincode::serialize(&root)?)?;
        self.current_root = root;
        Ok(())
    }

    pub fn get_current_root(&self) -> &StateRoot {
        &self.current_root
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    #[tokio::test]
    async fn test_state_manager() -> Result<()> {
        let temp_dir = tempdir()?;
        let mut state = StateManager::new(&temp_dir)?;

        let key = b"test_key";
        let value = b"test_value".to_vec();
        state.set_value(key, value.clone()).await?;

        let retrieved = state.get_value(key).await?;
        assert_eq!(retrieved, Some(value));

        let new_root = StateRoot {
            root: [1u8; 32],
            height: 1,
        };
        state.update_root(new_root.clone()).await?;
        assert_eq!(state.get_current_root().root, new_root.root);
        assert_eq!(state.get_current_root().height, new_root.height);

        Ok(())
    }
}
