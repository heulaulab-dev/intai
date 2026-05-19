import { scrapeWebsite as lightweightScrape, closeBrowser as lightweightClose } from './lightweight-scraper.js';
import { scrapeWebsiteWithPlaywright as playwrightScrape, closeBrowser as playwrightClose } from './playwright-scraper.js';
import { loadConfig } from '../commands/config.js';
import type { ScraperResult } from '../types/index.js';

export async function scrapeWebsite(url: string): Promise<ScraperResult> {
  const config = loadConfig();
  const scraperMode = config.scraperMode || 'lightweight';

  if (scraperMode === 'playwright') {
    return playwrightScrape(url);
  }

  // Default to lightweight
  return lightweightScrape(url);
}

export async function closeBrowser(): Promise<void> {
  const config = loadConfig();
  const scraperMode = config.scraperMode || 'lightweight';

  if (scraperMode === 'playwright') {
    return playwrightClose();
  }

  return lightweightClose();
}