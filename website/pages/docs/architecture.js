import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';

const ArchitectureGrimoire = () => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const codeExample = `// Node Configuration
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
}`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        <div className="container mx-auto px-4 py-8 md:py-16">
          {/* Navigation */}
          <motion.nav 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8 md:mb-16"
          >
            <button 
              onClick={() => router.push('/docs')}
              className="text-sm md:text-base text-mystic-purple hover:text-purple-400 transition-colors"
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
              className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6 md:mb-8 glow-text"
            >
              ⚔️ Sacred Architecture
            </motion.h1>

            {/* Architecture Diagram */}
            <motion.div 
              variants={itemVariants}
              className="mb-8 md:mb-12 p-4 md:p-8 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20 overflow-x-auto"
            >
              <pre className="text-purple-300 text-xs md:text-sm whitespace-pre scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
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
            <motion.section variants={itemVariants} className="mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-mystic-purple mb-4 md:mb-6">🗝️ Core Components</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <div className="p-4 md:p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-lg md:text-xl font-bold text-purple-400 mb-2 md:mb-4">Oasis Node Layer</h3>
                  <p className="text-sm md:text-base text-gray-400">Distributed network of validator nodes running AI workloads with secure state management and consensus.</p>
                </div>
                <div className="p-4 md:p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-lg md:text-xl font-bold text-purple-400 mb-2 md:mb-4">Bridge Protocol</h3>
                  <p className="text-sm md:text-base text-gray-400">Secure asset bridging between Solana L1 and Oasis L2 with fraud proofs and challenge periods.</p>
                </div>
              </div>
            </motion.section>

            {/* Technical Details */}
            <motion.section variants={itemVariants} className="mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-mystic-purple mb-4 md:mb-6">⛧ Technical Specifications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                <div className="p-4 md:p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-lg md:text-xl font-bold text-purple-400 mb-2 md:mb-4">Consensus</h3>
                  <ul className="list-disc list-inside text-sm md:text-base text-gray-400 space-y-1">
                    <li>Optimistic rollup model</li>
                    <li>7-day challenge period</li>
                    <li>Fraud proof system</li>
                  </ul>
                </div>
                <div className="p-4 md:p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-lg md:text-xl font-bold text-purple-400 mb-2 md:mb-4">State Management</h3>
                  <ul className="list-disc list-inside text-sm md:text-base text-gray-400 space-y-1">
                    <li>Merkle tree state</li>
                    <li>IPFS data availability</li>
                    <li>State compression</li>
                  </ul>
                </div>
                <div className="p-4 md:p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-lg md:text-xl font-bold text-purple-400 mb-2 md:mb-4">Network</h3>
                  <ul className="list-disc list-inside text-sm md:text-base text-gray-400 space-y-1">
                    <li>P2P networking</li>
                    <li>Gossip protocol</li>
                    <li>Secure channels</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Code Example */}
            <motion.section variants={itemVariants} className="mb-8 md:mb-12">
              <div className="rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                <div className="px-4 md:px-6 py-3 md:py-4 border-b border-mystic-purple/20 flex justify-between items-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-mystic-purple">📓 Sacred Incantations</h2>
                  <button
                    onClick={() => copyToClipboard(codeExample)}
                    className="px-3 md:px-4 py-1 md:py-1.5 rounded bg-purple-800 hover:bg-purple-700 text-purple-100 text-xs md:text-sm transition-colors shadow-lg ml-4"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="relative p-4 md:p-6">
                  <pre className="text-purple-300 text-xs md:text-sm overflow-x-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
                    {codeExample}
                  </pre>
                </div>
              </div>
            </motion.section>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureGrimoire; 