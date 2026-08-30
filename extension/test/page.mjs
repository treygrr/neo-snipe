import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const fx = (name) =>
  readFileSync(resolve(`test/fixtures/neopets-${name}.html`), 'utf8')
    .replace(/<!--[^]*?-->\s*/g, '')
    .trim();

/**
 * A stand-in Neopets page built from markup captured off the live site, so the
 * end-to-end tests exercise the shapes that actually exist:
 * inventory grid, main shop grid, safety deposit box, auctions, trading post.
 */
export const ITEM_COUNT = 14; // 4 inventory + 4 shop + 4 sdb + 1 auction + 1 trade

export function buildPage() {
  return `<!doctype html><html><head><title>Neopets</title><style>
    body { font-family: Verdana; font-size: 11px; background: #eee; }
    /* The live pages size item art from their own stylesheets. */
    .item-img, .sdb-item-img, .ah2_thumb, .item-name-text ~ * , img.w-\\[40px\\] {
      width: 80px; height: 80px; display: inline-block; background-size: contain;
    }
    .grid-item, .shop-item, .sdb-item-cell { display: inline-block; margin: 6px; vertical-align: top; }
    td { border: 1px solid #ccc; padding: 4px; }
  </style></head><body>
    <h1>Inventory</h1>
    <div class="inv-grid">${fx('inventory')}</div>

    <h1>Main shop</h1>
    <div class="shop-grid">${fx('mainshop')}</div>

    <h1>Safety deposit box</h1>
    <table class="sdb-table"><tbody><tr><td>${fx('sdb')}</td></tr></tbody></table>

    <h1>Auctions</h1>
    <table class="ah2"><tbody>${fx('auctions-row')}</tbody></table>

    <h1>Trading post</h1>
    <div class="tp">${fx('tradingpost-row')}</div>

    <h1>Not items</h1>
    <img src="https://images.neopets.com/themes/h5/basic/images/v3/inventory-icon.svg" alt="Inventory" width="80">
    <img src="https://images.neopets.com/items/tiny.gif" alt="Tiny Thing" width="10" height="10">

    <div id="later"></div>
    <script>
      // Neopets loads inventory contents after the initial render.
      setTimeout(() => {
        document.getElementById('later').innerHTML =
          '<div class="grid-item"><div class="lazy item-img" style="width:80px;height:80px;display:inline-block"' +
          ' data-src="https://images.neopets.com/items/food_apple.gif"' +
          ' data-itemname="Green Apple" alt="A crunchy green apple."></div></div>';
      }, 400);
    </script>
  </body></html>`;
}
