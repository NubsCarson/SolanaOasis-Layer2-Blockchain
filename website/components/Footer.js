import { useRouter } from 'next/router';

const Footer = () => {
  const router = useRouter();

  return (
    <div className="relative z-10 w-full text-center py-4 md:py-6 text-gray-400 px-4">
      <div className="flex justify-center space-x-6 mb-4">
        <button onClick={() => router.push('/')} className="text-sm text-purple-400 hover:text-purple-300 transition-colors">Home</button>
        <button onClick={() => router.push('/docs')} className="text-sm text-purple-400 hover:text-purple-300 transition-colors">Docs</button>
        <button onClick={() => router.push('/download')} className="text-sm text-purple-400 hover:text-purple-300 transition-colors">Download</button>
        <button onClick={() => router.push('/whitepaper')} className="text-sm text-purple-400 hover:text-purple-300 transition-colors">Whitepaper</button>
      </div>
      <p className="text-xs md:text-sm mb-2">
        Made by <a href="https://github.com/NubsCarson" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">@NubsCarson</a> on GitHub • 
        <a href="https://twitter.com/MoneroSolana" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors ml-2">@MoneroSolana</a> on X
      </p>
      <p className="text-xs text-gray-500">
        © 2024 Solana Oasis Layer2 All Rights Reserved • Last Updated: 12/29/24
      </p>
    </div>
  );
};

export default Footer; 