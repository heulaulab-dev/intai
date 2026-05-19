export type ProgressStage =
  | 'init'
  | 'env-check'
  | 'url-parse'
  | 'scraper-init'
  | 'scraping'
  | 'scraped'
  | 'content-check'
  | 'ai-prepare'
  | 'ai-send'
  | 'ai-waiting'
  | 'ai-response'
  | 'ai-parsing'
  | 'complete'
  | 'error';

export interface AnalyzeProgress {
  stage: ProgressStage;
  message: string;
  details?: string;
}

type ProgressCallback = (progress: AnalyzeProgress) => void;

let progressCallback: ProgressCallback | null = null;

export function setProgressCallback(cb: ProgressCallback | null): void {
  progressCallback = cb;
}

function emit(stage: AnalyzeProgress['stage'], message: string, details?: string): void {
  if (progressCallback) {
    progressCallback({ stage, message, details });
  }
}

import type { AnalysisReport } from '../types/index.js';
import { scrapeWebsite } from '../services/scraper.js';
import { analyzeWithAI } from '../services/ai.js';
import { ANALYSIS_PROMPT } from '../prompts/analysis.js';

export async function analyzeBusiness(url: string): Promise<AnalysisReport> {
  emit('init', 'Initializing...', 'Loading configuration and dependencies');
  emit('env-check', 'Checking environment...', 'Validating API keys and settings');

  emit('url-parse', `Parsing URL: ${url}`, 'Normalizing and validating');

  emit('scraper-init', 'Initializing scraper...', 'Setting up HTTP client and selectors');
  emit('scraping', 'Fetching website...', 'Connecting to target and downloading content');

  const scraperResult = await scrapeWebsite(url);

  if (scraperResult.error || !scraperResult.content) {
    emit('error', `Fetch failed: ${scraperResult.error || 'No content'}`, 'Check URL or try different scraper mode');
    throw new Error(
      `Failed to fetch website: ${scraperResult.error || 'No content extracted'}`
    );
  }

  if (scraperResult.content.length < 100) {
    emit('error', 'Content too sparse', 'Website may require JavaScript rendering');
    throw new Error('Website content too sparse to analyze');
  }

  const contentSize = (scraperResult.content.length / 1024).toFixed(1);
  emit('scraped', `Downloaded ${contentSize}KB`, `Title: ${scraperResult.title || 'Untitled'}`);

  emit('content-check', 'Processing content...', 'Cleaning HTML and extracting text');

  emit('ai-prepare', 'Preparing analysis...', 'Building prompt and context');
  emit('ai-send', 'Sending to AI...', 'Packaging content for model');
  emit('ai-waiting', 'AI is thinking...', 'Processing request, this may take a moment');

  const analysis = await analyzeWithAI<AnalysisReport>(
    ANALYSIS_PROMPT,
    scraperResult.content
  );

  emit('ai-response', 'Got response from AI', `Processing ${analysis.operationalSignals?.length || 0} operational signals`);
  emit('ai-parsing', 'Parsing results...', 'Extracting insights and recommendations');

  emit('complete', 'Analysis complete!', `Identified ${analysis.potentialProblems?.length || 0} potential problems`);

  return {
    ...analysis,
    websiteUrl: url,
  };
}