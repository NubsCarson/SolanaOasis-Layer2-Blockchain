use std::{
    collections::HashMap,
    path::Path,
    sync::Arc,
};
use anyhow::{Result, Context};
use async_trait::async_trait;
use serde::{Serialize, Deserialize};
use tokio::sync::RwLock;
use tch::{Device, Tensor, CModule};
use ort::{Environment, Session, SessionBuilder, Value};
use tracing::{info, warn, error};

/// AI model metadata
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ModelMetadata {
    pub id: String,
    pub version: String,
    pub model_type: ModelType,
    pub input_shape: Vec<i64>,
    pub output_shape: Vec<i64>,
    pub description: String,
    pub parameters: HashMap<String, String>,
}

/// Supported model types
#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum ModelType {
    PyTorch,
    ONNX,
    Custom,
}

/// Compute request
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ComputeRequest {
    pub model_id: String,
    pub input: ComputeInput,
    pub parameters: HashMap<String, serde_json::Value>,
}

/// Compute input
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ComputeInput {
    pub data: Vec<f32>,
    pub shape: Vec<i64>,
}

/// Compute result
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ComputeResult {
    pub model_id: String,
    pub output: ComputeOutput,
    pub metrics: ComputeMetrics,
    pub timestamp: i64,
}

/// Compute output
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ComputeOutput {
    pub data: Vec<f32>,
    pub shape: Vec<i64>,
}

/// Compute metrics
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ComputeMetrics {
    pub computation_time_ms: u64,
    pub memory_used_bytes: u64,
    pub flops: u64,
}

/// Model registry entry
struct ModelEntry {
    metadata: ModelMetadata,
    pytorch_model: Option<CModule>,
    onnx_session: Option<Session>,
}

/// AI Compute Manager
pub struct AIComputeManager {
    models: HashMap<String, Arc<RwLock<ModelEntry>>>,
    environment: Arc<Environment>,
}

impl AIComputeManager {
    /// Create a new AI compute manager
    pub fn new(model_registry_path: &str) -> Result<Self> {
        let environment = Environment::builder()
            .with_name("oasis_runtime")
            .with_log_level(ort::LoggingLevel::Warning)
            .build()?;

        let mut manager = Self {
            models: HashMap::new(),
            environment: Arc::new(environment),
        };

        // Load models from registry
        manager.load_models(model_registry_path)?;

        Ok(manager)
    }

    /// Load models from the registry
    fn load_models(&mut self, registry_path: &str) -> Result<()> {
        let registry_path = Path::new(registry_path);
        if !registry_path.exists() {
            std::fs::create_dir_all(registry_path)?;
        }

        // Iterate through model directories
        for entry in std::fs::read_dir(registry_path)? {
            let entry = entry?;
            if entry.file_type()?.is_dir() {
                let metadata_path = entry.path().join("metadata.json");
                if metadata_path.exists() {
                    let metadata: ModelMetadata = serde_json::from_str(
                        &std::fs::read_to_string(metadata_path)?
                    )?;

                    // Load model based on type
                    let model_entry = match metadata.model_type {
                        ModelType::PyTorch => {
                            let model_path = entry.path().join("model.pt");
                            let pytorch_model = Some(CModule::load(model_path)?);
                            ModelEntry {
                                metadata: metadata.clone(),
                                pytorch_model,
                                onnx_session: None,
                            }
                        }
                        ModelType::ONNX => {
                            let model_path = entry.path().join("model.onnx");
                            let session = Some(SessionBuilder::new(&self.environment)?
                                .with_optimization_level(ort::GraphOptimizationLevel::Level3)?
                                .with_intra_threads(1)?
                                .with_model_from_file(model_path)?);
                            ModelEntry {
                                metadata: metadata.clone(),
                                pytorch_model: None,
                                onnx_session: session,
                            }
                        }
                        ModelType::Custom => {
                            // Custom models require special handling
                            continue;
                        }
                    };

                    self.models.insert(
                        metadata.id.clone(),
                        Arc::new(RwLock::new(model_entry)),
                    );

                    info!("Loaded model: {}", metadata.id);
                }
            }
        }

        Ok(())
    }

    /// Process a compute request
    pub async fn process_request(&self, request: ComputeRequest) -> Result<ComputeResult> {
        let model = self.models.get(&request.model_id)
            .context("Model not found")?;
        let model = model.read().await;

        let start_time = std::time::Instant::now();
        let output = match model.metadata.model_type {
            ModelType::PyTorch => {
                self.run_pytorch(&model, &request.input).await?
            }
            ModelType::ONNX => {
                self.run_onnx(&model, &request.input).await?
            }
            ModelType::Custom => {
                return Err(anyhow::anyhow!("Custom models not supported yet"));
            }
        };

        let computation_time = start_time.elapsed();

        Ok(ComputeResult {
            model_id: request.model_id,
            output,
            metrics: ComputeMetrics {
                computation_time_ms: computation_time.as_millis() as u64,
                memory_used_bytes: 0, // TODO: Implement memory tracking
                flops: 0, // TODO: Implement FLOPS counting
            },
            timestamp: chrono::Utc::now().timestamp(),
        })
    }

    /// Run PyTorch model
    async fn run_pytorch(&self, model: &ModelEntry, input: &ComputeInput) -> Result<ComputeOutput> {
        let pytorch_model = model.pytorch_model.as_ref()
            .context("PyTorch model not loaded")?;

        // Convert input to tensor
        let input_tensor = Tensor::of_slice(&input.data)
            .reshape(&input.shape)
            .to_device(Device::Cuda(0));

        // Run inference
        let output_tensor = pytorch_model.forward_ts(&[input_tensor])?
            .to_device(Device::Cpu);

        // Convert output to vector
        let output_shape = output_tensor.size();
        let output_data = output_tensor.flatten(0, -1)?.into();

        Ok(ComputeOutput {
            data: output_data,
            shape: output_shape,
        })
    }

    /// Run ONNX model
    async fn run_onnx(&self, model: &ModelEntry, input: &ComputeInput) -> Result<ComputeOutput> {
        let session = model.onnx_session.as_ref()
            .context("ONNX session not loaded")?;

        // Prepare input
        let input_array = ndarray::Array::from_shape_vec(
            input.shape.clone(),
            input.data.clone(),
        )?;
        
        let input_tensor = Value::from_array(session.allocator(), &input_array)?;

        // Run inference
        let outputs = session.run(vec![input_tensor])?;
        let output = outputs[0].try_extract()?;

        // Convert output to vector
        let output_shape = output.shape().to_vec();
        let output_data = output.as_slice()?.to_vec();

        Ok(ComputeOutput {
            data: output_data,
            shape: output_shape,
        })
    }

    /// Shutdown the manager
    pub async fn shutdown(&mut self) -> Result<()> {
        info!("Shutting down AI compute manager...");
        self.models.clear();
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    #[tokio::test]
    async fn test_manager_initialization() -> Result<()> {
        let temp_dir = tempdir()?;
        let manager = AIComputeManager::new(
            temp_dir.path().to_str().unwrap()
        )?;
        
        assert!(manager.models.is_empty());
        Ok(())
    }

    // Add more tests for model loading and inference
} 