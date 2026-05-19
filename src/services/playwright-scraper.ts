import { chromium, type Browser, type Page } from 'playwright';
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

let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browser) {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
  return browser;
}

export async function scrapeWebsiteWithPlaywright(url: string): Promise<ScraperResult> {
  let page: Page | null = null;

  try {
    const browserInstance = await getBrowser();
    page = await browserInstance.newPage();

    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    // Remove unwanted elements
    for (const selector of REMOVE_SELECTORS) {
      await page.evaluate((sel) => {
        document.querySelectorAll(sel).forEach((el) => el.remove());
      }, selector);
    }

    // Get title
    const title = await page.title();

    // Get body text
    const content = await page.evaluate(() => {
      const body = document.body;
      return (body?.textContent || '')
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, '\n')
        .trim()
        .slice(0, 15000);
    });

    if (content.length < 100) {
      return {
        title,
        content: '',
        url,
        error: 'Page appears to be empty or blocked.',
      };
    }

    return {
      title,
      content,
      url,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      title: '',
      content: '',
      url,
      error: `Failed to scrape with Playwright: ${message}`,
    };
  } finally {
    if (page) {
      await page.close();
    }
  }
}

export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close();
    browser = null;
  }
}
