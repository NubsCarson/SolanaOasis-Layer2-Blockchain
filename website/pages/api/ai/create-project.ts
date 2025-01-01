/// <reference types="next" />
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { Octokit } from '@octokit/rest';

// Initialize OpenAI client with timeout
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 50000,
  maxRetries: 2,
});

// Initialize GitHub client
const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
  request: {
    timeout: 50000
  }
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: false,
  },
  maxDuration: 60,
};

async function createRepository(name: string, description: string) {
  try {
    console.log('Creating repository:', name);
    const response = await octokit.repos.createForAuthenticatedUser({
      name,
      description,
      auto_init: true,
      private: false
    });
    console.log('Repository created:', response.data.html_url);
    return response.data;
  } catch (error: any) {
    console.error('Error creating repository:', error);
    throw new Error(`Failed to create repository: ${error.message}`);
  }
}

async function commitCode(repo: string, files: Array<{ path: string, content: string }>) {
  try {
    console.log('Getting repository info...');
    const { data: repository } = await octokit.repos.get({
      owner: process.env.GITHUB_USERNAME!,
      repo,
    });
    const defaultBranch = repository.default_branch;

    console.log('Getting latest commit...');
    const { data: ref } = await octokit.git.getRef({
      owner: process.env.GITHUB_USERNAME!,
      repo,
      ref: `heads/${defaultBranch}`,
    });
    const latestCommitSha = ref.object.sha;

    console.log('Creating blobs...');
    const fileBlobs = await Promise.all(
      files.map(async file => {
        console.log('Creating blob for:', file.path);
        return octokit.git.createBlob({
          owner: process.env.GITHUB_USERNAME!,
          repo,
          content: Buffer.from(file.content).toString('base64'),
          encoding: 'base64',
        });
      })
    );

    console.log('Creating tree...');
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

    console.log('Creating commit...');
    const { data: commit } = await octokit.git.createCommit({
      owner: process.env.GITHUB_USERNAME!,
      repo,
      message: 'Initial project setup by AI',
      tree: tree.sha,
      parents: [latestCommitSha],
    });

    console.log('Updating reference...');
    await octokit.git.updateRef({
      owner: process.env.GITHUB_USERNAME!,
      repo,
      ref: `heads/${defaultBranch}`,
      sha: commit.sha,
    });

    console.log('Code committed successfully');
    return commit;
  } catch (error: any) {
    console.error('Error committing code:', error);
    throw new Error(`Failed to commit code: ${error.message}`);
  }
}

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
  console.log('API Handler started');
  console.log('Environment variables present:', {
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    GITHUB_ACCESS_TOKEN: !!process.env.GITHUB_ACCESS_TOKEN,
    GITHUB_USERNAME: !!process.env.GITHUB_USERNAME,
    OPENAI_VERIFICATION_TOKEN: !!process.env.OPENAI_VERIFICATION_TOKEN
  });

  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate environment variables
    const missingVars = ['OPENAI_API_KEY', 'GITHUB_ACCESS_TOKEN', 'GITHUB_USERNAME', 'OPENAI_VERIFICATION_TOKEN']
      .filter(key => !process.env[key]);
    
    if (missingVars.length > 0) {
      console.error('Missing environment variables:', missingVars);
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    // Check for API key
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.OPENAI_VERIFICATION_TOKEN) {
      console.error('Invalid API key');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { prompt, projectType = 'web' } = req.body;
    if (!prompt) {
      console.error('Missing prompt in request body');
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
      console.error('Failed to generate project idea');
      throw new Error('Failed to generate project idea');
    }

    console.log('Generated project idea:', projectIdea);
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

    console.log('Code generation completed');
    const generatedFiles = JSON.parse(codeCompletion.choices[0]?.message?.content || '{}');
    if (!generatedFiles.files || !Array.isArray(generatedFiles.files)) {
      console.error('Invalid code generation response:', generatedFiles);
      throw new Error('Invalid code generation response format');
    }

    console.log('Generated files count:', generatedFiles.files.length);

    // Create repository and commit code
    const repo = await createRepository(projectName, projectDescription);
    await commitCode(repo.name, generatedFiles.files);

    console.log('Project created successfully:', repo.html_url);
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
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 