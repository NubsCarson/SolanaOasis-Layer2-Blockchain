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

// Helper to create a shorter, more concise project name
function generateProjectName(idea: string): string {
  // Extract key words and create a shorter name
  const words = idea.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .split(/\s+/)
    .filter(word => !['a', 'an', 'the', 'and', 'or', 'but', 'for', 'with'].includes(word))
    .slice(0, 3);
  
  return words.join('-');
}

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

    const projectName = generateProjectName(projectIdea);

    const projectDescription = projectIdea
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
      .slice(0, 200);

    // Generate code with a more complete structure
    console.log('Generating project code...');
    const codeCompletion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a professional full-stack developer creating a complete web project. Generate a modern, well-structured ${projectType} project with best practices and comprehensive features.
Your response must be a valid JSON object with this structure:
{
  "files": [
    {
      "path": "README.md",
      "content": "... detailed project documentation ..."
    },
    {
      "path": "index.html",
      "content": "... modern HTML5 with proper structure ..."
    },
    {
      "path": "css/styles.css",
      "content": "... comprehensive CSS with modern features ..."
    },
    {
      "path": "js/app.js",
      "content": "... well-structured JavaScript with complete functionality ..."
    },
    {
      "path": "js/utils.js",
      "content": "... utility functions and helpers ..."
    },
    {
      "path": "css/variables.css",
      "content": "... CSS custom properties and themes ..."
    }
  ]
}

Requirements:
1. README.md should include:
   - Project title and description
   - Features list
   - Installation instructions
   - Usage guide
   - Technologies used
   - Contributing guidelines
   - License information

2. HTML should include:
   - Proper meta tags and SEO
   - Responsive layout structure
   - Semantic HTML elements
   - Accessibility features
   - Loading indicators
   - Error states

3. CSS should include:
   - Modern CSS features (Grid, Flexbox)
   - Responsive design
   - Dark/Light theme support
   - Animations and transitions
   - CSS custom properties
   - Mobile-first approach

4. JavaScript should include:
   - Modern ES6+ features
   - Error handling
   - Local storage integration
   - Data validation
   - State management
   - Event handling
   - Utility functions
   - Type checking
   - Performance optimizations`
        },
        {
          role: "user",
          content: `Create a professional web app with this description: ${projectIdea}

Technical Requirements:
1. Modern, responsive UI with clean design
2. Complete CRUD functionality
3. Data persistence using localStorage
4. Error handling and validation
5. Loading states and user feedback
6. Accessibility features
7. Performance optimization
8. Cross-browser compatibility
9. Mobile-first design
10. Dark/Light theme support`
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

    console.log('Raw code content:', codeContent);
    let generatedFiles;
    try {
      generatedFiles = JSON.parse(codeContent);
      if (!generatedFiles.files || !Array.isArray(generatedFiles.files)) {
        throw new Error('Invalid response format: missing files array');
      }
      if (generatedFiles.files.length === 0) {
        throw new Error('No files generated');
      }
      generatedFiles.files.forEach((file, index) => {
        if (!file.path || typeof file.path !== 'string') {
          throw new Error(`Invalid file at index ${index}: missing or invalid path`);
        }
        if (!file.content || typeof file.content !== 'string') {
          throw new Error(`Invalid file at index ${index}: missing or invalid content`);
        }
      });
    } catch (error) {
      console.error('Failed to parse or validate generated code:', error);
      throw new Error('Failed to generate valid project files');
    }

    console.log('Generated files:', generatedFiles.files.length);

    // Create and populate repository
    console.log('Creating GitHub repository...');
    const repoCreation = await createRepository(projectName, projectDescription);
    console.log('Created repository:', repoCreation.html_url);

    console.log('Committing files...');
    await commitCode(projectName, generatedFiles.files);
    console.log('Committed files to repository');

    return res.status(200).json({
      message: `# 🚀 Project Created Successfully!

## 🎯 Project Details
**Name:** ${projectName}
**Description:** ${projectDescription}

## 📂 Repository Information
Your project has been created at: [${repoCreation.html_url}](${repoCreation.html_url})

## 📁 Files Generated
${generatedFiles.files.map(f => `- \`${f.path}\`: ${getFileDescription(f.path)}`).join('\n')}

## 🛠️ Getting Started
1. Clone the repository:
   \`\`\`bash
   git clone ${repoCreation.html_url}
   cd ${projectName}
   \`\`\`

2. Open \`index.html\` in your browser or set up a local server

## ✨ Features
- Modern, responsive UI with clean design
- Complete CRUD functionality
- Data persistence using localStorage
- Error handling and validation
- Loading states and user feedback
- Accessibility features
- Dark/Light theme support

## 🤝 Need Help?
Let me know if you need help with:
- Setting up the development environment
- Adding new features
- Customizing the design
- Implementing additional functionality

---
*Made with ❤️ by [aimade.fun](https://aimade.fun) | Follow [@MoneroSolana](https://twitter.com/MoneroSolana) on Twitter*

Happy coding! 🎉`,
      repository: {
        name: projectName,
        url: repoCreation.html_url,
        owner: process.env.GITHUB_USERNAME,
        files: generatedFiles.files.map(f => ({ 
          name: f.path, 
          type: f.path.split('.').pop(),
          description: getFileDescription(f.path)
        }))
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

// Helper function to get file descriptions
function getFileDescription(path: string): string {
  const descriptions: { [key: string]: string } = {
    'README.md': 'Project documentation and setup guide',
    'index.html': 'Main HTML structure with responsive layout',
    'css/styles.css': 'Modern CSS styling with responsive design',
    'css/variables.css': 'CSS custom properties and theme configuration',
    'js/app.js': 'Core application logic and functionality',
    'js/utils.js': 'Utility functions and helper methods',
  };
  
  return descriptions[path] || 'Project file';
} 