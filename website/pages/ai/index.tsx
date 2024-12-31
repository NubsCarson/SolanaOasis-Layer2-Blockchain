import React, { useState } from 'react';
import Head from 'next/head';

export default function AIProjectGenerator() {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);

  const generateIdea = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/generate-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({ prompt: 'Generate a creative coding project idea' }),
      });

      const data = await response.json();
      setIdea(data.idea);
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
          <button
            onClick={generateIdea}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 transition-all duration-200"
          >
            {loading ? 'Generating...' : 'Generate Project Idea'}
          </button>

          {idea && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">Generated Idea:</h2>
              <p className="text-gray-300 leading-relaxed">{idea}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 