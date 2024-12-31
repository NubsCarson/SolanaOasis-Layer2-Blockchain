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

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a creative AI that generates interesting and innovative coding project ideas. Focus on projects that are feasible for a skilled developer to complete within a few weeks."
        },
        {
          role: "user",
          content: req.body.prompt || "Generate a creative coding project idea"
        }
      ],
      temperature: 0.8,
      max_tokens: 150
    });

    const idea = completion.choices[0]?.message?.content || "No idea generated";
    
    res.status(200).json({ idea });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate project idea' });
  }
} 