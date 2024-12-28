use solana_client::rpc_client::RpcClient;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum SdkError {
    #[error("Failed to process SDK request")]
    ProcessingError,
}

pub trait RpcClientTrait {
    fn get_version(&self) -> Result<String, Box<dyn std::error::Error>>;
}

impl RpcClientTrait for RpcClient {
    fn get_version(&self) -> Result<String, Box<dyn std::error::Error>> {
        Ok(self.get_version()?.to_string())
    }
}

pub struct SolanaOasisSdk {
    client: Box<dyn RpcClientTrait>,
}

impl SolanaOasisSdk {
    pub fn new(rpc_url: &str) -> Self {
        Self {
            client: Box::new(RpcClient::new(rpc_url.to_string())),
        }
    }

    #[cfg(test)]
    pub fn with_client(client: Box<dyn RpcClientTrait>) -> Self {
        Self { client }
    }

    pub fn get_version(&self) -> Result<String, SdkError> {
        self.client
            .get_version()
            .map_err(|_| SdkError::ProcessingError)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use mockall::mock;

    mock! {
        RpcClient {
            fn get_version(&self) -> Result<String, Box<dyn std::error::Error>>;
        }
    }

    impl RpcClientTrait for MockRpcClient {
        fn get_version(&self) -> Result<String, Box<dyn std::error::Error>> {
            self.get_version()
        }
    }

    #[test]
    fn test_new_sdk() {
        let mut mock_client = MockRpcClient::new();
        mock_client
            .expect_get_version()
            .returning(|| Ok("1.14.16".to_string()));

        let sdk = SolanaOasisSdk::with_client(Box::new(mock_client));
        assert!(sdk.get_version().is_ok());
    }
}
