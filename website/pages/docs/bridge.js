import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import Head from 'next/head';
import { useRouter } from 'next/router';

const BridgeGrimoire = () => {
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
        <title>Sacred Bridge | Solana Oasis</title>
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
              ⛧ Sacred Bridge Protocol
            </motion.h1>

            {/* Bridge Overview */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-mystic-purple mb-6">🗝️ Bridge Overview</h2>
              <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                <p className="text-gray-400 mb-4">
                  The Sacred Bridge enables secure asset and message transfer between Solana L1 and the Oasis L2, utilizing optimistic rollup technology with fraud proofs.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                  <div>
                    <h3 className="text-xl font-bold text-purple-400 mb-4">Key Features</h3>
                    <ul className="list-disc list-inside text-gray-400">
                      <li>Trustless bridging</li>
                      <li>Fraud proof system</li>
                      <li>Challenge mechanism</li>
                      <li>Fast finality</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-400 mb-4">Supported Assets</h3>
                    <ul className="list-disc list-inside text-gray-400">
                      <li>Native SOL</li>
                      <li>SPL Tokens</li>
                      <li>NFTs</li>
                      <li>Messages</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Bridge Architecture */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-mystic-purple mb-6">⚔️ Bridge Architecture</h2>
              <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                <pre className="text-purple-300 overflow-x-auto">
{`
                    Solana L1
                        ↕
              ┌─────────────────────┐
              │    Bridge Portal    │
              └─────────────────────┘
                        ↕
                    Oasis L2
                    
Components:
- L1 Bridge Contract
- L2 Bridge Contract
- Message Queue
- Validator Network
- Challenge System
`}
                </pre>
              </div>
            </motion.section>

            {/* Bridge Operations */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-mystic-purple mb-6">📓 Bridge Operations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Deposit Flow</h3>
                  <pre className="text-purple-300 overflow-x-auto">
{`1. Lock assets in L1 contract
2. Generate deposit proof
3. Submit proof to L2
4. Wait for confirmation
5. Receive assets on L2`}
                  </pre>
                </div>
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Withdrawal Flow</h3>
                  <pre className="text-purple-300 overflow-x-auto">
{`1. Burn assets on L2
2. Generate withdrawal proof
3. Wait challenge period
4. Submit proof to L1
5. Claim assets on L1`}
                  </pre>
                </div>
              </div>
            </motion.section>

            {/* Message Protocol */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-mystic-purple mb-6">⚡ Message Protocol</h2>
              <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                <h3 className="text-xl font-bold text-purple-400 mb-4">Message Structure</h3>
                <pre className="text-purple-300 overflow-x-auto">
{`pub struct BridgeMessage {
    // Message identifier
    id: Hash,
    // Source chain
    source: ChainId,
    // Destination chain
    destination: ChainId,
    // Message sender
    sender: Address,
    // Message recipient
    recipient: Address,
    // Message payload
    payload: Vec<u8>,
    // Nonce for uniqueness
    nonce: u64,
}`}
                </pre>
              </div>
            </motion.section>

            {/* Security Measures */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-mystic-purple mb-6">🌒 Security Measures</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Validation</h3>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>Proof verification</li>
                    <li>Signature checks</li>
                    <li>State validation</li>
                  </ul>
                </div>
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Challenge System</h3>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>7-day window</li>
                    <li>Fraud detection</li>
                    <li>Slashing</li>
                  </ul>
                </div>
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Emergency</h3>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>Pause mechanism</li>
                    <li>Emergency exit</li>
                    <li>Fund recovery</li>
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

export default BridgeGrimoire; 