use std::{
    collections::HashMap,
    sync::Arc,
    time::{Duration, Instant},
};
use anyhow::{Result, Context};
use prometheus::{
    Counter, Gauge, Histogram, HistogramOpts, IntCounter,
    IntGauge, Opts, Registry,
};
use tokio::sync::RwLock;
use tracing::{info, warn, error};

/// Metrics collector for monitoring system performance
pub struct MetricsCollector {
    /// Prometheus registry
    registry: Registry,
    /// Transaction metrics
    transactions: TransactionMetrics,
    /// Block metrics
    blocks: BlockMetrics,
    /// State metrics
    state: StateMetrics,
    /// Network metrics
    network: NetworkMetrics,
    /// AI computation metrics
    ai: AIMetrics,
}

/// Transaction metrics
struct TransactionMetrics {
    /// Total transactions processed
    total: IntCounter,
    /// Transactions per second
    tps: Gauge,
    /// Transaction processing time
    processing_time: Histogram,
    /// Pending transactions
    pending: IntGauge,
    /// Failed transactions
    failed: IntCounter,
}

/// Block metrics
struct BlockMetrics {
    /// Total blocks produced
    total: IntCounter,
    /// Blocks per second
    bps: Gauge,
    /// Block size (transactions)
    size: Histogram,
    /// Block processing time
    processing_time: Histogram,
    /// Failed blocks
    failed: IntCounter,
}

/// State metrics
struct StateMetrics {
    /// State size (bytes)
    size: IntGauge,
    /// State updates per second
    ups: Gauge,
    /// State update processing time
    processing_time: Histogram,
    /// Failed updates
    failed: IntCounter,
}

/// Network metrics
struct NetworkMetrics {
    /// Connected peers
    peers: IntGauge,
    /// Messages per second
    mps: Gauge,
    /// Message size
    message_size: Histogram,
    /// Failed messages
    failed: IntCounter,
    /// Bandwidth usage
    bandwidth: Gauge,
}

/// AI computation metrics
struct AIMetrics {
    /// Total computations
    total: IntCounter,
    /// Computations per second
    cps: Gauge,
    /// Computation time
    computation_time: Histogram,
    /// Memory usage
    memory_usage: Gauge,
    /// GPU utilization
    gpu_utilization: Gauge,
    /// Failed computations
    failed: IntCounter,
}

impl MetricsCollector {
    /// Create a new metrics collector
    pub fn new(endpoint: &str) -> Result<Self> {
        let registry = Registry::new();

        // Create transaction metrics
        let transactions = TransactionMetrics {
            total: IntCounter::new(
                "transactions_total",
                "Total number of transactions processed",
            )?,
            tps: Gauge::new(
                "transactions_per_second",
                "Number of transactions processed per second",
            )?,
            processing_time: Histogram::with_opts(
                HistogramOpts::new(
                    "transaction_processing_time",
                    "Time taken to process transactions",
                )
                .buckets(vec![0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0]),
            )?,
            pending: IntGauge::new(
                "transactions_pending",
                "Number of pending transactions",
            )?,
            failed: IntCounter::new(
                "transactions_failed",
                "Number of failed transactions",
            )?,
        };

        // Create block metrics
        let blocks = BlockMetrics {
            total: IntCounter::new(
                "blocks_total",
                "Total number of blocks produced",
            )?,
            bps: Gauge::new(
                "blocks_per_second",
                "Number of blocks produced per second",
            )?,
            size: Histogram::with_opts(
                HistogramOpts::new(
                    "block_size",
                    "Number of transactions per block",
                )
                .buckets(vec![10.0, 50.0, 100.0, 250.0, 500.0, 1000.0]),
            )?,
            processing_time: Histogram::with_opts(
                HistogramOpts::new(
                    "block_processing_time",
                    "Time taken to process blocks",
                )
                .buckets(vec![0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0]),
            )?,
            failed: IntCounter::new(
                "blocks_failed",
                "Number of failed blocks",
            )?,
        };

        // Create state metrics
        let state = StateMetrics {
            size: IntGauge::new(
                "state_size_bytes",
                "Total state size in bytes",
            )?,
            ups: Gauge::new(
                "state_updates_per_second",
                "Number of state updates per second",
            )?,
            processing_time: Histogram::with_opts(
                HistogramOpts::new(
                    "state_update_processing_time",
                    "Time taken to process state updates",
                )
                .buckets(vec![0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25]),
            )?,
            failed: IntCounter::new(
                "state_updates_failed",
                "Number of failed state updates",
            )?,
        };

        // Create network metrics
        let network = NetworkMetrics {
            peers: IntGauge::new(
                "network_peers",
                "Number of connected peers",
            )?,
            mps: Gauge::new(
                "messages_per_second",
                "Number of messages processed per second",
            )?,
            message_size: Histogram::with_opts(
                HistogramOpts::new(
                    "message_size_bytes",
                    "Size of network messages in bytes",
                )
                .buckets(vec![100.0, 500.0, 1000.0, 5000.0, 10000.0]),
            )?,
            failed: IntCounter::new(
                "messages_failed",
                "Number of failed messages",
            )?,
            bandwidth: Gauge::new(
                "bandwidth_bytes_per_second",
                "Network bandwidth usage in bytes per second",
            )?,
        };

        // Create AI metrics
        let ai = AIMetrics {
            total: IntCounter::new(
                "computations_total",
                "Total number of AI computations",
            )?,
            cps: Gauge::new(
                "computations_per_second",
                "Number of computations per second",
            )?,
            computation_time: Histogram::with_opts(
                HistogramOpts::new(
                    "computation_time",
                    "Time taken for AI computations",
                )
                .buckets(vec![0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0]),
            )?,
            memory_usage: Gauge::new(
                "memory_usage_bytes",
                "Memory usage for AI computations",
            )?,
            gpu_utilization: Gauge::new(
                "gpu_utilization_percent",
                "GPU utilization percentage",
            )?,
            failed: IntCounter::new(
                "computations_failed",
                "Number of failed computations",
            )?,
        };

        // Register metrics
        registry.register(Box::new(transactions.total.clone()))?;
        registry.register(Box::new(transactions.tps.clone()))?;
        registry.register(Box::new(transactions.processing_time.clone()))?;
        registry.register(Box::new(transactions.pending.clone()))?;
        registry.register(Box::new(transactions.failed.clone()))?;

        registry.register(Box::new(blocks.total.clone()))?;
        registry.register(Box::new(blocks.bps.clone()))?;
        registry.register(Box::new(blocks.size.clone()))?;
        registry.register(Box::new(blocks.processing_time.clone()))?;
        registry.register(Box::new(blocks.failed.clone()))?;

        registry.register(Box::new(state.size.clone()))?;
        registry.register(Box::new(state.ups.clone()))?;
        registry.register(Box::new(state.processing_time.clone()))?;
        registry.register(Box::new(state.failed.clone()))?;

        registry.register(Box::new(network.peers.clone()))?;
        registry.register(Box::new(network.mps.clone()))?;
        registry.register(Box::new(network.message_size.clone()))?;
        registry.register(Box::new(network.failed.clone()))?;
        registry.register(Box::new(network.bandwidth.clone()))?;

        registry.register(Box::new(ai.total.clone()))?;
        registry.register(Box::new(ai.cps.clone()))?;
        registry.register(Box::new(ai.computation_time.clone()))?;
        registry.register(Box::new(ai.memory_usage.clone()))?;
        registry.register(Box::new(ai.gpu_utilization.clone()))?;
        registry.register(Box::new(ai.failed.clone()))?;

        Ok(Self {
            registry,
            transactions,
            blocks,
            state,
            network,
            ai,
        })
    }

