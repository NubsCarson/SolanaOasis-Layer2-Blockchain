import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import Head from 'next/head';
import { useRouter } from 'next/router';

const SecurityGrimoire = () => {
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
        <title>Sacred Security | Solana Oasis</title>
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
              ⚔️ Sacred Security Protocols
            </motion.h1>

            {/* Security Overview */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-mystic-purple mb-6">🗝️ Security Overview</h2>
              <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                <p className="text-gray-400 mb-4">
                  The Solana Oasis security framework combines cryptographic protections, economic incentives, and rigorous validation to ensure the safety of assets and computations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                  <div>
                    <h3 className="text-xl font-bold text-purple-400 mb-4">Core Principles</h3>
                    <ul className="list-disc list-inside text-gray-400">
                      <li>Defense in depth</li>
                      <li>Economic security</li>
                      <li>Cryptographic proofs</li>
                      <li>Decentralized validation</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-400 mb-4">Protection Layers</h3>
                    <ul className="list-disc list-inside text-gray-400">
                      <li>Network security</li>
                      <li>Protocol security</li>
                      <li>Smart contract security</li>
                      <li>Operational security</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Threat Model */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-mystic-purple mb-6">⛧ Threat Model</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Attack Vectors</h3>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>Bridge attacks</li>
                    <li>Validator collusion</li>
                    <li>Network partitions</li>
                    <li>Smart contract exploits</li>
                  </ul>
                </div>
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Mitigations</h3>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>Fraud proofs</li>
                    <li>Economic penalties</li>
                    <li>Multi-sig controls</li>
                    <li>Emergency procedures</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Security Measures */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-mystic-purple mb-6">📓 Security Measures</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Cryptographic</h3>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>ZK proofs</li>
                    <li>Threshold signatures</li>
                    <li>Secure channels</li>
                  </ul>
                </div>
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Economic</h3>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>Stake requirements</li>
                    <li>Slashing conditions</li>
                    <li>Reward mechanisms</li>
                  </ul>
                </div>
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Operational</h3>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>Access controls</li>
                    <li>Monitoring systems</li>
                    <li>Incident response</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Security Protocols */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-mystic-purple mb-6">⚡ Security Protocols</h2>
              <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                <pre className="text-purple-300 overflow-x-auto">
{`// Security Protocol Implementation
pub struct SecurityProtocol {
    // Cryptographic components
    crypto: CryptoConfig,
    // Validation rules
    validation: ValidationRules,
    // Emergency procedures
    emergency: EmergencyProcedures,
}

// Validation Rules
pub struct ValidationRules {
    // Minimum stake requirement
    min_stake: u64,
    // Minimum validator count
    min_validators: u32,
    // Challenge period duration
    challenge_period: Duration,
    // Slashing conditions
    slashing_conditions: Vec<SlashingCondition>,
}`}
                </pre>
              </div>
            </motion.section>

            {/* Reporting */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-mystic-purple mb-6">🌒 Sacred Reporting</h2>
              <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                <h3 className="text-xl font-bold text-purple-400 mb-4">Contact Channels</h3>
                <ul className="list-none space-y-4 text-gray-400">
                  <li>
                    <span className="font-bold">Ethereal Mail:</span>
                    <br />
                    <code>Coming Soon</code>
                  </li>
                  <li>
                    <span className="font-bold">Sacred Key:</span>
                    <br />
                    <code>Coming Soon</code>
                  </li>
                </ul>
              </div>
            </motion.section>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SecurityGrimoire; 