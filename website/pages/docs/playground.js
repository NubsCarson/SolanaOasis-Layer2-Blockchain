import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Footer from '../../components/Footer';

const Layer2Node = ({ x, y, label, isActive }) => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ 
      scale: 1,
      boxShadow: isActive 
        ? [
            '0 0 0 0 rgba(147, 51, 234, 0)',
            '0 0 0 10px rgba(147, 51, 234, 0.1)',
            '0 0 0 20px rgba(147, 51, 234, 0)'
          ]
        : 'none'
    }}
    transition={{ 
      scale: { duration: 0.5 },
      boxShadow: { 
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop'
      }
    }}
    className={`absolute w-12 h-12 rounded-full flex items-center justify-center
      ${isActive ? 'bg-purple-600' : 'bg-purple-900/50'} 
      cursor-pointer hover:scale-110 transition-transform`}
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    <span className="text-xs text-white font-medium">{label}</span>
  </motion.div>
);

const Connection = ({ startX, startY, endX, endY, isActive }) => {
  const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
  const length = Math.hypot(endX - startX, endY - startY);

  return (
    <div 
      className={`absolute h-[2px]
        ${isActive ? 'bg-purple-500' : 'bg-purple-900/30'}`}
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
        width: `${length}%`,
        transform: `rotate(${angle}deg)`,
        transformOrigin: '0 50%',
        zIndex: 0
      }}
    >
      {isActive && (
        <motion.div
          initial={{ left: 0 }}
          animate={{ left: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute top-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="w-full h-full bg-purple-400 rounded-full opacity-75 scale-50" />
        </motion.div>
      )}
    </div>
  );
};

