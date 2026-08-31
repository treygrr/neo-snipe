import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildPage } from './page.mjs';

const fc = (f) => readFileSync(resolve('test/fixtures/foodclub', f), 'utf8');
export const jellyNeoFixture = (f) => readFileSync(resolve('test/fixtures/jellyneo', f), 'utf8');

export const JELLYNEO_PAGES = [
  [/\/trading-post-history\//, 'item-5554-trading-post-history.html'],
  [/\/item\/\d+\//, 'item-5554-faerie-paint-brush.html'],
  [/\/search\//, 'search-faerie-paint-brush.html'],
];

/**
 * Serves Neopets from saved pages: the item surfaces, the Food Club bet form
 * and the daily sets. Shared by the end-to-end tests and `npm run fixture`, so
 * the two cannot drift — the Food Club tab silently broke in the dev browser
 * once because only the tests had these routes.
 *
 * Pass a BrowserContext rather than a Page so tabs opened by the extension —
 * Fill and Place both open one — are served too.
 */
export async function installNeopetsRoutes(page) {
  // Order matters: Playwright matches the most recently registered route
  // first, so the catch-all goes down before the specific pages.
  await page.route('**://www.neopets.com/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: buildPage() }));

  // The Food Club page computes odds in its own script; stub those so the
  // form behaves as it does on the live site.
  await page.route('**://www.neopets.com/pirates/foodclub.phtml*', (route) => route.fulfill({
    contentType: 'text/html',
    body: `<!doctype html><html><body><script>
        window.calls = [];
        function add_odds(a, p) { window.calls.push(['add_odds', a, p]); }
        function calc_odds() { window.calls.push(['calc_odds']); }
        function reset_odds(a) { window.calls.push(['reset_odds', a]); }
        function set_winnings(v) { window.calls.push(['set_winnings', v]); }
      </script>${fc('bet-page.html')}</body></html>`,
  }));

  await page.route('**://www.neopets.com/~Shrmsh', (route) => route.fulfill({
    contentType: 'text/html',
    body: `<!doctype html><html><body>${fc('sets-page.html')}</body></html>`,
  }));

  // The Super Shop Wizard endpoint, from a real captured response.
  await page.route('**/np-templates/views/shops/ssw/ssw_query.php*', (route) => route.fulfill({
    contentType: 'application/json',
    body: readFileSync(resolve('test/fixtures/ssw/query-lu-codestone.json'), 'utf8'),
  }));

  await page.route('**://images.neopets.com/**', (route) => route.fulfill({
    contentType: 'image/gif',
    body: Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'),
  }));
}
