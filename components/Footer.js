const Footer = () => {
  return (
    <footer className="w-full py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="text-center text-gray-400 space-y-4">
          <div className="flex items-center justify-center space-x-6">
            <a 
              href="https://github.com/NubsCarson" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors"
            >
              Made by @NubsCarson on GitHub
            </a>
            <a 
              href="https://twitter.com/MoneroSolana" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors"
            >
              @MoneroSolana
            </a>
          </div>
          <p className="text-sm">
            © 2024 Solana Oasis Layer2 All Rights Reserved • Last Updated: 12/29/24
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 