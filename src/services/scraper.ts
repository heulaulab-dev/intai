import { scrapeWebsite as lightweightScrape, closeBrowser as lightweightClose } from './lightweight-scraper.js';
import type { ScraperResult } from '../types/index.js';

// Lightweight scraper is the default (fetch + cheerio)
// No browser installation required

export async function scrapeWebsite(url: string): Promise<ScraperResult> {
  return lightweightScrape(url);
}

export async function closeBrowser(): Promise<void> {
  return lightweightClose();
}