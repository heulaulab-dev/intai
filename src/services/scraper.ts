import { chromium, type Browser, type Page } from 'playwright';
import type { ScraperResult } from '../types/index.js';

let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browser) {
    browser = await chromium.launch({ headless: true });
  }
  return browser;
}

export async function scrapeWebsite(url: string): Promise<ScraperResult> {
  let page: Page | null = null;

  try {
    const browserInstance = await getBrowser();
    page = await browserInstance.newPage();

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    await page.waitForTimeout(2000);

    const title = await page.title();

    const content = await page.evaluate(() => {
      const body = document.body;
      if (!body) return '';

      const removeSelectors = [
        'script',
        'style',
        'nav',
        'footer',
        'header',
        'noscript',
        '[role="navigation"]',
        '[aria-hidden="true"]',
      ];

      const clone = body.cloneNode(true) as HTMLElement;

      removeSelectors.forEach((selector) => {
        clone.querySelectorAll(selector).forEach((el) => el.remove());
      });

      const text = clone.innerText || clone.textContent || '';

      return text
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, '\n')
        .trim()
        .slice(0, 15000);
    });

    return {
      title,
      content,
      url,
    };
  } catch (error) {
    return {
      title: '',
      content: '',
      url,
      error: error instanceof Error ? error.message : 'Unknown error',
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