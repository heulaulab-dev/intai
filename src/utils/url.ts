import { URL } from 'node:url';

export function parseUrl(input: string): string {
  try {
    const url = new URL(input);
    return url.href;
  } catch {
    const withHttps = new URL(`https://${input}`);
    return withHttps.href;
  }
}

export function isValidUrl(input: string): boolean {
  try {
    new URL(input.startsWith('http') ? input : `https://${input}`);
    return true;
  } catch {
    return false;
  }
}

export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname;
  } catch {
    return url;
  }
}