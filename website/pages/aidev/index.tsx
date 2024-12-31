import { useState } from 'react';
import Head from 'next/head';

export default function AIProjectGenerator() {
  const [projectDetails, setProjectDetails] = useState<{
    idea: string;
    repoUrl?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');

  const generateProject = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/create-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setProjectDetails({
        idea: data.idea,
        repoUrl: data.repository_url
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Head>
        <title>AI Project Generator - aimade.fun</title>
        <meta name="description" content="Generate AI-powered project ideas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          AI Project Generator
        </h1>

        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
          <div className="mb-6">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
              What kind of project would you like to create?
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="E.g., A cryptocurrency portfolio tracker with real-time price updates"
            />
          </div>

          <button
            onClick={generateProject}
            disabled={loading || !prompt.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 transition-all duration-200"
          >
            {loading ? 'Generating Project...' : 'Generate Project'}
          </button>

          {projectDetails && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">Generated Project:</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-purple-400">Project Idea:</h3>
                  <p className="text-gray-300 leading-relaxed">{projectDetails.idea}</p>
                </div>
                {projectDetails.repoUrl && (
                  <div>
                    <h3 className="text-lg font-medium text-purple-400">GitHub Repository:</h3>
                    <a 
                      href={projectDetails.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      {projectDetails.repoUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-8 text-sm text-gray-400">
          Made by <a href="https://aimade.fun" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">aimade.fun</a> | 
          Follow us on <a href="https://twitter.com/MoneroSolana" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Twitter</a>
        </div>
      </main>
    </div>
  );
} 