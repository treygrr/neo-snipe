// Detection tested against markup captured from the live Neopets site
// (test/fixtures/neopets-*.html). These are the shapes that broke the first
// implementation: three different ways of carrying item art, and two surfaces
// where `alt` holds the description rather than the name.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const detectSrc = readFileSync(resolve('src/content/detect.js'), 'utf8');
const fixture = (n) => readFileSync(resolve(`test/fixtures/neopets-${n}.html`), 'utf8');

// The module runs in the page so it can use real DOM/layout; strip the exports
// and hand back the functions the tests need.
const asPageFn = `(() => { ${detectSrc.replace(/^export /gm, '')}
  return { findItemElements, describeItem, itemImageUrl, itemNameFor, imageHashOf }; })()`;

const browser = await chromium.launch();

async function detectIn(html) {
  const page = await browser.newPage();
  // Served from the neopets origin so protocol-relative //images.neopets.com
  // URLs resolve exactly as they do on the real site.
  // A bare <tr> is discarded by the parser unless it sits inside a table.
  const body = /^\s*(<!--[^]*?-->\s*)*<tr\b/i.test(html) ? `<table><tbody>${html}</tbody></table>` : html;
  await page.route('**://www.neopets.com/**', (r) =>
    r.fulfill({ contentType: 'text/html', body: `<!doctype html><body>${body}</body>` }));
  await page.route('**://images.neopets.com/**', (r) =>
    r.fulfill({ contentType: 'image/gif',
      body: Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64') }));
  await page.goto('https://www.neopets.com/test');

  const found = await page.evaluate((src) => {
    const d = eval(src);
    // The live pages size item art via their own stylesheets, which the
    // fixtures don't carry. Give anything without an explicit width a real box
    // so the size filter behaves as it does on the site.
    for (const el of document.querySelectorAll('div.item-img, img')) {
      if (!el.getAttribute('width') && !el.style.width) {
        el.style.width = '80px'; el.style.height = '80px'; el.style.display = 'inline-block';
      }
    }
    return d.findItemElements().map((el) => ({ ...d.describeItem(el) || {}, tag: el.tagName }));
  }, asPageFn);

  await page.close();
  return found;
}

test('inventory: div.item-img, lazy data-src, name in data-itemname', async () => {
  const items = await detectIn(fixture('inventory'));
  assert.equal(items.length, 4);
  assert.equal(items[0].tag, 'DIV');
  assert.equal(items[0].name, 'Eo Codestone');
  assert.equal(items[0].imageHash, 'codestone5');
  // The regression that mattered: alt/title here is the description.
  for (const i of items) assert.ok(!/mystical codestone is used/i.test(i.name), 'name must not be the description');
});

test('main shop: inline background-image, name in data-name', async () => {
  const items = await detectIn(fixture('mainshop'));
  assert.equal(items.length, 4);
  assert.equal(items[0].name, 'Potion of Concealment');
  assert.equal(items[0].imageHash, 'camouflage');

  // The shop's data-link carries obj_info_id=8668, which is *Neopets'* id for
  // this item. Jelly Neo's id for it is 2243, and Jelly Neo's 8668 is a White
  // Chocolate Aisha. Harvesting it here once made shop lookups return the
  // wrong item, so detection must not surface any id at all.
  assert.deepEqual(Object.keys(items[0]).sort(), ['imageHash', 'name', 'tag']);
});

test('safety deposit box: plain <img>, name in alt', async () => {
  const items = await detectIn(fixture('sdb'));
  assert.equal(items.length, 4);
  assert.equal(items[0].tag, 'IMG');
  assert.equal(items[0].name, 'Coffee and Marshmallows');
  assert.equal(items[0].imageHash, 'coffeandmarsh');
});

test('auctions: empty alt, name in a sibling row link', async () => {
  const items = await detectIn(fixture('auctions-row'));
  assert.equal(items.length, 1);
  assert.equal(items[0].name, 'Usukicon Y17 Diary');
  assert.equal(items[0].imageHash, 'boo_usukicon_y17_diary');
});

test('trading post: no alt, name in p.item-name-text', async () => {
  const items = await detectIn(fixture('tradingpost-row'));
  assert.equal(items.length, 1);
  assert.equal(items[0].name, 'Silver Jetsam Plushie');
  assert.equal(items[0].imageHash, 'toy_jetsamplush6');
});

test('no Neopets obj_info_id leaks into the lookup, on any surface', async () => {
  for (const f of ['inventory', 'mainshop', 'sdb', 'auctions-row', 'tradingpost-row']) {
    for (const item of await detectIn(fixture(f))) {
      assert.ok(!('itemId' in item) && !('jellyNeoId' in item),
        `${f}: detection must not supply a Jelly Neo id — ${JSON.stringify(item)}`);
    }
  }
});

test('nothing is detected in item-free markup', async () => {
  const items = await detectIn(`
    <img src="https://images.neopets.com/themes/h5/basic/images/v3/inventory-icon.svg" alt="Inventory" width="80">
    <img src="https://images.neopets.com/items/tiny.gif" alt="Tiny" width="10" height="10">
    <div style="background-image:url('https://images.neopets.com/themes/h5/blue/images/bg-pattern.svg')"></div>`);
  assert.deepEqual(items, []);
});

test.after(async () => { await browser.close(); });
