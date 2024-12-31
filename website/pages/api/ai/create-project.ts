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
          content: `You are a specialized ${projectType} developer. Generate a concise project idea that EXACTLY matches this prompt: "${prompt}". Keep it under 30 words and make it highly specific to the user's request.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
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
          content: `You are a senior ${projectType} developer creating a professional-grade project that implements: "${projectIdea}". 
Generate a comprehensive, production-ready application with advanced features.

Your response must be a valid JSON object with this structure:
{
  "files": [
    {
      "path": "README.md",
      "content": "Detailed project documentation with setup, features, and advanced usage..."
    },
    {
      "path": "index.html",
      "content": "Complete HTML structure with all UI components..."
    },
    {
      "path": "css/styles.css",
      "content": "Complete CSS with all styles, animations, and responsive design..."
    },
    {
      "path": "css/variables.css",
      "content": "Complete theme configuration and design tokens..."
    },
    {
      "path": "js/app.js",
      "content": "Complete application logic with all features implemented..."
    },
    {
      "path": "js/api.js",
      "content": "Complete API integration with error handling..."
    },
    {
      "path": "js/utils.js",
      "content": "Complete utility functions and helper methods..."
    },
    {
      "path": "js/state.js",
      "content": "Complete state management and data persistence..."
    }
  ]
}

IMPORTANT: Each file must contain COMPLETE, WORKING code. Do not use placeholders or comments like "// Implement feature here".

Requirements for each file:

1. index.html must include:
   - Complete navigation bar with all links
   - Main content area with all UI components
   - Forms with proper validation attributes
   - Loading indicators
   - Error message containers
   - Success message containers
   - Modal dialogs
   - Footer with links
   - All required meta tags
   - All required script and style links

2. styles.css must include:
   - Complete styling for all UI components
   - Responsive design with media queries
   - Animations and transitions
   - Loading spinners
   - Modal styles
   - Form styles
   - Error and success states
   - Hover and active states
   - Print styles
   - Accessibility styles

3. variables.css must include:
   - Complete theme configuration
   - Light and dark mode variables
   - Spacing scales
   - Typography scales
   - Color palettes
   - Animation durations
   - Z-index scales
   - Breakpoints
   - Border radiuses
   - Shadow definitions

4. app.js must include:
   - Complete initialization logic
   - Event listeners for all interactions
   - Form validation
   - Data processing
   - UI updates
   - Error handling
   - Loading states
   - Success states
   - Local storage
   - Service worker registration

5. api.js must include:
   - Complete API integration
   - Real-time data fetching
   - Error handling
   - Rate limiting
   - Caching
   - Retry logic
   - Authentication
   - Request/response interceptors
   - Offline support
   - WebSocket handling

6. utils.js must include:
   - Complete utility functions
   - Data formatting
   - Input validation
   - Error logging
   - Performance monitoring
   - Browser compatibility checks
   - Device detection
   - Feature detection
   - Date/time handling
   - Number formatting

7. state.js must include:
   - Complete state management
   - Data persistence
   - State updates
   - State subscriptions
   - History tracking
   - Undo/redo
   - State validation
   - State migration
   - State backup
   - State restoration

The code should be production-ready, following best practices for:
- Security (XSS prevention, input validation, etc.)
- Performance (code splitting, lazy loading, etc.)
- Accessibility (ARIA labels, keyboard navigation, etc.)
- Browser compatibility (polyfills, feature detection, etc.)
- Error handling (try/catch, error boundaries, etc.)
- Documentation (JSDoc comments, type definitions, etc.)`
        },
        {
          role: "user",
          content: `Create a professional web app that implements: ${projectIdea}

Technical Requirements:
1. Modern UI with animations and transitions
2. Complete CRUD functionality
3. Advanced data persistence
4. Comprehensive error handling
5. Loading states and progress indicators
6. Full responsive design
7. Performance optimization
8. Keyboard shortcuts
9. Drag and drop support
10. Search and filter
11. Export/import
12. Theme switching
13. Offline support
14. User preferences
15. Help documentation

The code must be complete and production-ready. Do not use placeholders or TODO comments.`
        }
      ],
      temperature: 0.2,
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
      message: `# ✨ Project Created Successfully!

## 📱 Project Overview
A professional ${projectType} application: ${projectDescription}

## 🔗 GitHub Repository
Your project is ready at: [${repoCreation.html_url}](${repoCreation.html_url})

## 📂 Project Structure
${generatedFiles.files.map(f => `- \`${f.path}\`: ${getFileDescription(f.path)}`).join('\n')}

## ⚡ Key Features
- 🎨 Modern, responsive design
- 💾 Local data persistence
- 🌓 Dark/Light theme support
- ⚡ Performance optimized
- ♿ Accessibility compliant
- 🔒 Input validation & error handling

## 🚀 Getting Started

### Windows
\`\`\`bash
git clone ${repoCreation.html_url}
cd ${projectName}
# Open index.html in your browser
# Or use Live Server in VS Code
\`\`\`

### macOS/Linux
\`\`\`bash
git clone ${repoCreation.html_url}
cd ${projectName}
python3 -m http.server 8000
# Visit http://localhost:8000
\`\`\`

### Using VS Code
1. Install Live Server extension
2. Right-click index.html
3. Select "Open with Live Server"

## 💡 Next Steps
- Customize styles in \`css/styles.css\`
- Add new features in \`js/app.js\`
- Deploy to GitHub Pages or your preferred host
- Add user authentication
- Implement data persistence

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