import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import Head from 'next/head';
import { useRouter } from 'next/router';

const DocsPortal = () => {
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

  const cardVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } }
  };

  return (
    <div className="relative min-h-screen w-full bg-void-black overflow-hidden">
      <Head>
        <title>Sacred Documentation | Solana Oasis</title>
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
              onClick={() => router.push('/')}
              className="text-mystic-purple hover:text-purple-400 transition-colors"
            >
              ← Return to Sacred Gateway
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
              className="text-4xl md:text-6xl font-bold text-white mb-8 glow-text text-center"
            >
              📚 Sacred Documentation
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-400 text-center mb-16"
            >
              Explore the mystical knowledge of Solana Oasis through these sacred texts
            </motion.p>

            {/* Documentation Grid */}
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {/* Architecture */}
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="cursor-pointer"
                onClick={() => router.push('/docs/architecture')}
              >
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20 h-full transform transition-all duration-200 hover:border-mystic-purple/40">
                  <h2 className="text-2xl font-bold text-purple-400 mb-4">⚔️ Architecture</h2>
                  <p className="text-gray-400">
                    Discover the foundational structures and sacred geometries that power the Oasis network.
                  </p>
                </div>
              </motion.div>

              {/* Protocol */}
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="cursor-pointer"
                onClick={() => router.push('/docs/protocol')}
              >
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20 h-full transform transition-all duration-200 hover:border-mystic-purple/40">
                  <h2 className="text-2xl font-bold text-purple-400 mb-4">🗝️ Protocol</h2>
                  <p className="text-gray-400">
                    Understand the mystical protocols and rituals that govern the Oasis ecosystem.
                  </p>
                </div>
              </motion.div>

              {/* API */}
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="cursor-pointer"
                onClick={() => router.push('/docs/api')}
              >
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20 h-full transform transition-all duration-200 hover:border-mystic-purple/40">
                  <h2 className="text-2xl font-bold text-purple-400 mb-4">⛧ API</h2>
                  <p className="text-gray-400">
                    Master the sacred incantations to communicate with the Oasis network.
                  </p>
                </div>
              </motion.div>

              {/* Bridge */}
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="cursor-pointer"
                onClick={() => router.push('/docs/bridge')}
              >
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20 h-full transform transition-all duration-200 hover:border-mystic-purple/40">
                  <h2 className="text-2xl font-bold text-purple-400 mb-4">⚡ Bridge</h2>
                  <p className="text-gray-400">
                    Learn the art of bridging between realms through the sacred portals.
                  </p>
                </div>
              </motion.div>

              {/* Security */}
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="cursor-pointer"
                onClick={() => router.push('/docs/security')}
              >
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20 h-full transform transition-all duration-200 hover:border-mystic-purple/40">
                  <h2 className="text-2xl font-bold text-purple-400 mb-4">🌒 Security</h2>
                  <p className="text-gray-400">
                    Explore the protective wards and security measures that safeguard the network.
                  </p>
                </div>
              </motion.div>

              {/* SDK */}
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="cursor-pointer"
                onClick={() => router.push('/docs/sdk')}
              >
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20 h-full transform transition-all duration-200 hover:border-mystic-purple/40">
                  <h2 className="text-2xl font-bold text-purple-400 mb-4">📓 SDK</h2>
                  <p className="text-gray-400">
                    Wield the sacred tools and artifacts to build upon the Oasis network.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Additional Resources */}
            <motion.section 
              variants={itemVariants}
              className="mt-16"
            >
              <h2 className="text-3xl font-bold text-mystic-purple mb-8 text-center">Additional Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Community Channels</h3>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>Discord: Coming Soon</li>
                    <li>Twitter: Coming Soon</li>
                    <li>Telegram: Coming Soon</li>
                  </ul>
                </div>
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Development</h3>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>GitHub: Coming Soon</li>
                    <li>Developer Forum: Coming Soon</li>
                    <li>Bug Bounty: Coming Soon</li>
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

export default DocsPortal; 