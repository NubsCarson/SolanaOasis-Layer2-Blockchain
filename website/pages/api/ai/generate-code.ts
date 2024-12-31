import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { idea, projectName } = req.body;
    if (!idea || !projectName) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert developer that generates high-quality, production-ready code. Generate a complete project structure and initial code for the following project idea. Include a README.md with setup instructions and project description.`
        },
        {
          role: "user",
          content: `Generate a complete project structure and initial code for: ${idea}\nProject name: ${projectName}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const code = completion.choices[0]?.message?.content || "No code generated";
    
    res.status(200).json({ code });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate project code' });
  }
} 