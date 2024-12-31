import OpenAI from 'openai';
import { Octokit } from '@octokit/rest';

export function createOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30000,
    maxRetries: 2,
  });
}

export function createOctokit() {
  return new Octokit({
    auth: process.env.GITHUB_ACCESS_TOKEN,
    request: {
      timeout: 30000
    }
  });
} 