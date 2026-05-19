import type { AnalysisReport } from '../types/index.js';
import { scrapeWebsite } from '../services/scraper.js';
import { analyzeWithAI } from '../services/ai.js';
import { ANALYSIS_PROMPT } from '../prompts/analysis.js';

export async function analyzeBusiness(url: string): Promise<AnalysisReport> {
  const scraperResult = await scrapeWebsite(url);

  if (scraperResult.error || !scraperResult.content) {
    throw new Error(
      `Failed to fetch website: ${scraperResult.error || 'No content extracted'}`
    );
  }

  if (scraperResult.content.length < 100) {
    throw new Error('Website content too sparse to analyze');
  }

  const analysis = await analyzeWithAI<AnalysisReport>(
    ANALYSIS_PROMPT,
    scraperResult.content
  );

  return {
    ...analysis,
    websiteUrl: url,
  };
}