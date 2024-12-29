import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import Head from 'next/head';
import { useRouter } from 'next/router';

const ProtocolGrimoire = () => {
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
        <title>Sacred Protocol | Solana Oasis</title>
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
              🗝️ Sacred Protocol
            </motion.h1>

            {/* Protocol Overview */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-mystic-purple mb-6">⚔️ Protocol Overview</h2>
              <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                <p className="text-gray-400 mb-4">
                  The Solana Oasis protocol combines optimistic rollups with distributed AI computation to create a powerful Layer 2 scaling solution.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                  <div>
                    <h3 className="text-xl font-bold text-purple-400 mb-4">Key Features</h3>
                    <ul className="list-disc list-inside text-gray-400">
                      <li>Optimistic rollup security</li>
                      <li>Distributed AI computation</li>
                      <li>Fraud proof system</li>
                      <li>Cross-chain messaging</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-400 mb-4">Benefits</h3>
                    <ul className="list-disc list-inside text-gray-400">
                      <li>High throughput</li>
                      <li>Low latency</li>
                      <li>Cost efficiency</li>
                      <li>Scalability</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Protocol Flow */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-mystic-purple mb-6">⛧ Protocol Flow</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Transaction Flow</h3>
                  <pre className="text-purple-300 overflow-x-auto">
{`
1. Transaction Submission
   ↓
2. Batch Formation
   ↓
3. State Transition
   ↓
4. Proof Generation
   ↓
5. L1 Commitment
   ↓
6. Challenge Period
   ↓
7. Finalization
`}
                  </pre>
                </div>
              </div>
            </motion.section>

            {/* State Management */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-mystic-purple mb-6">🌒 State Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">State Updates</h3>
                  <pre className="text-purple-300 overflow-x-auto">
{`pub struct StateUpdate {
    previous_root: Hash,
    new_root: Hash,
    transactions: Vec<Transaction>,
    proof: StateProof,
}`}
                  </pre>
                </div>
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Fraud Proofs</h3>
                  <pre className="text-purple-300 overflow-x-auto">
{`pub struct FraudProof {
    state_root: Hash,
    invalid_block: Block,
    witness_data: Vec<u8>,
    proof: InvalidityProof,
}`}
                  </pre>
                </div>
              </div>
            </motion.section>

            {/* Network Topology */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-mystic-purple mb-6">📓 Network Topology</h2>
              <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                <pre className="text-purple-300 overflow-x-auto">
{`
Validator Nodes <─────> Sequencer Nodes
       ↑                      ↑
       │                      │
       ↓                      ↓
  AI Nodes <──────────> Bridge Nodes
       ↑                      ↑
       │                      │
       ↓                      ↓
   Storage Nodes <────> State Nodes
`}
                </pre>
              </div>
            </motion.section>

            {/* Protocol Parameters */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-mystic-purple mb-6">⚡ Protocol Parameters</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Timing</h3>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>Block time: 2s</li>
                    <li>Challenge period: 7d</li>
                    <li>Batch size: 1000 tx</li>
                  </ul>
                </div>
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Economics</h3>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>Min stake: 1000 SOL</li>
                    <li>Slash amount: 100 SOL</li>
                    <li>Fee model: Dynamic</li>
                  </ul>
                </div>
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Network</h3>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>Min validators: 10</li>
                    <li>Max batch size: 10MB</li>
                    <li>Peer limit: 50</li>
                  </ul>
                </div>
              </div>
            </motion.section>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProtocolGrimoire; 