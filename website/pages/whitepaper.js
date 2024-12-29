import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import Head from 'next/head';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';

const Whitepaper = () => {
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
    <div className="relative min-h-screen w-full bg-void-black overflow-hidden flex flex-col">
      <Head>
        <title>Sacred Scrolls | Solana Oasis Layer2</title>
      </Head>

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-grow container mx-auto px-4 py-8 md:py-16">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push('/')}
          className="mb-8 text-sm md:text-base text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </motion.button>

        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="prose prose-invert max-w-none"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6 md:mb-8 glow-text text-center"
          >
            📜 Sacred Scrolls of Oasis
          </motion.h1>

          {/* Abstract */}
          <motion.section variants={itemVariants} className="mb-12">
            <div className="rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20 p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-purple-400 mb-4">Abstract</h2>
              <p className="text-gray-300">
                Solana Oasis Layer2 presents a revolutionary scaling solution for the Solana blockchain,
                enabling unprecedented throughput for AI computation while maintaining decentralization
                and security. This whitepaper outlines our novel approach to Layer 2 scaling, combining
                advanced cryptographic techniques with efficient state management.
              </p>
            </div>
          </motion.section>

          {/* Introduction */}
          <motion.section variants={itemVariants} className="mb-12">
            <div className="rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20 p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-purple-400 mb-4">1. Introduction</h2>
              <p className="text-gray-300 mb-4">
                As blockchain technology evolves, the demand for scalable solutions that can handle
                complex AI computations becomes increasingly critical. Solana Oasis Layer2 addresses
                this challenge by introducing a novel scaling solution specifically designed for
                AI workloads.
              </p>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-purple-300">1.1 Background</h3>
                <p className="text-gray-300">
                  The intersection of blockchain and artificial intelligence presents unique challenges
                  in terms of computational requirements and data availability. Traditional Layer 1
                  solutions often struggle to meet these demands while maintaining decentralization.
                </p>
                <h3 className="text-xl font-semibold text-purple-300">1.2 Objectives</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Achieve 500k+ TPS for AI computations</li>
                  <li>Maintain sub-millisecond latency</li>
                  <li>Ensure data availability and security</li>
                  <li>Preserve decentralization principles</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Technical Architecture */}
          <motion.section variants={itemVariants} className="mb-12">
            <div className="rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20 p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-purple-400 mb-4">2. Technical Architecture</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-purple-300 mb-3">2.1 State Management</h3>
                  <p className="text-gray-300">
                    Our state management system utilizes advanced Merkle tree structures combined with
                    IPFS for efficient data availability. This hybrid approach enables rapid state
                    updates while maintaining verifiability.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-purple-300 mb-3">2.2 Consensus Mechanism</h3>
                  <p className="text-gray-300">
                    The Layer 2 solution implements a novel consensus mechanism optimized for AI
                    workloads, featuring rapid block production and efficient validation of
                    computational results.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-purple-300 mb-3">2.3 Bridge Protocol</h3>
                  <p className="text-gray-300">
                    A secure bridge protocol enables seamless interaction between Layer 1 and Layer 2,
                    with built-in fraud prevention and efficient proof verification.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Future Work */}
          <motion.section variants={itemVariants} className="mb-12">
            <div className="rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20 p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-purple-400 mb-4">3. Future Work</h2>
              <p className="text-gray-300 mb-4">
                The Solana Oasis Layer2 roadmap includes several exciting developments:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Advanced AI model integration capabilities</li>
                <li>Enhanced cross-chain interoperability</li>
                <li>Improved data compression techniques</li>
                <li>Extended developer tooling and SDKs</li>
              </ul>
            </div>
          </motion.section>

          {/* Conclusion */}
          <motion.section variants={itemVariants}>
            <div className="rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20 p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-purple-400 mb-4">4. Conclusion</h2>
              <p className="text-gray-300">
                Solana Oasis Layer2 represents a significant advancement in blockchain scaling
                technology, specifically tailored for AI computation needs. Through our innovative
                approach to state management and consensus, we provide a robust foundation for the
                future of decentralized AI applications.
              </p>
            </div>
          </motion.section>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Whitepaper; 