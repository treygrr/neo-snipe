// Throwaway: find a geometry where a popover opens overflowing the window.
import { chromium } from 'playwright';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { installNeopetsRoutes, JELLYNEO_PAGES, jellyNeoFixture } from './routes.mjs';

const EXT = resolve('dist');
const ctx = await chromium.launchPersistentContext(mkdtempSync(join(tmpdir(), 'ns-')), {
  channel: 'chromium',
  headless: false,
  args: ['--headless=new', `--disable-extensions-except=${EXT}`, `--load-extension=${EXT}`],
});

await ctx.route('**://items.jellyneo.net/**', (route) => {
  const url = route.request().url();
  const hit = JELLYNEO_PAGES.find(([re]) => re.test(url));
  return hit
    ? route.fulfill({ contentType: 'text/html', body: jellyNeoFixture(hit[1]) })
    : route.fulfill({ status: 404, body: '' });
});

const page = await ctx.newPage();
await installNeopetsRoutes(page);
await page.goto('https://www.neopets.com/inventory.phtml');
await page.waitForSelector('.neosnipe-badge', { timeout: 15000 });

if (process.env.NS_TRANSFORM) {
  await page.addStyleTag({ content: 'body { transform: translateZ(0); }' });
  await page.waitForTimeout(300);
}

const measure = async (height) => {
  await page.setViewportSize({ width: 1280, height });
  await page.waitForTimeout(300);
  // Scroll to the foot of the page, the way you would browsing an inventory.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);

  // The badge closest to the bottom of what is on screen.
  const picked = await page.evaluate(() => {
    const badges = [...document.querySelectorAll('.neosnipe-badge')]
      .map((b, i) => ({ i, top: b.getBoundingClientRect().top }))
      .filter((b) => b.top > 0 && b.top < window.innerHeight);
    if (!badges.length) return null;
    return badges.sort((a, b) => b.top - a.top)[0];
  });
  if (!picked) return { height, skipped: true };

  await page.locator('.neosnipe-badge').nth(picked.i).click();
  await page.waitForFunction(() => {
    const r = document.querySelector('[data-neosnipe="popover-host"]')?.shadowRoot;
    return !!r?.querySelector('.ns-tab');
  }, null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(700);

  const out = await page.evaluate(() => {
    const root = document.querySelector('[data-neosnipe="popover-host"]').shadowRoot;
    const card = root.querySelector('.ns-popover');
    if (!card) return { none: true };
    const r = card.getBoundingClientRect();
    return {
      top: Math.round(r.top), bottom: Math.round(r.bottom),
      h: Math.round(r.height), vh: window.innerHeight,
      overflow: Math.round(Math.max(0, r.bottom - window.innerHeight) + Math.max(0, -r.top)),
      hostPos: getComputedStyle(document.querySelector('[data-neosnipe="popover-host"]')).position,
      hostTop: Math.round(document.querySelector('[data-neosnipe="popover-host"]').getBoundingClientRect().top),
    };
  });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
  return { height, ...out };
};

for (const h of [900, 720]) {
  console.log(JSON.stringify(await measure(h)));
}

await ctx.close();
