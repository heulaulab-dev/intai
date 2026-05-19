import { config } from 'dotenv';
import { homedir } from 'os';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';

config();

export const MODELS = {
  ANALYSIS: 'gpt-4o',
  OUTREACH: 'gpt-4o',
} as const;

interface Config {
  apiKey?: string;
  baseURL?: string;
  model?: string;
}

function loadConfig(): Config {
  try {
    const configDir = join(homedir(), '.intai');
    const configFile = join(configDir, 'config.json');

    if (existsSync(configFile)) {
      return JSON.parse(readFileSync(configFile, 'utf-8'));
    }
  } catch {
    // Return empty config on error
  }
  return {};
}

export function getOpenAIConfig() {
  const apiKey = process.env.OPENAI_API_KEY || loadConfig().apiKey;

  if (!apiKey) {
    console.error('Error: OPENAI_API_KEY is not set');
    console.error('Run: intai config set api-key <your-key>');
    console.error('Or set OPENAI_API_KEY in your .env file');
    process.exit(1);
  }

  const config = loadConfig();
  const baseURL = process.env.OPENAI_BASE_URL || config.baseURL;
  const model = config.model;

  return { apiKey, baseURL, model };
}