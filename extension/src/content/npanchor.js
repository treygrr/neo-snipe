// The Neopoints counter in the Neopets header, `#npanchor`, pointed at your
// inventory instead of wherever it normally goes. Plain DOM, like the badges
// and the launcher: this runs on every page, so it must not pull in Vue.
import { INVENTORY_URL } from '../lib/neopets-search.js';

const MARK = 'neosnipeInventory';

/**
 * Rewriting the `href` is enough when the counter is a link, and it is the
 * better way: middle-click and ctrl-click still open a new tab, which a click
 * handler calling `location.assign` would swallow. Anything else — a span, a
 * div — has no href to change, so that gets the handler instead.
 *
 * The nav is re-rendered on some pages, so this is called from the same scan
 * the badges use. The mark makes repeat calls free, and a replaced counter
 * arrives without one and is picked up.
 */
export function linkNpAnchorToInventory(root = document) {
  const el = root.getElementById?.('npanchor') ?? root.querySelector?.('#npanchor');
  if (!el || el.dataset[MARK]) return null;

  el.dataset[MARK] = '1';

  if (el.tagName === 'A') {
    el.href = INVENTORY_URL;
    el.removeAttribute('target');
    return el;
  }

  el.style.cursor = 'pointer';
  el.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    window.location.assign(INVENTORY_URL);
  });
  return el;
}
