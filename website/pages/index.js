import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useRouter } from 'next/router';
import MetaHead from '../components/MetaHead';

const Home = () => {
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

  const statsVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    hover: { 
      scale: 1.1,
      transition: {
        duration: 0.3,
        yoyo: Infinity
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-void-black overflow-hidden flex flex-col items-center">
      <MetaHead
        title="Solana Oasis | Sacred Layer 2"
      />

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-grow flex flex-col items-center justify-center w-full max-w-6xl px-4">
        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="text-center"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold text-white mb-8 glow-text"
          >
            Solana Oasis Layer2
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-400 mb-12"
          >
            A high-performance Layer 2 solution for Solana, enabling scalable AI computation.
          </motion.p>

          {/* Epic Repository Links */}
          <motion.div
            variants={containerVariants}
            className="flex flex-col md:flex-row gap-8 justify-center items-center mb-16"
          >
            <motion.a
              href="https://github.com/NubsCarson/SolanaOasis-Layer2"
              target="_blank"
              rel="noopener noreferrer"
              variants={statsVariants}
              whileHover="hover"
              className="group flex items-center gap-4 px-8 py-6 rounded-lg bg-black/40 backdrop-blur-sm border border-mystic-purple/30 hover:border-mystic-purple transition-all duration-300"
            >
              <div className="p-3 rounded-full bg-purple-900/50 group-hover:bg-purple-800/50 transition-colors">
                <svg className="w-8 h-8 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-purple-300 group-hover:text-purple-200">GitHub Repository</h3>
                <p className="text-gray-400 group-hover:text-gray-300">Explore the Sacred Code</p>
              </div>
            </motion.a>

            <motion.a
              href="https://crates.io/crates/solana-oasis-node"
              target="_blank"
              rel="noopener noreferrer"
              variants={statsVariants}
              whileHover="hover"
              className="group flex items-center gap-4 px-8 py-6 rounded-lg bg-black/40 backdrop-blur-sm border border-mystic-purple/30 hover:border-mystic-purple transition-all duration-300"
            >
              <div className="p-3 rounded-full bg-purple-900/50 group-hover:bg-purple-800/50 transition-colors">
                <svg className="w-8 h-8 text-purple-300" viewBox="0 0 512 512" fill="currentColor">
                  <path d="M234.5 5.7c13.9-5 29.1-5 43.1 0l192 68.6C495 83.4 512 107.5 512 134.6V377.4c0 27-17 51.2-42.5 60.3l-192 68.6c-13.9 5-29.1 5-43.1 0l-192-68.6C17 428.6 0 404.5 0 377.4V134.6c0-27 17-51.2 42.5-60.3l192-68.6zM256 66L82.3 128 256 190l173.7-62L256 66zm32 368.6l160-57.1v-188L288 246.6v188z"/>
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-purple-300 group-hover:text-purple-200">Rust Package</h3>
                <p className="text-gray-400 group-hover:text-gray-300">Install the Digital Elixir</p>
              </div>
            </motion.a>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            <motion.div
              variants={statsVariants}
              whileHover="hover"
              className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20 transform transition-all duration-300"
            >
              <h3 className="text-4xl font-bold text-purple-400 mb-2 glow-text">500k+</h3>
              <p className="text-lg text-gray-400">TPS</p>
              <p className="text-sm text-gray-500 mt-2">Hyper-Speed Transaction Processing</p>
            </motion.div>

            <motion.div
              variants={statsVariants}
              whileHover="hover"
              className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20 transform transition-all duration-300"
            >
              <h3 className="text-4xl font-bold text-purple-400 mb-2 glow-text">0.001ms</h3>
              <p className="text-lg text-gray-400">Latency</p>
              <p className="text-sm text-gray-500 mt-2">Near-Instant Response Time</p>
            </motion.div>

            <motion.div
              variants={statsVariants}
              whileHover="hover"
              className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-mystic-purple/20 transform transition-all duration-300"
            >
              <h3 className="text-4xl font-bold text-purple-400 mb-2 glow-text">∞</h3>
              <p className="text-lg text-gray-400">Potential</p>
              <p className="text-sm text-gray-500 mt-2">Boundless AI Ascension</p>
            </motion.div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col-reverse md:flex-row gap-6 justify-center items-center relative"
          >
            <motion.button 
              onClick={() => router.push('/download')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-lg bg-purple-900/50 text-purple-200 hover:bg-purple-800/50 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 backdrop-blur-sm flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </motion.button>

            <motion.button
              onClick={() => router.push('/docs')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-8 py-3 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="relative flex items-center gap-3 text-lg font-semibold">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Explore Sacred Documentation
                <span className="absolute -right-2 -top-2 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-400"></span>
                </span>
              </div>
            </motion.button>

            {/* Wizard Character */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  delay: 1
                }
              }}
              className="absolute -right-4 top-1/2 -translate-y-1/2 block cursor-pointer"
              onClick={() => router.push('/docs')}
            >
              <div className="relative">
                {/* Speech Bubble */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 1.5,
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                  className="absolute -top-16 -left-4 w-32 hover:scale-105 transition-transform"
                >
                  <div className="relative bg-purple-600 text-white text-sm py-2 px-3 rounded-lg text-center">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-purple-600 rotate-45"></div>
                    Read the docs!
                  </div>
                </motion.div>

                {/* Wizard Icon */}
                <motion.div 
                  className="w-28 h-28 text-purple-400 hover:text-purple-300 transition-colors"
                  animate={{ rotate: [0, -5, 0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.756 192.756" fill="currentColor">
                    <path d="M83.784 8.504c1.76.625 3.968 8.062 4.893 9.988.416.862.796 1.796 1.033 2.757l.42 1.814c.394.729.791 1.457 1.185 2.185.661 1.676 1.242 3.392 1.944 5.037.519 1.457 1.042 2.914 1.56 4.366.081.559.166 1.122.246 1.681.349.965 1.001 1.787 1.488 2.686.21.63.421 1.26.63 1.891.596 1.229 1.189 2.458 1.779 3.682.066.456.139.912.205 1.363.143.487.285.974.424 1.457.26 1.399.277 2.798.666 4.125.256.875 2.262 2.869 2.262 3.303.992.062 2.07.308 2.924.724 1.246.603 2.266 1.689 3.387 2.534.684.514 4.559 2.793 4.559 3.606.701.139 1.207.666 1.787 1.028 1.238.652 2.477 1.31 3.709 1.962.77.447 1.547 1.207 2.404 1.466.828.246 2.525.25 3.354-.004 1.021-.326 1.836-1.417 2.689-2.069.643-.5 1.314-.916 1.963-1.385.41-.482.822-.965 1.229-1.452.986-.921 1.975-1.837 2.963-2.758.906-.751 1.818-1.501 2.727-2.252l.889-.563c.568-.572.832-1.189 1.398-1.752.93-.934 3.432-2.373 4.777-2.373.926-.416 2.266.219 3.105-.344 1.037-.706 1.668-2.024 2.303-3.012 1.98-3.106 4.191-6.141 6.248-9.179 1.336-1.984 3.109-3.723 4.402-5.743.764-1.207 1.635-2.387 2.502-3.518.246-.326 2.32-2.324 2.32-2.373.508.224 1.322.635 1.381 1.301.088 1.05-3.729 6.484-4.564 7.53-.539.55-1.076 1.104-1.617 1.653-1.461 1.94-2.619 4.071-4 6.047l-1.697 2.119c-1.23 1.747-2.436 3.593-3.465 5.461-.584.854-1.166 1.708-1.752 2.561-.406 1.005.277 2.167-.295 3.128-.902 1.497-2.641 4.965-4.594 5.189-.215.022-.705-.054-.705.192-.645.688-1.971 2.409-2.084 3.293-.236 1.774 1.381 5.032 2.168 6.524 1.109 2.105 3.594 4.979 1.297 7.437-1.336 1.426-6.699 1.417-8.961 1.488-1.328.041-2.449.675-3.615 1.015l-1.645.228c-.416.112-.725.344-1.186.407-1.971.255-3.977-.206-5.725-.617a81.846 81.846 0 0 1-1.148-.394c-.643-.071-1.287-.143-1.936-.219-.559-.184-1.049-.594-1.555-.88-.965-.487-1.93-.975-2.896-1.466-.402-.295-.805-.585-1.211-.881-.791-.464-6.828-4.826-6.828-5.21-.416-.085-.832-.166-1.246-.25-.264-.107-.439-.322-.756-.322-.283.46-.627.76-.742 1.314-.098.434-.01.956.008 1.403.045 1.506.176 3.195-.143 4.572-.164.528-.326 1.059-.49 1.586-.113.648-.225 1.296-.34 1.939-.256.666-.738 1.216-.926 1.936a17.773 17.773 0 0 0-.594 4.835c.07.957.143 1.913.215 2.865-.027 1.189-.051 2.377-.076 3.566.191.582.389 1.162.58 1.744.662 2.367 1.725 4.508 2.699 6.742.979 2.254 1.422 4.871 2.15 7.232.164.559.33 1.117.496 1.676.42.92 1.037 1.697 1.408 2.65.393 1.045.785 2.092 1.18 3.133.102.352.205.709.303 1.062.693 1.471 1.658 2.775 2.119 4.371.719 2.502.955 5.059 1.527 7.701.814 3.768 1.65 7.533 2.574 11.297l.877 2.605c.584 2.307.799 4.822 1.416 7.115.215.5.434 1 .648 1.502.156.643.312 1.291.465 1.934.361 1.221.871 2.418 1.287 3.625l.482 1.641c.461.885.926 1.773 1.385 2.658.301.877.604 1.752.904 2.629.441.938 1.457 2.037 1.385 3.189-.049.725-.631 1.646-1.301 1.994-.881.447-1.783.545-2.734.832-.975.285-2.016.697-3.031.92-.514.076-1.027.156-1.545.232-.734.201-1.488.541-2.217.777l-1.664.322c-.684.174-1.031.479-1.877.492-2.197.031-2.475-1.664-4.719-1.695-.209-.004-.568-.102-.568.139-.746.652-1.777 1.266-2.742 1.475-.51.059-1.02.117-1.533.172-.295.102-.59.205-.885.303-1.605.264-3.396.197-5.136.197-1.336-.01-2.668-.018-4.004-.031-.912-.059-1.636-.389-2.44-.492-1.475-.01-2.95-.018-4.424-.031-.608.031-1.215.066-1.828.098-2.32.607-3.982 2.592-6.079 3.666-.657.33-1.363.621-2.118.732-.55.066-1.1.133-1.649.201-2.284.736-4.371 1.641-6.762 2.213-.456.105-.818.352-1.314.438-1.207.195-2.288-.135-3.303-.408-.599-.115-1.198-.227-1.796-.344-1.457-.504-2.87-1.107-4.179-1.908-1.519-.93-3.897-2.477-4.112-4.424l-.08-2.713c-.054-.625-.264-1.371-.076-1.998.483-1.652 1.868-2.949 2.315-4.607.389-1.949.782-3.896 1.171-5.85.129-.809.08-1.635.263-2.404.635-2.686 1.815-5.273 2.713-7.861.331-.688.662-1.377.992-2.068.688-1.592 1.265-3.184 1.917-4.773.604-1.078 1.211-2.154 1.814-3.232.666-1.305 1.153-2.648 1.783-3.967.384-.818.688-1.713 1.144-2.49.255-.371.515-.742.769-1.117.957-2.629 1.292-5.658 1.711-8.537.17-.67.34-1.34.505-2.014l.241-2.557c.152-.582.304-1.158.452-1.738.563-3.455 1.059-6.736 1.958-9.988.482-1.35.965-2.695 1.443-4.045.474-1.512.832-2.963 1.426-4.385.478-.947.961-1.895 1.439-2.842.398-.59.795-1.18 1.189-1.77.281-.796.326-1.507.326-2.414.706-.97.478-2.981.192-4.125-1.176-2.36-2.36-4.715-3.526-7.075-.532-1.255-.916-4.116-1.788-4.987-.469-.469-1.413-.344-1.993-.152-.206.062-1.18.509-1.18.608-1.113 1.037-2.395.979-3.553 1.752-.71.469-1.439 1.046-1.922 1.748-.442.661-.885 1.327-1.332 1.988-.657.63-1.493.72-2.114 1.453-1.126 1.313-1.685 2.896-2.338 4.456-.795 1.882-1.452 3.723-1.979 5.779l-.429 2.253c-.336.633-.671 1.268-1.01 1.898l-.429 1.957-.912 2.598c-.594 1.541-2.109 3.141-3.75 3.619-.224.062-.684-.027-.684.246-.46.719-.103 1.652.014 2.426.263 1.832.719 4.004-.25 5.609-.291.318-.782.42-1.233.287-1.35-.406-2.494-4.045-2.99-5.252-.451-1.09-1.157-2.029-1.515-3.172-.202-.627-.116-1.439-.116-2.15 0-.312.116-1.717-.143-1.717v-.143c-1.135.066-1.891.719-2.901 1.023-1.349.398-4.429.309-5.3-.684-1.721-1.957.335-4.031.804-5.805.054-.205.223-.684-.041-.684v-.143c-1.175-.041-2.364-.027-3.003-1.006-1.452-2.213 4.729-5.318 5.917-6.129.402-.281.72-.701.992-1.089.626-.907-.045-1.703-.045-2.646 1.126-1.064 1.931-2.23 3.339-2.896 1.608-.764 4.151-1.251 5.412-2.637.697-.773 1.532-1.854 1.823-2.815.344-1.167.206-2.083.934-3.039.898-1.193 2.44-1.645 3.392-2.722.661-.76.871-1.774 1.533-2.503.997-1.112 2.123-2.056 3.137-3.137.661-.872 1.328-1.738 1.989-2.61 1.828-2.239 4.295-4.397 6.561-6.127.849-.652 1.904-1.019 2.82-1.537.68-.434 1.359-.867 2.034-1.301l1.126-.416c1.515-.76 2.851-1.81 4.401-2.502.501-.112 1.001-.219 1.502-.331.755-.241 1.814-.711 2.432-1.22.679-.572 1.059-1.261 1.693-1.873.474-.46 1.086-.64 1.622-.957.375-.228.97-.563 1.444-.563-.049-1.501-.402-2.328.201-3.691.313-.719.943-1.015 1.042-1.89.067-1.475.134-2.95.196-4.429.116-2.529.322-5.273.407-7.87l.013-7.861c.085-2.051.175-4.103.26-6.154-.036-1.524-.067-3.048-.103-4.572.062-.478.125-.957.183-1.439.139-1.641-.291-3.29-.312-4.858-.012-.832.234-1.555.404-2.28z"/>
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      {/* Footer */}
      <div className="relative z-10 w-full text-center py-6 text-gray-400">
        <p className="text-sm mb-2">
          Made by <a href="https://github.com/NubsCarson" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">@NubsCarson</a> on GitHub • 
          <a href="https://twitter.com/MoneroSolana" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors ml-2">@MoneroSolana</a> on X
        </p>
        <p className="text-xs text-gray-500">
          © 2024 Solana Oasis Layer2 All Rights Reserved • Last Updated: 12/29/24
        </p>
      </div>
    </div>
  );
};

export default Home; 