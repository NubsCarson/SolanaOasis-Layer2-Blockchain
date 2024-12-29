import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import Head from 'next/head';
import { useRouter } from 'next/router';

const SDKGrimoire = () => {
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
        <title>Sacred SDK | Solana Oasis</title>
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
              📓 Sacred SDK Grimoire
            </motion.h1>

            {/* Installation */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-mystic-purple mb-6">🗝️ Installation Ritual</h2>
              <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                <h3 className="text-xl font-bold text-purple-400 mb-4">Cargo</h3>
                <pre className="text-purple-300 overflow-x-auto">
{`[dependencies]
solana-oasis-sdk = "0.1.0"`}
                </pre>
                <h3 className="text-xl font-bold text-purple-400 mb-4 mt-6">npm</h3>
                <pre className="text-purple-300 overflow-x-auto">
{`npm install @solana-oasis/sdk`}
                </pre>
              </div>
            </motion.section>

            {/* Quick Start */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-mystic-purple mb-6">⚔️ Quick Start Incantation</h2>
              <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                <pre className="text-purple-300 overflow-x-auto">
{`// Initialize the SDK
use solana_oasis_sdk::OasisClient;

#[tokio::main]
async fn main() {
    // Create a new client
    let client = OasisClient::new(
        "Coming Soon",  // RPC endpoint
        "your-private-key"
    ).await?;

    // Submit an AI computation
    let result = client
        .compute()
        .model("gpt-4")
        .input("Analyze this text...")
        .execute()
        .await?;

    println!("Result: {:?}", result);
}`}
                </pre>
              </div>
            </motion.section>

            {/* Core Features */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-mystic-purple mb-6">⛧ Core Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Computation</h3>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>AI model access</li>
                    <li>Batch processing</li>
                    <li>Result verification</li>
                  </ul>
                </div>
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">Bridge</h3>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>Asset transfers</li>
                    <li>Message passing</li>
                    <li>State syncing</li>
                  </ul>
                </div>
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-4">State</h3>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>State queries</li>
                    <li>Proof generation</li>
                    <li>State updates</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Code Examples */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-mystic-purple mb-6">⚡ Sacred Incantations</h2>
              
              {/* Bridge Example */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-purple-400 mb-4">Bridge Operations</h3>
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <pre className="text-purple-300 overflow-x-auto">
{`// Bridge asset transfer
let bridge = client.bridge();

// Deposit assets
let deposit = bridge
    .deposit()
    .amount(1000000000)
    .token("SOL")
    .destination("0x...")
    .execute()
    .await?;

// Withdraw assets
let withdrawal = bridge
    .withdraw()
    .amount(1000000000)
    .token("SOL")
    .execute()
    .await?;`}
                  </pre>
                </div>
              </div>

              {/* State Example */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-purple-400 mb-4">State Management</h3>
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <pre className="text-purple-300 overflow-x-auto">
{`// Query state
let state = client
    .state()
    .get_latest()
    .await?;

// Generate proof
let proof = client
    .state()
    .generate_proof(state_root)
    .await?;

// Verify state
let valid = client
    .state()
    .verify_proof(proof)
    .await?;`}
                  </pre>
                </div>
              </div>

              {/* Computation Example */}
              <div>
                <h3 className="text-2xl font-bold text-purple-400 mb-4">AI Computation</h3>
                <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                  <pre className="text-purple-300 overflow-x-auto">
{`// Submit computation
let computation = client
    .compute()
    .model("gpt-4")
    .input("Analyze market data...")
    .params(ComputeParams {
        temperature: 0.7,
        max_tokens: 100,
    })
    .execute()
    .await?;

// Get computation result
let result = client
    .compute()
    .get_result(computation.id)
    .await?;`}
                  </pre>
                </div>
              </div>
            </motion.section>

            {/* Error Handling */}
            <motion.section variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-mystic-purple mb-6">🌒 Error Handling</h2>
              <div className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20">
                <pre className="text-purple-300 overflow-x-auto">
{`// Error handling example
match client.compute().execute().await {
    Ok(result) => {
        println!("Computation successful: {:?}", result);
    }
    Err(OasisError::ComputeError(e)) => {
        eprintln!("Computation failed: {}", e);
    }
    Err(OasisError::NetworkError(e)) => {
        eprintln!("Network error: {}", e);
    }
    Err(e) => {
        eprintln!("Other error: {}", e);
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

export default SDKGrimoire; 