import { webkit, devices } from 'playwright';

// WebKit is Safari's actual engine, so the fingerprint is consistent end-to-end rather than a
// Safari UA string bolted onto Chromium (which would still send Sec-CH-UA client hints).
const SAFARI = devices['Desktop Safari'];

const POOL_SIZE = Number(process.env.CONTEXT_POOL_SIZE || 2);
const BLOCKED_RESOURCES = new Set(['image', 'font', 'media', 'stylesheet']);

let browser = null;
let launching = null;
const idle = [];
const waiters = [];

export function contextOptions() {
  return {
    ...SAFARI,
    // Allow pinning a specific Safari version without touching code.
    ...(process.env.SAFARI_UA ? { userAgent: process.env.SAFARI_UA } : {}),
    locale: 'en-US',
    timezoneId: 'America/New_York',
    extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' },
  };
}

export function userAgent() {
  return contextOptions().userAgent;
}

export function browserUp() {
  return Boolean(browser && browser.isConnected());
}

async function ensureBrowser() {
  if (browserUp()) return browser;
  if (launching) return launching;

  launching = (async () => {
    browser = await webkit.launch({ headless: process.env.HEADLESS !== 'false' });
    // A crashed browser invalidates every pooled context.
    browser.on('disconnected', () => {
      browser = null;
      idle.length = 0;
    });
    for (let i = 0; i < POOL_SIZE; i++) {
      idle.push(await browser.newContext(contextOptions()));
    }
    return browser;
  })();

  try {
    return await launching;
  } finally {
    launching = null;
  }
}

async function acquire() {
  await ensureBrowser();
  if (idle.length) return idle.pop();
  return new Promise((resolve) => waiters.push(resolve));
}

function release(context) {
  // Drop contexts belonging to a browser that has since died.
  if (!browserUp()) return;
  const waiter = waiters.shift();
  if (waiter) waiter(context);
  else idle.push(context);
}

/**
 * Runs `fn` with a fresh page on a pooled Safari-flavoured context.
 * The page is always closed; the context is reused.
 */
export async function withPage(fn, { blockAssets = true } = {}) {
  let context = await acquire();

  // A context can be dead even when the browser is up (rare). Replace it rather than failing.
  let page;
  try {
    page = await context.newPage();
  } catch {
    await ensureBrowser();
    context = await browser.newContext(contextOptions());
    page = await context.newPage();
  }

  if (blockAssets) {
    // We read image URLs from the DOM, so we never need the bytes.
    await page.route('**/*', (route) => {
      if (BLOCKED_RESOURCES.has(route.request().resourceType())) return route.abort();
      return route.continue();
    });
  }

  try {
    return await fn(page);
  } finally {
    await page.close().catch(() => {});
    release(context);
  }
}

export async function closeBrowser() {
  const b = browser;
  browser = null;
  idle.length = 0;
  if (b) await b.close().catch(() => {});
}
