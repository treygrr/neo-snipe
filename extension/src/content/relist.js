// Fast Relist on the inventory page. A "Save to Fast Relist" button above the
// auction form's own Auction Item button keeps that form's values, and every
// item with a saved relist gets a refresh badge that opens the panel's Fast
// Relist view. Plain DOM, like the other badges: this runs before any Vue.
import { mdiRefresh } from '@mdi/js';
import { api } from '../lib/ext-api.js';
import {
  RELIST_KEY, readAuctionForm, cleanRelists, withRelist, relistKey,
} from '../lib/fast-relist.js';

const SAVE = 'neosnipe-relist-save';
const BADGE = 'neosnipe-relist';

// Sized by the same custom properties as the 🔍 badge, so Badge size applies to
// both, and !important for the same reason: some pages restyle every button.
const B = `button.${BADGE}`;
const CSS = `
${B} {
  all: initial !important;
  box-sizing: border-box !important;
  position: absolute !important; inset: auto auto 0 0 !important; z-index: 20 !important;
  width: var(--neosnipe-badge, 16px) !important; height: var(--neosnipe-badge, 16px) !important;
  display: flex !important; align-items: center !important; justify-content: center !important;
  border: 1px solid rgba(0,0,0,.25) !important; border-radius: 50% !important;
  background: #fff !important; color: #2e7d32 !important; cursor: pointer !important;
  box-shadow: 0 1px 2px rgba(0,0,0,.2) !important;
  transition: transform .12s ease !important;
}
${B}:hover, ${B}:focus-visible { transform: scale(1.15) !important; }
${B} svg {
  display: block !important;
  width: var(--neosnipe-badge-glyph, 10px) !important; height: var(--neosnipe-badge-glyph, 10px) !important;
  fill: currentColor !important;
}

.${SAVE} {
  display: block !important; width: fit-content !important; margin: 0 auto 8px !important;
  padding: 6px 14px !important; border-radius: 8px !important;
  background: #1f6feb !important; color: #fff !important; cursor: pointer !important;
  font: 700 13px/1.2 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
  text-align: center !important; box-shadow: 0 1px 3px rgba(0,0,0,.25) !important;
  user-select: none !important;
}
.${SAVE}:hover { background: #1a5fd0 !important; }
.${SAVE}:focus-visible { outline: 2px solid #1f6feb !important; outline-offset: 2px !important; }
.${SAVE}[data-state="saved"] { background: #2e7d32 !important; }
.${SAVE}[data-state="bad"] { background: #c62828 !important; }
`;

let saved = {};
let openRelist = null;

function refreshGlyph() {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(NS, 'path');
  path.setAttribute('d', mdiRefresh);
  svg.append(path);
  return svg;
}

/** Shows `text` on the button for a moment, then its usual label. */
function flash(btn, text, state) {
  btn.textContent = text;
  btn.dataset.state = state;
  clearTimeout(btn._neosnipeTimer);
  btn._neosnipeTimer = setTimeout(() => {
    delete btn.dataset.state;
    btn.textContent = saveLabel(btn.dataset.item);
  }, 2500);
}

const saveLabel = (name) => (name && saved[relistKey(name)] ? 'Update Fast Relist' : 'Save to Fast Relist');

async function save(btn, form) {
  const entry = readAuctionForm(form, {
    fallbackName: document.querySelector('#invDesc h3')?.textContent,
  });
  if (!entry) return flash(btn, 'Could not read the form', 'bad');
  if (!entry.startPrice) return flash(btn, 'Enter a start price first', 'bad');

  try {
    const got = await api.storage.local.get(RELIST_KEY);
    // The object id is for this copy only, so it is not kept.
    const { objId, ...keep } = entry;
    await api.storage.local.set({ [RELIST_KEY]: withRelist(got[RELIST_KEY], { ...keep, savedAt: Date.now() }) });
    btn.dataset.item = entry.name;
    flash(btn, 'Saved to Fast Relist ✓', 'saved');
  } catch {
    flash(btn, 'Could not save', 'bad');
  }
}

/** The save button, above Auction Item, whenever the auction form is showing. */
function addSaveButton() {
  const form = document.querySelector('#invResult');
  const auction = form?.querySelector('[onclick*="auctionItem"]');
  if (!auction || auction.previousElementSibling?.classList.contains(SAVE)) return;

  const name = readAuctionForm(form, { fallbackName: document.querySelector('#invDesc h3')?.textContent })?.name;
  const btn = document.createElement('div');
  btn.className = SAVE;
  btn.setAttribute('role', 'button');
  btn.tabIndex = 0;
  if (name) btn.dataset.item = name;
  btn.textContent = saveLabel(name);
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    save(btn, form);
  });
  btn.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    save(btn, form);
  });
  auction.before(btn);
}

/** A refresh badge on every inventory item with a relist, and on no others. */
function syncBadges() {
  for (const el of document.querySelectorAll('.item-img[data-itemname]')) {
    const has = Boolean(saved[relistKey(el.dataset.itemname)]);
    const badge = el.querySelector(`:scope > .${BADGE}`);
    if (!has) {
      badge?.remove();
      continue;
    }
    if (badge) continue;

    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = BADGE;
    btn.title = `Fast Relist "${el.dataset.itemname}"`;
    btn.setAttribute('aria-label', btn.title);
    btn.append(refreshGlyph());
    btn.addEventListener('click', (event) => {
      // Neopets opens its own item popup from clicks on the item.
      event.preventDefault();
      event.stopPropagation();
      openRelist?.({
        name: el.dataset.itemname,
        objId: el.dataset.objid || null,
        imageUrl: el.dataset.image || null,
      });
    });
    el.append(btn);
  }
}

function scan() {
  addSaveButton();
  syncBadges();
  // A label reads the saved list, which may have changed since it was drawn.
  const btn = document.querySelector(`.${SAVE}:not([data-state])`);
  if (btn) btn.textContent = saveLabel(btn.dataset.item);
}

/** `open(item)` shows the panel's Fast Relist view for `{ name, objId, imageUrl }`. */
export function startFastRelist({ open } = {}) {
  if (!/^\/inventory\.phtml/i.test(location.pathname)) return;
  openRelist = open;

  const style = document.createElement('style');
  style.dataset.neosnipe = 'relist';
  style.textContent = CSS;
  document.head.appendChild(style);

  api.storage.local.get(RELIST_KEY)
    .then((got) => { saved = cleanRelists(got[RELIST_KEY]); })
    .catch(() => {})
    .finally(scan);

  // The popup's forms and the item grid are both drawn by the page's scripts.
  let pending = null;
  new MutationObserver(() => {
    if (pending) return;
    pending = setTimeout(() => { pending = null; scan(); }, 150);
  }).observe(document.body, { childList: true, subtree: true });

  api.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local' || !(RELIST_KEY in changes)) return;
    saved = cleanRelists(changes[RELIST_KEY].newValue);
    scan();
  });
}
