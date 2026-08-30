// Sanity-check the browser layer: confirms we present as Safari and that a real
// Jelly Neo lookup returns a parsed item.
import 'dotenv/config';
import { withPage, userAgent, closeBrowser } from '../src/browser.js';
import { lookupItem } from '../src/jellyneo.js';

const name = process.argv[2] || 'Faerie Paint Brush';

const headers = await withPage(async (page) => {
  await page.goto('https://httpbin.org/headers', { waitUntil: 'domcontentloaded' });
  return JSON.parse(await page.evaluate(() => document.body.innerText)).headers;
});

console.log('configured UA:', userAgent());
console.log('UA as seen by server:', headers['User-Agent']);
console.log('Sec-CH-UA present:', Object.keys(headers).some((h) => /^sec-ch-ua/i.test(h)));

console.log(`\nlooking up "${name}"...`);
console.log(await lookupItem({ name }));

await closeBrowser();
