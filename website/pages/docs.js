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
        <div className="container mx-auto px-4 flex-grow flex flex-col py-12 md:py-24">
          {/* Navigation */}
          <motion.nav 
            variants={contentAnimation}
            className="flex justify-center items-center mb-12 md:mb-24"
          >
            <button 
              onClick={() => router.push('/')}
              className="text-mystic-purple hover:text-purple-400 transition-colors text-base md:text-lg flex items-center gap-2 group"
            >
              <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
              Return to the Void
            </button>
          </motion.nav>

          {/* Main Content */}
          <motion.div variants={contentAnimation} className="flex-grow flex flex-col items-center justify-center">
            <div className="text-center mb-8 md:mb-16">
              <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
                <svg className="w-8 h-8 md:w-12 md:h-12 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white glow-text tracking-tight">Sacred Documentation</h1>
              </div>
              <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto px-4">Explore the mystical knowledge of Solana Oasis through these sacred texts</p>
            </div>
            
            {/* Documentation Sections */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-10 max-w-7xl mx-auto w-full px-4">
              {/* Architecture */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-4 sm:p-6 md:p-8 rounded-xl bg-black/40 backdrop-blur-sm border border-mystic-purple/20 hover:border-mystic-purple/50 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-purple-900/50 group-hover:bg-purple-800/50 transition-colors">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                    </svg>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-mystic-purple">Architecture</h2>
                </div>
                <p className="text-base md:text-lg text-gray-400 mb-6 md:mb-8 flex-grow">Explore the sacred foundations of our digital realm.</p>
                <a href="/docs/architecture" className="inline-flex items-center justify-center w-full px-4 md:px-6 py-2.5 md:py-3 text-base md:text-lg font-medium text-white bg-purple-900/50 hover:bg-purple-800/60 rounded-lg transition-all duration-300 group">
                  Read Documentation
                  <svg className="w-4 h-4 md:w-5 md:h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </motion.div>

              {/* Protocol */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-4 sm:p-6 md:p-8 rounded-xl bg-black/40 backdrop-blur-sm border border-mystic-purple/20 hover:border-mystic-purple/50 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-purple-900/50 group-hover:bg-purple-800/50 transition-colors">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-mystic-purple">Protocol</h2>
                </div>
                <p className="text-base md:text-lg text-gray-400 mb-6 md:mb-8 flex-grow">Understand the mystical protocols that power our network.</p>
                <a href="/docs/protocol" className="inline-flex items-center justify-center w-full px-4 md:px-6 py-2.5 md:py-3 text-base md:text-lg font-medium text-white bg-purple-900/50 hover:bg-purple-800/60 rounded-lg transition-all duration-300 group">
                  Read Documentation
                  <svg className="w-4 h-4 md:w-5 md:h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </motion.div>

              {/* API */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-4 sm:p-6 md:p-8 rounded-xl bg-black/40 backdrop-blur-sm border border-mystic-purple/20 hover:border-mystic-purple/50 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-purple-900/50 group-hover:bg-purple-800/50 transition-colors">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-mystic-purple">API</h2>
                </div>
                <p className="text-base md:text-lg text-gray-400 mb-6 md:mb-8 flex-grow">Master the sacred incantations of our API.</p>
                <a href="/docs/api" className="inline-flex items-center justify-center w-full px-4 md:px-6 py-2.5 md:py-3 text-base md:text-lg font-medium text-white bg-purple-900/50 hover:bg-purple-800/60 rounded-lg transition-all duration-300 group">
                  Read Documentation
                  <svg className="w-4 h-4 md:w-5 md:h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </motion.div>

              {/* Bridge */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-4 sm:p-6 md:p-8 rounded-xl bg-black/40 backdrop-blur-sm border border-mystic-purple/20 hover:border-mystic-purple/50 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-purple-900/50 group-hover:bg-purple-800/50 transition-colors">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-mystic-purple">Bridge</h2>
                </div>
                <p className="text-base md:text-lg text-gray-400 mb-6 md:mb-8 flex-grow">Learn about the mystical bridge between realms.</p>
                <a href="/docs/bridge" className="inline-flex items-center justify-center w-full px-4 md:px-6 py-2.5 md:py-3 text-base md:text-lg font-medium text-white bg-purple-900/50 hover:bg-purple-800/60 rounded-lg transition-all duration-300 group">
                  Read Documentation
                  <svg className="w-4 h-4 md:w-5 md:h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </motion.div>

              {/* Security */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-4 sm:p-6 md:p-8 rounded-xl bg-black/40 backdrop-blur-sm border border-mystic-purple/20 hover:border-mystic-purple/50 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-purple-900/50 group-hover:bg-purple-800/50 transition-colors">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-mystic-purple">Security</h2>
                </div>
                <p className="text-base md:text-lg text-gray-400 mb-6 md:mb-8 flex-grow">Discover the wards that protect our digital sanctum.</p>
                <a href="/docs/security" className="inline-flex items-center justify-center w-full px-4 md:px-6 py-2.5 md:py-3 text-base md:text-lg font-medium text-white bg-purple-900/50 hover:bg-purple-800/60 rounded-lg transition-all duration-300 group">
                  Read Documentation
                  <svg className="w-4 h-4 md:w-5 md:h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </motion.div>

              {/* SDK */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-4 sm:p-6 md:p-8 rounded-xl bg-black/40 backdrop-blur-sm border border-mystic-purple/20 hover:border-mystic-purple/50 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-purple-900/50 group-hover:bg-purple-800/50 transition-colors">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-mystic-purple">SDK</h2>
                </div>
                <p className="text-base md:text-lg text-gray-400 mb-6 md:mb-8 flex-grow">Wield the power of our development tools.</p>
                <a href="/docs/sdk" className="inline-flex items-center justify-center w-full px-4 md:px-6 py-2.5 md:py-3 text-base md:text-lg font-medium text-white bg-purple-900/50 hover:bg-purple-800/60 rounded-lg transition-all duration-300 group">
                  Read Documentation
                  <svg className="w-4 h-4 md:w-5 md:h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </motion.div>

              {/* Download */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-4 sm:p-6 md:p-8 rounded-xl bg-black/40 backdrop-blur-sm border border-mystic-purple/20 hover:border-mystic-purple/50 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-purple-900/50 group-hover:bg-purple-800/50 transition-colors">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-mystic-purple">Download</h2>
                </div>
                <p className="text-base md:text-lg text-gray-400 mb-6 md:mb-8 flex-grow">Install and set up Solana Oasis Layer2.</p>
                <a href="/download" className="inline-flex items-center justify-center w-full px-4 md:px-6 py-2.5 md:py-3 text-base md:text-lg font-medium text-white bg-purple-900/50 hover:bg-purple-800/60 rounded-lg transition-all duration-300 group">
                  View Installation Guide
                  <svg className="w-4 h-4 md:w-5 md:h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </motion.div>

              {/* Whitepaper */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-4 sm:p-6 md:p-8 rounded-xl bg-black/40 backdrop-blur-sm border border-mystic-purple/20 hover:border-mystic-purple/50 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-purple-900/50 group-hover:bg-purple-800/50 transition-colors">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-mystic-purple">Whitepaper</h2>
                </div>
                <p className="text-base md:text-lg text-gray-400 mb-6 md:mb-8 flex-grow">Read the sacred scrolls of Solana Oasis.</p>
                <a href="/whitepaper" className="inline-flex items-center justify-center w-full px-4 md:px-6 py-2.5 md:py-3 text-base md:text-lg font-medium text-white bg-purple-900/50 hover:bg-purple-800/60 rounded-lg transition-all duration-300 group">
                  Read Whitepaper
                  <svg className="w-4 h-4 md:w-5 md:h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </motion.div>

              {/* AI Playground */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-4 sm:p-6 md:p-8 rounded-xl bg-gradient-to-br from-black/40 to-yellow-900/20 backdrop-blur-sm border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 group flex flex-col h-full relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                <div className="relative flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-yellow-900/50 group-hover:bg-yellow-800/50 transition-colors">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-yellow-400">AI Playground</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></span>
                      <span className="text-xs text-yellow-400 font-semibold">Under Development</span>
                    </div>
                  </div>
                </div>
                <p className="relative text-base md:text-lg text-gray-300 mb-6 md:mb-8 flex-grow">
                  🚧 Our mystical engineers are crafting powerful AI experiences. Test{' '}
                  <a href="/docs/playground" className="hover:text-yellow-400 transition-colors duration-300 cursor-default">neural</a>{' '}
                  networks, visualize computations, and witness the magic of decentralized AI - Coming Soon!
                </p>
                <button disabled className="relative inline-flex items-center justify-center w-full px-4 md:px-6 py-2.5 md:py-3 text-base md:text-lg font-medium text-white/70 bg-gradient-to-r from-yellow-900/40 to-yellow-800/40 rounded-lg transition-all duration-300 group border border-yellow-500/20 cursor-not-allowed">
                  <svg className="w-5 h-5 mr-2 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  </svg>
                  Work in Progress
                </button>

                {/* Construction Elements */}
                <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-60 transition-opacity">
                  <svg className="w-16 h-16 text-yellow-400 animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="absolute bottom-4 left-4 opacity-30 group-hover:opacity-60 transition-opacity">
                  <svg className="w-12 h-12 text-yellow-400 animate-float-delayed" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
              </motion.div>
            </div>
          </motion.div>
          <Footer />
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DocPortal; 