const AIPlayground = () => {
  const router = useRouter();
  const [activeDemo, setActiveDemo] = useState('text');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeNodes, setActiveNodes] = useState([]);
  const [activeConnections, setActiveConnections] = useState([]);
  const [showVisualization, setShowVisualization] = useState(false);

  const nodes = [
    // Layer 1 (Solana)
    { id: 1, x: 25, y: 50, label: 'Solana' },
    
    // Bridge node
    { id: 2, x: 40, y: 50, label: 'Bridge' },
    
    // Layer 2 nodes
    { id: 3, x: 60, y: 35, label: 'L2 Node' },
    { id: 4, x: 60, y: 65, label: 'L2 Node' },
    
    // Single validator
    { id: 5, x: 75, y: 50, label: 'Validator' },
    
    // Memory Pool
    { id: 6, x: 85, y: 50, label: 'Mem Pool' },
    
    // Consensus node
    { id: 7, x: 95, y: 50, label: 'Consensus' },
  ];

  const connections = [
    // Solana to Bridge (horizontal)
    { start: 1, end: 2 },
    
    // Bridge splits to L2 Nodes (diagonal lines)
    { start: 2, end: 3 },
    { start: 2, end: 4 },
    
    // L2 Nodes converge to Validator
    { start: 3, end: 5 },
    { start: 4, end: 5 },
    
    // Validator to Memory Pool (horizontal)
    { start: 5, end: 6 },
    
    // Memory Pool to Consensus (horizontal)
    { start: 6, end: 7 },
  ];

  useEffect(() => {
    if (!showVisualization) return;
    
    const interval = setInterval(() => {
      // Create meaningful flow patterns
      const flowPatterns = [
        // Flow through top L2 node
        [1, 2, 3, 5, 6, 7],
        // Flow through bottom L2 node
        [1, 2, 4, 5, 6, 7],
      ];
      
      const currentPattern = flowPatterns[Math.floor(Math.random() * flowPatterns.length)];
      setActiveNodes(currentPattern.slice(0, 4));
      
      setActiveConnections(connections.filter(conn => 
        currentPattern.includes(conn.start) && currentPattern.includes(conn.end)
      ));
    }, 2500);

    return () => clearInterval(interval);
  }, [showVisualization]);

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

  const handleProcess = () => {
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      setOutputText(`Processed: ${inputText}\n\nThis is a development preview of the AI Playground. More features coming soon!`);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen w-full bg-void-black overflow-hidden flex flex-col">
      <Head>
        <title>AI Playground | Solana Oasis Layer2</title>
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
          onClick={() => router.push('/docs')}
          className="mb-8 text-sm md:text-base text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Return to Documentation
        </motion.button>

        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="prose prose-invert max-w-none"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 glow-text">
              🧪 AI Playground
            </h1>
            <p className="text-lg text-gray-400">
              Developer Preview - Experiment with our AI capabilities
            </p>
          </motion.div>

          {/* Demo Selection */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setActiveDemo('text')}
                className={`px-4 py-2 rounded-lg ${
                  activeDemo === 'text'
                    ? 'bg-purple-900/60 text-white'
                    : 'bg-black/40 text-gray-400 hover:bg-purple-900/40'
                } transition-colors`}
              >
                Text Processing
              </button>
              <button
                onClick={() => setActiveDemo('vision')}
                className={`px-4 py-2 rounded-lg ${
                  activeDemo === 'vision'
                    ? 'bg-purple-900/60 text-white'
                    : 'bg-black/40 text-gray-400 hover:bg-purple-900/40'
                } transition-colors`}
              >
                Vision (Coming Soon)
              </button>
            </div>
          </motion.div>

          {/* Layer 2 Visualization Toggle */}
          <motion.div variants={itemVariants} className="mb-8 text-center">
            <button
              onClick={() => setShowVisualization(!showVisualization)}
              className="px-6 py-3 rounded-lg bg-purple-900/50 hover:bg-purple-800/60 text-white transition-colors flex items-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d={showVisualization 
                    ? "M19 9l-7 7-7-7"
                    : "M9 5l7 7-7 7"} 
                />
              </svg>
              {showVisualization ? 'Hide Layer 2 Visualization' : 'Show Layer 2 Visualization'}
            </button>
          </motion.div>

          {/* Layer 2 Visualization */}
          {showVisualization && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-16 overflow-hidden"
            >
              <div className="relative w-full h-[500px] rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                <div className="absolute inset-[40px]">
                  {/* Draw connections first */}
                  {connections.map((conn, idx) => {
                    const startNode = nodes.find(n => n.id === conn.start);
                    const endNode = nodes.find(n => n.id === conn.end);
                    return (
                      <Connection
                        key={idx}
                        startX={startNode.x}
                        startY={startNode.y}
                        endX={endNode.x}
                        endY={endNode.y}
                        isActive={activeConnections.some(ac => 
                          ac.start === conn.start && ac.end === conn.end
                        )}
                      />
                    );
                  })}
                  
                  {/* Draw nodes on top */}
                  {nodes.map((node) => (
                    <Layer2Node
                      key={node.id}
                      x={node.x}
                      y={node.y}
                      label={node.label}
                      isActive={activeNodes.includes(node.id)}
                    />
                  ))}

                  {/* Add legend */}
                  <div className="absolute bottom-0 left-0 bg-black/50 p-4 rounded-lg">
                    <h3 className="text-sm font-bold text-white mb-2">Layer 2 Architecture</h3>
                    <div className="flex flex-col gap-2 text-xs text-gray-300">
                      <div>• Solana L1 → Bridge → L2 Nodes</div>
                      <div>• Validator Network & Memory Pool</div>
                      <div>• Consensus Mechanism</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Demo Area */}
          <motion.div variants={itemVariants}>
            <div className="rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20 p-6 md:p-8">
              <div className="space-y-4">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter text to process..."
                  className="w-full h-32 bg-black/50 border border-mystic-purple/30 rounded-lg p-4 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-mystic-purple/50"
                />
                <button
                  onClick={handleProcess}
                  disabled={!inputText || isProcessing}
                  className={`w-full px-6 py-3 rounded-lg ${
                    !inputText || isProcessing
                      ? 'bg-purple-900/30 cursor-not-allowed'
                      : 'bg-purple-900/60 hover:bg-purple-800/60'
                  } text-white transition-colors flex items-center justify-center gap-2`}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Process Text'
                  )}
                </button>
                {outputText && (
                  <div className="mt-4 p-4 bg-black/50 border border-mystic-purple/30 rounded-lg">
                    <pre className="text-gray-300 whitespace-pre-wrap">{outputText}</pre>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Development Notes */}
          <motion.div variants={itemVariants} className="mt-12">
            <div className="rounded-lg bg-yellow-900/20 backdrop-blur-sm border border-yellow-500/30 p-6">
              <h2 className="text-xl font-bold text-yellow-400 mb-2">🔬 Developer Notes</h2>
              <p className="text-gray-300">
                This is a preview build of the AI Playground. More features will be added soon, including:
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
                <li>Advanced text processing and generation</li>
                <li>Image analysis and generation</li>
                <li>Neural network visualization</li>
                <li>Real-time computation metrics</li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <Footer />

      <style jsx>{`
        .glow-text {
          text-shadow: 0 0 10px rgba(147, 51, 234, 0.5),
                       0 0 20px rgba(147, 51, 234, 0.3),
                       0 0 30px rgba(147, 51, 234, 0.2);
        }
      `}</style>
    </div>
  );
};

export default AIPlayground; 