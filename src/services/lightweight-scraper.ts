import { load } from 'cheerio';
import type { ScraperResult } from '../types/index.js';

const REMOVE_SELECTORS = [
  'script',
  'style',
  'nav',
  'footer',
  'header',
  'noscript',
  '[role="navigation"]',
  '[aria-hidden="true"]',
  '.nav',
  '.footer',
  '.header',
  '#nav',
  '#footer',
  '#header',
];

async function tryFetch(url: string): Promise<{ html: string | null; status: number; statusText: string }> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    },
    redirect: 'follow',
  });

  const html = await response.text();
  return {
    html,
    status: response.status,
    statusText: response.statusText,
  };
}

export async function scrapeWebsite(url: string): Promise<ScraperResult> {
  const urlsToTry = [
    url,
    url.startsWith('https://') ? url.replace('https://', 'http://') : url.replace('http://', 'https://'),
  ];

  for (const tryUrl of urlsToTry) {
    try {
      const { html, status } = await tryFetch(tryUrl);

      if (status === 200 && html) {
        const $ = load(html);

        // Check if it's a real 404 page
        const title = $('title').text().toLowerCase();
        const has404 = title.includes('404') || title.includes('not found') || title.includes('page not found');

        if (has404 && tryUrl === urlsToTry[1]) {
          // If first URL was 404, try the alternate protocol
          continue;
        }

        // Remove unwanted elements
        REMOVE_SELECTORS.forEach((selector) => {
          $(selector).remove();
        });

        // Get title
        const pageTitle = $('title').text().trim() ||
          $('h1').first().text().trim() ||
          $('meta[property="og:title"]').attr('content') ||
          '';

        // Get main content
        const body = $('body');
        const text = body.text() || body.html() || '';

        const content = text
          .replace(/\s+/g, ' ')
          .replace(/\n+/g, '\n')
          .trim()
          .slice(0, 15000);

        // Check if we got meaningful content
        if (content.length < 100) {
          return {
            title: '',
            content: '',
            url,
            error: 'Page appears to be empty or blocked. Try installing Playwright for JavaScript-rendered content.',
          };
        }

        return {
          title: pageTitle,
          content,
          url: tryUrl,
        };
      }
    } catch (error) {
      // Continue to next URL if this one fails
      continue;
    }
  }

  // Both attempts failed
  return {
    title: '',
    content: '',
    url,
    error: 'Failed to fetch the website. It may be blocking requests, down, or require JavaScript rendering.',
  };
}

export async function closeBrowser(): Promise<void> {
  // No-op for lightweight scraper
}