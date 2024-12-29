import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import MetaHead from '../components/MetaHead';

const Download = () => {
  const router = useRouter();
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

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

  const codeBlocks = [
    {
      title: "📦 Using Cargo",
      code: `# Add the package to your Cargo.toml
[dependencies]
solana-oasis-node = "0.1.0"`
    },
    {
      title: "⚡ From Source",
      code: `git clone https://github.com/NubsCarson/SolanaOasis-Layer2.git
cd SolanaOasis-Layer2
cargo build --release`
    },
    {
      title: "🚀 Quick Start",
      code: `# In your Rust code
use solana_oasis_node::OasisClient;

async fn example() {
    let client = OasisClient::new();
    // Initialize your Layer 2 connection
}`
    },
    {
      title: "🏃 Running the Node",
      code: `# Start the Layer 2 node
cd node
cargo run --release --bin solana-oasis-node

# In a new terminal, start the bridge
cd bridge
cargo run --release

# Optional: Enable PyTorch features
cargo run --release --features pytorch`
    },
    {
      title: "🤖 AI Layer Setup",
      code: `# Build and run the AI layer
cd ai-layer
cargo build --release

# Start the AI service
cargo run --release

# Test the neural network connection
cargo test --release -- --nocapture`
    },
    {
      title: "🔍 Development Tools",
      code: `# Run all tests
cargo test --workspace

# Build documentation
cargo doc --no-deps --open

# Check code formatting
cargo fmt --all -- --check

# Run linter
cargo clippy --all-targets --all-features`
    }
  ];

  return (
    <div className="relative min-h-screen w-full bg-void-black overflow-hidden flex flex-col items-center">
      <MetaHead 
        title="Download | Solana Oasis"
        description="Download and install Solana Oasis Layer 2 - the high-performance solution for scalable AI computation on Solana."
      />

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
        </Canvas>
      </div>

      {/* Top Navigation */}
      <motion.div 
        variants={itemVariants}
        initial="initial"
        animate="animate"
        className="relative z-10 w-full container mx-auto px-4 pt-8"
      >
        <motion.button
          onClick={() => router.push('/')}
          className="text-sm md:text-base text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </motion.button>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="relative z-10 flex-grow flex flex-col items-center justify-center w-full max-w-3xl px-4 py-8 md:py-16"
      >
        <motion.div
          variants={containerVariants}
          className="space-y-4 md:space-y-8 w-full"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6 md:mb-12 text-center"
          >
            Download & Installation
          </motion.h1>

          {/* Installation Methods */}
          {codeBlocks.map((block, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="w-full rounded-lg bg-black/50 border border-mystic-purple/20"
            >
              <div className="px-4 md:px-6 py-3 md:py-4 border-b border-mystic-purple/20 flex justify-between items-center">
                <h2 className="text-lg md:text-xl font-semibold text-purple-400">
                  {block.title}
                </h2>
                <button
                  onClick={() => copyToClipboard(block.code, index)}
                  className="px-3 md:px-4 py-1 md:py-1.5 rounded bg-purple-800 hover:bg-purple-700 text-purple-100 text-xs md:text-sm transition-colors shadow-lg ml-4"
                >
                  {copiedIndex === index ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="relative">
                <pre className="p-4 md:p-6 font-mono text-sm md:text-base overflow-x-auto">
                  <code className="text-gray-300 whitespace-pre">
                    {block.code}
                  </code>
                </pre>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Navigation */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mt-8 md:mt-12 w-full px-4"
        >
          <button 
            onClick={() => router.push('/docs')}
            className="w-full md:w-auto px-6 md:px-8 py-3 rounded-lg bg-mystic-purple/20 border border-mystic-purple text-white hover:bg-mystic-purple/30 transition-colors text-sm md:text-base"
          >
            View Documentation
          </button>
        </motion.div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default Download; 