import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useRouter } from 'next/router';
import MetaHead from '../components/MetaHead';
import Footer from '../components/Footer';

const BuildWithUs = () => {
  const router = useRouter();
  const [selectedPath, setSelectedPath] = useState(null);
  const [showReward, setShowReward] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [level, setLevel] = useState(1);
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState(null);
  const controls = useAnimation();
  const [hasAnimated, setHasAnimated] = useState(false);
  const cardControls = [useAnimation(), useAnimation(), useAnimation()];

  // Animation variants
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

  const paths = [
    {
      title: "Core Protocol Developer",
      level: 1,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      description: "Shape the future of Layer 2 scaling",
      tasks: ["Master Rust", "Understand Layer 2", "Contribute to Core"],
      color: "from-purple-600/20 to-blue-600/20",
      achievement: {
        title: "Protocol Pioneer",
        description: "You've taken your first step into the core of Solana Oasis",
        icon: "🔮"
      }
    },
    {
      title: "AI Integration Specialist",
      level: 2,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      description: "Develop neural network integrations",
      tasks: ["Study AI/ML", "Neural Network Design", "Layer 2 AI Integration"],
      color: "from-purple-600/20 to-pink-600/20",
      achievement: {
        title: "Neural Navigator",
        description: "You've unlocked the secrets of AI integration",
        icon: "🧠"
      }
    },
    {
      title: "Sacred Architect",
      level: 3,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      description: "Design the mystical infrastructure",
      tasks: ["System Architecture", "Performance Optimization", "Scalability Design"],
      color: "from-purple-600/20 to-indigo-600/20",
      achievement: {
        title: "Master Builder",
        description: "You've mastered the art of Layer 2 architecture",
        icon: "⚡"
      }
    }
  ];

  const handlePathSelect = async (index) => {
    if (selectedPath === index || hasAnimated) return;
    
    setSelectedPath(index);
    setShowReward(true);
    setHasAnimated(true);

    // Add achievement
    const newAchievement = paths[index].achievement;
    if (!achievements.find(a => a.title === newAchievement.title)) {
      setAchievements([...achievements, newAchievement]);
      setCurrentAchievement(newAchievement);
      setShowAchievement(true);
      
      // Hide achievement after 3 seconds
      setTimeout(() => {
        setShowAchievement(false);
      }, 3000);
    }

    // Level up
    setLevel(paths[index].level);

    await controls.start({
      scale: [1, 1.02, 1],
      transition: { duration: 0.5 }
    });

    setTimeout(() => {
      setShowReward(false);
      router.push('https://github.com/NubsCarson/SolanaOasis-Layer2');
    }, 2000);
  };

  return (
    <div className="relative min-h-screen w-full bg-void-black overflow-hidden flex flex-col">
      <MetaHead title="Build With Us | Solana Oasis" />

      {/* Level Display */}
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-4">
        <div className="px-4 py-2 rounded-lg bg-purple-900/50 border border-purple-500/30">
          <span className="text-purple-300">Level {level}</span>
        </div>
        <div className="px-4 py-2 rounded-lg bg-purple-900/50 border border-purple-500/30">
          <span className="text-purple-300">{achievements.length} Achievements</span>
        </div>
      </div>

      {/* Back Button */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => router.push('/')}
          className="flex items-center space-x-2 text-purple-300 hover:text-purple-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Home</span>
        </button>
      </div>

      {/* Achievement Popup */}
      <AnimatePresence>
        {showAchievement && currentAchievement && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-purple-900/80 border border-purple-500 rounded-lg p-4 backdrop-blur-lg">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{currentAchievement.icon}</span>
                <div>
                  <h3 className="text-purple-300 font-bold">{currentAchievement.title}</h3>
                  <p className="text-purple-200/80 text-sm">{currentAchievement.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-grow flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="text-center mb-16"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-purple-300 mb-6 glow-text"
          >
            Choose Your Sacred Path
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Join the mystical journey of building the next generation of Layer 2 solutions. Select your path and unlock the secrets of Solana Oasis.
          </motion.p>
        </motion.div>

        {/* Path Selection Grid */}
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto mb-12"
        >
          {paths.map((path, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              animate={cardControls[index]}
              initial={{ y: 0, boxShadow: '0 0 10px rgba(139, 92, 246, 0.3)' }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-6 rounded-lg backdrop-blur-sm cursor-pointer transition-all duration-300
                ${selectedPath === index ? 'bg-purple-900/40 border-purple-400' : 'bg-black/30 border-purple-500/30'}
                border hover:border-purple-400 group overflow-hidden`}
              onClick={() => handlePathSelect(index)}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
              
              <div className="relative z-10">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-purple-900/50 text-purple-300">
                    {path.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-purple-300 mb-2">{path.title}</h3>
                <p className="text-gray-400 mb-4">{path.description}</p>
                <ul className="text-sm text-gray-500 space-y-2">
                  {path.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Animated Border */}
              <div className="absolute inset-0 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/50 to-purple-600/0 animate-shimmer" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Reward Animation */}
        <AnimatePresence>
          {showReward && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black/70"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, ease: "linear" }}
                  className="text-6xl mb-4"
                >
                  🌟
                </motion.div>
                <h2 className="text-2xl font-bold text-purple-300 mb-2">Path Unlocked!</h2>
                <p className="text-gray-400">You've chosen your sacred path. Your journey begins...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* GitHub Link */}
        <motion.div variants={containerVariants} className="text-center mt-8">
          <motion.a
            variants={itemVariants}
            href="https://github.com/NubsCarson/SolanaOasis-Layer2"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-purple-900/50 hover:bg-purple-800/60 rounded-lg transition-all duration-300"
          >
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Begin Your Journey on GitHub
          </motion.a>
        </motion.div>
      </div>

      <Footer />

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default BuildWithUs; 