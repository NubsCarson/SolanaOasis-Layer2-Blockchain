import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import Head from 'next/head';
import { useRouter } from 'next/router';

const APIGrimoire = () => {
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
        <title>Sacred API | Solana Oasis</title>
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
              ⛧ Sacred API Incantations
            </motion.h1>

            {/* Base URLs */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-mystic-purple mb-6">🗝️ Sacred Gateways</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-2">Mainnet Realm</h3>
                  <code className="text-gray-400">Coming Soon</code>
                </div>
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-2">Testnet Void</h3>
                  <code className="text-gray-400">Coming Soon</code>
                </div>
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-2">Local Nexus</h3>
                  <code className="text-gray-400">http://localhost:8899</code>
                </div>
              </div>
            </motion.section>

            {/* Authentication */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-mystic-purple mb-6">⚔️ Sacred Authentication</h2>
              <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                <pre className="text-purple-300 overflow-x-auto">
{`// Include in all requests
{
  "headers": {
    "Authorization": "Bearer YOUR_SACRED_TOKEN",
    "Content-Type": "application/json"
  }
}`}
                </pre>
              </div>
            </motion.section>

            {/* Endpoints */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-mystic-purple mb-6">📓 Sacred Endpoints</h2>
              
              {/* State Endpoints */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-purple-400 mb-4">State Divination</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-2 py-1 rounded bg-purple-900 text-purple-300">GET</span>
                      <code className="text-gray-400">/v1/state/latest</code>
                    </div>
                    <p className="text-gray-400 mb-4">Scry the latest state root</p>
                    <pre className="text-purple-300 overflow-x-auto">
{`// Response
{
  "root": "0x...",
  "timestamp": 1234567890,
  "block_height": 1234567
}`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Transaction Endpoints */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-purple-400 mb-4">Transaction Alchemy</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-2 py-1 rounded bg-purple-900 text-purple-300">POST</span>
                      <code className="text-gray-400">/v1/transaction</code>
                    </div>
                    <p className="text-gray-400 mb-4">Channel a new transaction into the void</p>
                    <pre className="text-purple-300 overflow-x-auto">
{`// Request
{
  "type": "computation",
  "payload": {
    "model": "gpt-4",
    "input": "Analyze this text...",
    "params": {
      "temperature": 0.7,
      "maxTokens": 100
    }
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Bridge Endpoints */}
              <div>
                <h3 className="text-2xl font-bold text-purple-400 mb-4">Bridge Rituals</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-2 py-1 rounded bg-purple-900 text-purple-300">POST</span>
                      <code className="text-gray-400">/v1/bridge/deposit</code>
                    </div>
                    <p className="text-gray-400 mb-4">Channel assets between realms</p>
                    <pre className="text-purple-300 overflow-x-auto">
{`// Request
{
  "amount": "1000000000",
  "token": "SOL",
  "destination": "0x..."
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Error Handling */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-mystic-purple mb-6">⚡ Error Manifestations</h2>
              <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                <pre className="text-purple-300 overflow-x-auto">
{`// Error Response Format
{
  "error": {
    "code": "invalid_invocation",
    "message": "The ritual pattern is malformed",
    "details": {
      "field": "payload",
      "issue": "missing sacred component"
    }
  }
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

export default APIGrimoire; 