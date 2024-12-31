import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { Octokit } from '@octokit/rest';

// Initialize OpenAI client with timeout
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // 30 second timeout
  maxRetries: 2,
});

// Initialize GitHub client
const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
  request: {
    timeout: 30000 // 30 second timeout
  }
});

// Validate environment variables
if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set');
}
if (!process.env.GITHUB_ACCESS_TOKEN) {
  console.error('GITHUB_ACCESS_TOKEN is not set');
}
if (!process.env.GITHUB_USERNAME) {
  console.error('GITHUB_USERNAME is not set');
}
if (!process.env.OPENAI_VERIFICATION_TOKEN) {
  console.error('OPENAI_VERIFICATION_TOKEN is not set');
}

async function createRepository(name: string, description: string) {
  try {
    const response = await octokit.repos.createForAuthenticatedUser({
      name,
      description,
      auto_init: true,
      private: false
    });
    return response.data;
  } catch (error) {
    console.error('Error creating repository:', error);
    throw error;
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
          console.error('Missing content for file:', file.path);
          throw new Error(`Missing content for file: ${file.path}`);
        }
        return octokit.git.createBlob({
          owner: process.env.GITHUB_USERNAME!,
          repo,
          content: Buffer.from(file.content).toString('base64'),
          encoding: 'base64',
        });
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
  } catch (error) {
    console.error('Error committing code:', error);
    throw error;
  }
}

interface ProjectProposal {
  projectIdea: string;
  projectName: string;
  projectDescription: string;
  projectType: string;
  proposalId: string;
}

// In-memory store for proposals (in production, use a proper database)
const proposals = new Map<string, ProjectProposal>();

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: false,
  },
  maxDuration: 60, // Set maximum duration to 60 seconds (Vercel hobby plan limit)
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set response timeout
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
    // Check for API key
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.OPENAI_VERIFICATION_TOKEN) {
      console.log('Auth failed: Invalid or missing API key');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { prompt, projectType = 'web' } = req.body;
    console.log('Processing request:', { prompt, projectType });

    // Generate project idea
    console.log('Generating project idea...');
    const ideaCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Generate a concise ${projectType} project idea in 30 words or less.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 50
    });

    const projectIdea = ideaCompletion.choices[0]?.message?.content;
    if (!projectIdea) {
      throw new Error('Failed to generate project idea');
    }

    const projectName = projectIdea
      .split('\n')[0]
      .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '')
      .replace(/[^a-zA-Z0-9-]+/g, '-')
      .toLowerCase()
      .slice(0, 40);

    const projectDescription = projectIdea
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
      .slice(0, 200);

    // Generate code
    console.log('Generating project code...');
    const codeCompletion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a code generator that outputs JSON. Generate a minimal viable project structure for a ${projectType} project with only essential files (max 3 files).`
        },
        {
          role: "user",
          content: `Create basic files for: ${projectIdea}\nProject name: ${projectName}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const codeContent = codeCompletion.choices[0]?.message?.content;
    if (!codeContent) {
      throw new Error('Failed to generate project code');
    }

    console.log('Raw code content:', codeContent);
    const generatedFiles = JSON.parse(codeContent);
    console.log('Parsed files:', JSON.stringify(generatedFiles, null, 2));

    if (!generatedFiles.files || !Array.isArray(generatedFiles.files)) {
      throw new Error('Invalid code generation response format');
    }

    // Validate and limit number of files
    if (generatedFiles.files.length > 3) {
      generatedFiles.files = generatedFiles.files.slice(0, 3);
    }

    generatedFiles.files.forEach((file, index) => {
      if (!file.path || !file.content) {
        console.error(`Invalid file at index ${index}:`, file);
        throw new Error(`Invalid file at index ${index}: missing path or content`);
      }
      // Limit file content size
      file.content = file.content.slice(0, 3000);
    });

    console.log('Generated files:', generatedFiles.files.length);

    // Create and populate repository
    console.log('Creating GitHub repository...');
    const repoCreation = await createRepository(projectName, projectDescription);
    console.log('Created repository:', repoCreation.html_url);

    console.log('Committing files...');
    await commitCode(projectName, generatedFiles.files);
    console.log('Committed files to repository');

    return res.status(200).json({
      message: `I've created a project for you: ${projectIdea}

The repository has been created at: ${repoCreation.html_url}

Files created:
${generatedFiles.files.map(f => `- ${f.path}`).join('\n')}

You can now clone the repository and start developing!`,
      repository: {
        name: projectName,
        url: repoCreation.html_url,
        owner: process.env.GITHUB_USERNAME,
        files: generatedFiles.files.map(f => ({ name: f.path, type: f.path.split('.').pop() }))
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Failed to create project',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 