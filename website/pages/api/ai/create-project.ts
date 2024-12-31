/// <reference types="next" />
import type { NextApiRequest, NextApiResponse } from 'next';
import type OpenAI from 'openai';
import type { Octokit } from '@octokit/rest';
import { createOpenAI, createOctokit } from '../../../utils/api-clients';

// Initialize clients
const openai = createOpenAI();
const octokit = createOctokit();

// Validate environment variables
const requiredEnvVars = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  GITHUB_ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN,
  GITHUB_USERNAME: process.env.GITHUB_USERNAME,
  OPENAI_VERIFICATION_TOKEN: process.env.OPENAI_VERIFICATION_TOKEN
};

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    console.error(`${key} is not set`);
  }
});

async function createRepository(name: string, description: string) {
  try {
    const response = await octokit.repos.createForAuthenticatedUser({
      name,
      description,
      auto_init: true,
      private: false
    });
    return response.data;
  } catch (error: any) {
    console.error('Error creating repository:', error);
    throw new Error(`Failed to create repository: ${error.message}`);
  }
}

async function commitCode(repo: string, files: Array<{ path: string, content: string }>) {
  try {
    // Get the default branch
    const { data: repository } = await octokit.repos.get({
      owner: process.env.GITHUB_USERNAME!,
      repo,
    });
    const defaultBranch = repository.default_branch;

    // Get the latest commit SHA
    const { data: ref } = await octokit.git.getRef({
      owner: process.env.GITHUB_USERNAME!,
      repo,
      ref: `heads/${defaultBranch}`,
    });
    const latestCommitSha = ref.object.sha;

    // Create blobs for each file
    const fileBlobs = await Promise.all(
      files.map(async file => {
        if (!file.content) {
          throw new Error(`Missing content for file: ${file.path}`);
        }
        const blob = await octokit.git.createBlob({
          owner: process.env.GITHUB_USERNAME!,
          repo,
          content: Buffer.from(file.content).toString('base64'),
          encoding: 'base64',
        });
        return blob;
      })
    );

    // Create tree
    const { data: tree } = await octokit.git.createTree({
      owner: process.env.GITHUB_USERNAME!,
      repo,
      base_tree: latestCommitSha,
      tree: files.map((file, index) => ({
        path: file.path,
        mode: '100644',
        type: 'blob',
        sha: fileBlobs[index].data.sha,
      })),
    });

    // Create commit
    const { data: commit } = await octokit.git.createCommit({
      owner: process.env.GITHUB_USERNAME!,
      repo,
      message: 'Initial project setup by AI',
      tree: tree.sha,
      parents: [latestCommitSha],
    });

    // Update reference
    await octokit.git.updateRef({
      owner: process.env.GITHUB_USERNAME!,
      repo,
      ref: `heads/${defaultBranch}`,
      sha: commit.sha,
    });

    return commit;
  } catch (error: any) {
    console.error('Error committing code:', error);
    throw new Error(`Failed to commit code: ${error.message}`);
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: false,
  },
  maxDuration: 60,
};

function generateProjectName(idea: string): string {
  const words = idea.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .split(/\s+/)
    .filter(word => !['a', 'an', 'the', 'and', 'or', 'but', 'for', 'with', 'using', 'that', 'this', 'to', 'in', 'on', 'at'].includes(word))
    .slice(0, 3);
  
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${words.join('-')}-${randomSuffix}`;
}

function generateDescription(idea: string): string {
  return idea
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Keep-Alive', 'timeout=60');

  console.log('Received request:', {
    method: req.method,
    headers: {
      'x-api-key': req.headers['x-api-key'] ? 'present' : 'missing',
      'content-type': req.headers['content-type']
    },
    body: req.body
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate environment variables
    const missingVars = Object.entries(requiredEnvVars)
      .filter(([, value]) => !value)
      .map(([key]) => key);
    
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    // Check for API key
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.OPENAI_VERIFICATION_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { prompt, projectType = 'web' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Missing required field: prompt' });
    }

    console.log('Processing request:', { prompt, projectType });

    // Generate project idea
    console.log('Generating project idea...');
    const ideaCompletion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: `You are a specialized ${projectType} developer. Generate a concise project idea that EXACTLY matches this prompt: "${prompt}". 
Keep it under 50 words and make it highly specific to the user's request.
Focus on the core functionality and key features.
DO NOT add any branding or marketing language.
DO NOT mention technologies unless specifically requested.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 100
    });

    const projectIdea = ideaCompletion.choices[0]?.message?.content;
    if (!projectIdea) {
      throw new Error('Failed to generate project idea');
    }

    const projectName = generateProjectName(projectIdea);
    const projectDescription = generateDescription(projectIdea);

    // Generate code
    console.log('Generating project code...');
    const codeCompletion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: `You are a senior ${projectType} developer creating a professional-grade project that implements: "${projectIdea}". 
Generate a comprehensive, production-ready application with advanced features.

Your response must be a valid JSON object with this structure:
{
  "files": [
    {
      "path": "string (relative file path)",
      "content": "string (complete file content)"
    }
  ]
}

Include all necessary files for a complete, working application:
- README.md with setup instructions and features
- All source code files
- Configuration files
- Package management files
- CSS/styling files
- Any other required files

Make sure the application:
1. Is production-ready and follows best practices
2. Has proper error handling
3. Is responsive and well-styled
4. Has clear documentation
5. Uses modern development practices`
        }
      ],
      temperature: 0.2,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });

    const generatedFiles = JSON.parse(codeCompletion.choices[0]?.message?.content || '{}');
    if (!generatedFiles.files || !Array.isArray(generatedFiles.files)) {
      throw new Error('Invalid code generation response format');
    }

    // Create repository and commit code
    const repo = await createRepository(projectName, projectDescription);
    await commitCode(repo.name, generatedFiles.files);

    return res.status(200).json({
      success: true,
      repository: {
        name: repo.name,
        url: repo.html_url,
        description: projectDescription
      }
    });

  } catch (error: any) {
    console.error('Error handling request:', error);
    return res.status(500).json({
      error: 'An error occurred while processing your request',
      details: error.message
    });
  }
} 