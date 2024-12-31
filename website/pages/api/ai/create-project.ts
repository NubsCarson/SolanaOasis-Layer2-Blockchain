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

    const { prompt, projectType = 'web', action, proposalId } = req.body;

    // Step 1: Generate project proposal
    if (!action && prompt) {
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

      const newProposalId = Math.random().toString(36).substring(2);
      const proposal: ProjectProposal = {
        projectIdea,
        projectName,
        projectDescription,
        projectType,
        proposalId: newProposalId
      };

      proposals.set(newProposalId, proposal);

      return res.status(200).json({
        message: `🎨 Exciting Project Proposal!

Project Name: "${projectName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}"

📋 Project Description:
${projectIdea}

🛠️ Technical Details:
- Type: ${projectType.toUpperCase()} Application
- Repository Name: ${projectName}
- Created By: GPT AI Dev Team @ AIMade.fun

Would you like me to create this project? 
Reply with:
✅ "Yes, create this project!" to proceed
🔄 "Generate another idea" for a different concept
🔧 "Modify this idea" to adjust the current proposal

Your project will be created at: https://github.com/${process.env.GITHUB_USERNAME}/${projectName}`,
        proposal: {
          id: newProposalId,
          title: projectName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          description: projectIdea,
          type: projectType,
          preview: {
            repositoryName: projectName,
            owner: process.env.GITHUB_USERNAME
          }
        },
        createdBy: "GPT AI Dev Team @ AIMade.fun",
        timestamp: new Date().toISOString()
      });
    }

    // Step 2: Create repository if user approves
    if (action === 'create' && proposalId) {
      const proposal = proposals.get(proposalId);
      if (!proposal) {
        return res.status(404).json({ error: 'Proposal not found. Please generate a new project idea.' });
      }

      // Generate code and create repository
      console.log('Generating project code...');
      const codePromise = openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: `You are a code generator that outputs JSON. Generate a minimal viable project structure for a ${proposal.projectType} project with only essential files (max 3 files). 
Your response must be a valid JSON object with this exact structure:
{
  "files": [
    {
      "path": "string (required, file path)",
      "content": "string (required, file content)"
    }
  ]
}
Keep file contents minimal and focused on core functionality.`
          },
          {
            role: "user",
            content: `Create basic files for: ${proposal.projectIdea}\nProject name: ${proposal.projectName}\n\nRespond with a JSON object containing only essential files (max 3 files).`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      });

      const codeCompletion = await Promise.race([
        codePromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Code generation timeout')), 15000))
      ]) as OpenAI.Chat.ChatCompletion;

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

      // Create and populate repository with timeout
      console.log('Creating GitHub repository...');
      const repoPromise = createRepository(proposal.projectName, proposal.projectDescription);
      const repoCreation = (await Promise.race([
        repoPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Repository creation timeout')), 10000))
      ])) as { html_url: string };

      console.log('Created repository:', repoCreation.html_url);

      console.log('Committing files...');
      await Promise.race([
        commitCode(proposal.projectName, generatedFiles.files),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Code commit timeout')), 15000))
      ]);
      console.log('Committed files to repository');

      // Clean up the proposal
      proposals.delete(proposalId);

      return res.status(200).json({
        message: `🎉 Project Successfully Created!

1️⃣ Retrieved your approved project idea
2️⃣ Created GitHub repository
3️⃣ Set up initial codebase
4️⃣ Committed all files

📂 Project Details:
- Name: ${proposal.projectName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
- Description: ${proposal.projectIdea}
- Type: ${proposal.projectType.toUpperCase()} Application

🔗 Repository URL: ${repoCreation.html_url}

📁 Generated Files:
${generatedFiles.files.map(f => `- ${f.path}`).join('\n')}

Next Steps:
1. Click the repository URL above to view your code
2. Clone the repository to start developing
3. Feel free to ask me to add more features!

Created by GPT AI Dev Team @ AIMade.fun`,
        repository: {
          name: proposal.projectName,
          url: repoCreation.html_url,
          owner: process.env.GITHUB_USERNAME,
          files: generatedFiles.files.map(f => ({ name: f.path, type: f.path.split('.').pop() }))
        },
        timestamp: new Date().toISOString()
      });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = error instanceof Error && error.stack ? error.stack : undefined;
    
    if (errorMessage.includes('timeout')) {
      res.status(504).json({
        error: 'Gateway Timeout',
        message: 'Request took too long to process. Please try again.',
        details: errorMessage,
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