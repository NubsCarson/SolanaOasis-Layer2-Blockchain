import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars, Text3D, Center } from '@react-three/drei';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import MetaHead from '../components/MetaHead';

const DocPortal = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate loading for the animation
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  const pageTransition = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.2 }
  };

  const portalAnimation = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        duration: 1.5,
        ease: "easeOut"
      }
    }
  };

  const contentAnimation = {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        delay: 2,
        duration: 0.8
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-void-black overflow-hidden">
      <MetaHead 
        title="Sacred Documentation | Solana Oasis"
        description="Explore the sacred texts of Solana Oasis Layer 2 - comprehensive documentation for developers and users."
      />

      {/* Portal Animation */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-void-black">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ 
              scale: [1, 2, 0],
              rotate: [0, 180, 360],
            }}
            transition={{ 
              duration: 2,
              times: [0, 0.8, 1],
              ease: "easeInOut"
            }}
            className="w-32 h-32 rounded-full bg-gradient-to-r from-mystic-purple to-digital-blue"
          />
        </div>
      )}

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
        </Canvas>
      </div>

      {/* Content */}
      <motion.div
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative z-10 min-h-screen flex flex-col"
      >
        <div className="container mx-auto px-4 flex-grow flex flex-col py-24">
          {/* Navigation */}
          <motion.nav 
            variants={contentAnimation}
            className="flex justify-center items-center mb-24"
          >
            <button 
              onClick={() => router.push('/')}
              className="text-mystic-purple hover:text-purple-400 transition-colors text-lg flex items-center gap-2 group"
            >
              <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
              Return to the Void
            </button>
          </motion.nav>

          {/* Main Content */}
          <motion.div variants={contentAnimation} className="flex-grow flex flex-col items-center justify-center">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <svg className="w-12 h-12 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h1 className="text-6xl md:text-7xl font-bold text-white glow-text tracking-tight">Sacred Documentation</h1>
              </div>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">Explore the mystical knowledge of Solana Oasis through these sacred texts</p>
            </div>
            
            {/* Documentation Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto w-full">
              {/* Architecture */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-xl bg-black/40 backdrop-blur-sm border border-mystic-purple/20 hover:border-mystic-purple/50 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-900/50 group-hover:bg-purple-800/50 transition-colors">
                    <svg className="w-6 h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-mystic-purple">Architecture</h2>
                </div>
                <p className="text-gray-400 mb-8 text-lg flex-grow">Explore the sacred foundations of our digital realm.</p>
                <a href="/docs/architecture" className="inline-flex items-center justify-center w-full px-6 py-3 text-lg font-medium text-white bg-purple-900/50 hover:bg-purple-800/60 rounded-lg transition-all duration-300 group">
                  Read Documentation
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </motion.div>

              {/* Protocol */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-xl bg-black/40 backdrop-blur-sm border border-mystic-purple/20 hover:border-mystic-purple/50 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-900/50 group-hover:bg-purple-800/50 transition-colors">
                    <svg className="w-6 h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-mystic-purple">Protocol</h2>
                </div>
                <p className="text-gray-400 mb-8 text-lg flex-grow">Understand the mystical protocols that power our network.</p>
                <a href="/docs/protocol" className="inline-flex items-center justify-center w-full px-6 py-3 text-lg font-medium text-white bg-purple-900/50 rounded-lg hover:bg-purple-800/50 transition-all group">
                  Read Documentation
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </motion.div>

              {/* API */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-xl bg-black/40 backdrop-blur-sm border border-mystic-purple/20 hover:border-mystic-purple/50 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-900/50 group-hover:bg-purple-800/50 transition-colors">
                    <svg className="w-6 h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-mystic-purple">API</h2>
                </div>
                <p className="text-gray-400 mb-8 text-lg flex-grow">Master the sacred incantations of our API.</p>
                <a href="/docs/api" className="inline-flex items-center justify-center w-full px-6 py-3 text-lg font-medium text-white bg-purple-900/50 rounded-lg hover:bg-purple-800/50 transition-all group">
                  Read Documentation
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </motion.div>

              {/* Bridge */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-xl bg-black/40 backdrop-blur-sm border border-mystic-purple/20 hover:border-mystic-purple/50 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-900/50 group-hover:bg-purple-800/50 transition-colors">
                    <svg className="w-6 h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-mystic-purple">Bridge</h2>
                </div>
                <p className="text-gray-400 mb-8 text-lg flex-grow">Learn about the mystical bridge between realms.</p>
                <a href="/docs/bridge" className="inline-flex items-center justify-center w-full px-6 py-3 text-lg font-medium text-white bg-purple-900/50 rounded-lg hover:bg-purple-800/50 transition-all group">
                  Read Documentation
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </motion.div>

              {/* Security */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-xl bg-black/40 backdrop-blur-sm border border-mystic-purple/20 hover:border-mystic-purple/50 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-900/50 group-hover:bg-purple-800/50 transition-colors">
                    <svg className="w-6 h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-mystic-purple">Security</h2>
                </div>
                <p className="text-gray-400 mb-8 text-lg flex-grow">Discover the wards that protect our digital sanctum.</p>
                <a href="/docs/security" className="inline-flex items-center justify-center w-full px-6 py-3 text-lg font-medium text-white bg-purple-900/50 rounded-lg hover:bg-purple-800/50 transition-all group">
                  Read Documentation
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </motion.div>

              {/* SDK */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-xl bg-black/40 backdrop-blur-sm border border-mystic-purple/20 hover:border-mystic-purple/50 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-900/50 group-hover:bg-purple-800/50 transition-colors">
                    <svg className="w-6 h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-mystic-purple">SDK</h2>
                </div>
                <p className="text-gray-400 mb-8 text-lg flex-grow">Wield the power of our development tools.</p>
                <a href="/docs/sdk" className="inline-flex items-center justify-center w-full px-6 py-3 text-lg font-medium text-white bg-purple-900/50 rounded-lg hover:bg-purple-800/50 transition-all group">
                  Read Documentation
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </motion.div>
            </div>
          </motion.div>
          <Footer />
        </div>
      </motion.div>
    </div>
  );
};

export default DocPortal; 