    /// Record a transaction
    pub fn record_transaction(&self, duration: Duration, success: bool) {
        self.transactions.total.inc();
        self.transactions.processing_time.observe(duration.as_secs_f64());
        if !success {
            self.transactions.failed.inc();
        }
    }

    /// Update pending transactions
    pub fn update_pending_transactions(&self, count: i64) {
        self.transactions.pending.set(count);
    }

    /// Record a block
    pub fn record_block(&self, size: u64, duration: Duration, success: bool) {
        self.blocks.total.inc();
        self.blocks.size.observe(size as f64);
        self.blocks.processing_time.observe(duration.as_secs_f64());
        if !success {
            self.blocks.failed.inc();
        }
    }

    /// Update state size
    pub fn update_state_size(&self, size: u64) {
        self.state.size.set(size as i64);
    }

    /// Record a state update
    pub fn record_state_update(&self, duration: Duration, success: bool) {
        self.state.processing_time.observe(duration.as_secs_f64());
        if !success {
            self.state.failed.inc();
        }
    }

    /// Update network metrics
    pub fn update_network_metrics(
        &self,
        peers: i64,
        bandwidth: f64,
        message_size: u64,
        success: bool,
    ) {
        self.network.peers.set(peers);
        self.network.bandwidth.set(bandwidth);
        self.network.message_size.observe(message_size as f64);
        if !success {
            self.network.failed.inc();
        }
    }

    /// Record an AI computation
    pub fn record_computation(
        &self,
        duration: Duration,
        memory: u64,
        gpu_util: f64,
        success: bool,
    ) {
        self.ai.total.inc();
        self.ai.computation_time.observe(duration.as_secs_f64());
        self.ai.memory_usage.set(memory as f64);
        self.ai.gpu_utilization.set(gpu_util);
        if !success {
            self.ai.failed.inc();
        }
    }

    /// Get the Prometheus registry
    pub fn registry(&self) -> &Registry {
        &self.registry
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::time::Duration;

    #[test]
    fn test_metrics_recording() -> Result<()> {
        let collector = MetricsCollector::new("localhost:9090")?;

        // Record transaction
        collector.record_transaction(Duration::from_millis(100), true);
        assert_eq!(collector.transactions.total.get(), 1);

        // Record block
        collector.record_block(100, Duration::from_secs(1), true);
        assert_eq!(collector.blocks.total.get(), 1);

        // Update state
        collector.update_state_size(1000);
        assert_eq!(collector.state.size.get(), 1000);

        // Record computation
        collector.record_computation(
            Duration::from_millis(500),
            1024 * 1024,
            80.0,
            true,
        );
        assert_eq!(collector.ai.total.get(), 1);

        Ok(())
    }
} 