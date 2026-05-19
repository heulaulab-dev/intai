import type { AnalysisReport, OutreachMessage } from '../types/index.js';
import { scrapeWebsite } from '../services/scraper.js';
import { analyzeWithAI } from '../services/ai.js';
import { OUTREACH_PROMPT } from '../prompts/outreach.js';

export async function generateOutreach(
  url: string,
  existingAnalysis?: AnalysisReport
): Promise<OutreachMessage> {
  let analysis = existingAnalysis;

  if (!analysis) {
    const scraperResult = await scrapeWebsite(url);

    if (scraperResult.error || !scraperResult.content) {
      throw new Error(
        `Failed to fetch website: ${scraperResult.error || 'No content extracted'}`
      );
    }

    const { analyzeBusiness } = await import('./analysis.js');
    analysis = await analyzeBusiness(url);
  }

  const outreach = await analyzeWithAI<OutreachMessage>(
    OUTREACH_PROMPT,
    JSON.stringify(analysis, null, 2)
  );

  return outreach;
}