import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { Octokit } from '@octokit/rest';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize GitHub client
const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN
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
      files.map(file =>
        octokit.git.createBlob({
          owner: process.env.GITHUB_USERNAME!,
          repo,
          content: Buffer.from(file.content).toString('base64'),
          encoding: 'base64',
        })
      )
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
    // Check for bearer token
    const authHeader = req.headers['authorization'];
    if (!authHeader || !process.env.OPENAI_VERIFICATION_TOKEN || 
        authHeader !== `Bearer ${process.env.OPENAI_VERIFICATION_TOKEN}`) {
      console.log('Auth failed:', { 
        received: authHeader,
        expected: process.env.OPENAI_VERIFICATION_TOKEN ? 'Bearer <token>' : 'not set'
      });
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { prompt, projectType = 'web' } = req.body;
    if (!prompt || !projectType) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    console.log('Processing request:', { prompt, projectType });

    // Generate project idea
    console.log('Generating project idea...');
    const ideaCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a creative AI that generates interesting and innovative ${projectType} project ideas. Focus on projects that are feasible for a skilled developer to complete within a few weeks.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 150
    });

    const projectIdea = ideaCompletion.choices[0]?.message?.content;
    if (!projectIdea) {
      throw new Error('Failed to generate project idea');
    }

    // Extract the first line or first 50 characters for the name
    const projectName = projectIdea
      .split('\n')[0]
      .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '') // Remove non-alphanumeric chars from start/end
      .replace(/[^a-zA-Z0-9-]+/g, '-') // Replace non-alphanumeric chars with hyphens
      .toLowerCase()
      .slice(0, 50); // Limit to 50 chars

    // Extract a clean description (first 300 characters, no control chars)
    const projectDescription = projectIdea
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
      .slice(0, 300); // Limit to 300 chars

    console.log('Generated:', { projectIdea, projectName, projectDescription });

    // Generate project code
    console.log('Generating project code...');
    const codeCompletion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an expert developer that generates high-quality, production-ready code. Generate a complete project structure and code files for the following ${projectType} project idea. 
          You must respond with ONLY a JSON object in the following format:
          {
            "files": [
              {
                "path": "path/to/file",
                "content": "file content"
              }
            ]
          }
          Include:
          - README.md with setup instructions
          - package.json or relevant dependency file
          - Main source code files
          - Basic project structure`
        },
        {
          role: "user",
          content: `Generate a complete project structure and code for: ${projectIdea}\nProject name: ${projectName}`
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });

    const codeContent = codeCompletion.choices[0]?.message?.content;
    if (!codeContent) {
      throw new Error('Failed to generate project code');
    }

    let generatedFiles;
    try {
      generatedFiles = JSON.parse(codeContent);
    } catch (error) {
      console.error('Failed to parse generated code as JSON:', codeContent);
      throw new Error('Invalid code generation response format');
    }

    if (!generatedFiles.files || !Array.isArray(generatedFiles.files)) {
      console.error('Invalid generated files structure:', generatedFiles);
      throw new Error('Invalid code generation response format');
    }

    console.log('Generated files:', generatedFiles.files.length);

    // Create GitHub repository
    console.log('Creating GitHub repository...');
    const repo = await createRepository(projectName, projectDescription);
    console.log('Created repository:', repo.html_url);

    // Commit files to repository
    console.log('Committing files...');
    await commitCode(projectName, generatedFiles.files);
    console.log('Committed files to repository');

    res.status(200).json({
      idea: projectIdea,
      repositoryUrl: repo.html_url,
      files: generatedFiles.files
    });
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = error instanceof Error && error.stack ? error.stack : undefined;
    
    res.status(500).json({ 
      error: 'Failed to create project', 
      message: errorMessage,
      details: errorDetails,
      timestamp: new Date().toISOString()
    });
  }
} 