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

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: false,
  },
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

  const requestTimeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timeout')), 50000)
  );

  try {
    // Check for API key
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.OPENAI_VERIFICATION_TOKEN) {
      console.log('Auth failed: Invalid or missing API key');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { prompt, projectType = 'web' } = req.body;
    if (!prompt || !projectType) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    console.log('Processing request:', { prompt, projectType });

    // Use Promise.race to implement timeout
    const result = await Promise.race([
      (async () => {
        // Generate project idea with shorter context
        console.log('Generating project idea...');
        const ideaCompletion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo", // Using faster model for initial idea
          messages: [
            {
              role: "system",
              content: `Generate a concise ${projectType} project idea. Keep it under 100 words.`
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 100
        });

        const projectIdea = ideaCompletion.choices[0]?.message?.content;
        if (!projectIdea) {
          throw new Error('Failed to generate project idea');
        }

        // Extract name and description
        const projectName = projectIdea
          .split('\n')[0]
          .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '')
          .replace(/[^a-zA-Z0-9-]+/g, '-')
          .toLowerCase()
          .slice(0, 50);

        const projectDescription = projectIdea
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
          .slice(0, 300);

        console.log('Generated:', { projectIdea, projectName, projectDescription });

        // Generate project code with optimized parameters
        console.log('Generating project code...');
        const codeCompletion = await openai.chat.completions.create({
          model: "gpt-4-turbo-preview",
          messages: [
            {
              role: "system",
              content: `You are a code generator that outputs JSON. Generate a minimal viable project structure for a ${projectType} project. 
Your response must be a valid JSON object with this exact structure:
{
  "files": [
    {
      "path": "string (required, file path)",
      "content": "string (required, file content)"
    }
  ]
}`
            },
            {
              role: "user",
              content: `Create basic files for: ${projectIdea}\nProject name: ${projectName}\n\nRespond with a JSON object containing the files array. Each file must have a path and content.`
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
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

        // Validate file contents
        generatedFiles.files.forEach((file, index) => {
          if (!file.path || !file.content) {
            console.error(`Invalid file at index ${index}:`, file);
            throw new Error(`Invalid file at index ${index}: missing path or content`);
          }
        });

        console.log('Generated files:', generatedFiles.files.length);

        // Create and populate repository
        console.log('Creating GitHub repository...');
        const repo = await createRepository(projectName, projectDescription);
        console.log('Created repository:', repo.html_url);

        console.log('Committing files...');
        await commitCode(projectName, generatedFiles.files);
        console.log('Committed files to repository');

        return {
          idea: projectIdea,
          repositoryUrl: repo.html_url,
          files: generatedFiles.files
        };
      })(),
      requestTimeout
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = error instanceof Error && error.stack ? error.stack : undefined;
    
    if (errorMessage === 'Request timeout') {
      res.status(504).json({
        error: 'Gateway Timeout',
        message: 'Request took too long to process',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to create project', 
        message: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString()
      });
    }
  }
} 