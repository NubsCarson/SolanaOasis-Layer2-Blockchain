import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import Head from 'next/head';
import { useRouter } from 'next/router';

const ArchitectureGrimoire = () => {
  const router = useRouter();

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  return (
    <div className="relative min-h-screen w-full bg-void-black overflow-hidden">
      <Head>
        <title>Sacred Architecture | Solana Oasis</title>
      </Head>

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          {/* Navigation */}
          <motion.nav 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-16"
          >
            <button 
              onClick={() => router.push('/docs')}
              className="text-mystic-purple hover:text-purple-400 transition-colors"
            >
              ← Return to Sacred Texts
            </button>
          </motion.nav>

          {/* Main Content */}
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className="prose prose-invert max-w-none"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-6xl font-bold text-white mb-8 glow-text"
            >
              ⚔️ Sacred Architecture
            </motion.h1>

            {/* Architecture Diagram */}
            <motion.div 
              variants={itemVariants}
              className="mb-12 p-8 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20"
            >
              <pre className="text-purple-300 overflow-x-auto">
{`
                                ┌─────────────────────────────┐
                                │      Mortal Realm           │
                                │      (Solana L1)            │
                                │ ┌─────────────────────┐     │
                                │ │ Transactions        │     │
                                │ │ - User Requests     │     │
                                │ │ - Smart Contracts   │     │
                                │ └─────────────────────┘     │
                                └──────────┬──────────────────┘
                                           │
                                           │ Sacred Bridge Portal
                                           │ - Transaction Batching
                                           │ - State Commitment
                                           │ - Fraud Proofs
                                           ▼
                      ┌───────────────────────────────────────────┐
                      │        Oasis Nexus (L2 Scaling)           │
                      │                                           │
                      │  ┌─────────────────────────────────────┐  │
                      │  │        Transaction Processing       │  │
                      │  │ - Parallel Execution (1M+ TPS)      │  │
                      │  │ - Cost Reduction (100x cheaper)     │  │
                      │  │ - Instant Finality (<2s)            │  │
                      │  └─────────────────────────────────────┘  │
                      │                                           │
                      │  ┌─────────────────────────────────────┐  │
                      │  │         Optimistic Rollups          │  │
                      │  │ - Batch Transactions                │  │
                      │  │ - Generate State Roots              │  │
                      │  │ - Submit Proofs to L1               │  │
                      │  └─────────────────────────────────────┘  │
                      │                                           │
                      │  ┌─────────────────────────────────────┐  │
                      │  │         AI Computation Layer        │  │
                      │  │ - Decentralized Inference           │  │
                      │  │ - Model Parallelization             │  │
                      │  │ - Dynamic Load Balancing            │  │
                      │  └─────────────────────────────────────┘  │
                      └────────┬─────────────────────┬────────────┘
                               │                     │
                               ▼                     ▼
                ┌──────────────────────┐   ┌──────────────────────┐
                │ Neural Cluster Alpha │   │ Neural Cluster Beta  │
                │ ┌────────────────┐   │   │ ┌────────────────┐   │
                │ │ Language AI    │   │   │ │ Vision AI      │   │
                │ │ - Chat Models  │   │   │ │ - Image Gen    │   │
                │ │ - Code Gen     │   │   │ │ - Video Proc   │   │
                │ └────────────────┘   │   │ └────────────────┘   │
                │ ┌────────────────┐   │   │ ┌────────────────┐   │
                │ │ Optimization   │   │   │ │ Optimization   │   │
                │ │ - Token Opt    │   │   │ │ - VRAM Opt     │   │
                │ │ - Batch Proc   │   │   │ │ - GPU Sharing  │   │
                │ └────────────────┘   │   │ └────────────────┘   │
                │ ┌────────────────┐   │   │ ┌────────────────┐   │
                │ │ Verification   │   │   │ │ Verification   │   │
                │ │ - Output Val   │   │   │ │ - Quality Val  │   │
                │ │ - Safety Check │   │   │ │ - Style Check  │   │
                │ └────────────────┘   │   │ └────────────────┘   │
                └──────────────────────┘   └──────────────────────┘
`}
              </pre>
            </motion.div>

            {/* Core Components */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-mystic-purple mb-6">🗝️ Core Components</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Oasis Node Layer</h3>
                  <p className="text-gray-400">Distributed network of validator nodes running AI workloads with secure state management and consensus.</p>
                </div>
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Bridge Protocol</h3>
                  <p className="text-gray-400">Secure asset bridging between Solana L1 and Oasis L2 with fraud proofs and challenge periods.</p>
                </div>
              </div>
            </motion.section>

            {/* Technical Details */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-mystic-purple mb-6">⛧ Technical Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Consensus</h3>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>Optimistic rollup model</li>
                    <li>7-day challenge period</li>
                    <li>Fraud proof system</li>
                  </ul>
                </div>
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">State Management</h3>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>Merkle tree state</li>
                    <li>IPFS data availability</li>
                    <li>State compression</li>
                  </ul>
                </div>
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Network</h3>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>P2P networking</li>
                    <li>Gossip protocol</li>
                    <li>Secure channels</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Code Example */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-mystic-purple mb-6">📓 Sacred Incantations</h2>
              <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                <pre className="text-purple-300 overflow-x-auto">
{`// Node Configuration
pub struct NodeConfig {
    // Network settings
    pub network: NetworkConfig,
    // State management
    pub state: StateConfig,
    // Bridge settings
    pub bridge: BridgeConfig,
}

// State Management
pub struct StateManager {
    // Current state root
    current_root: Hash,
    // Pending updates
    pending_updates: Vec<StateUpdate>,
    // Proof generator
    proof_gen: ProofGenerator,
}`}
                </pre>
              </div>
            </motion.section>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureGrimoire; 