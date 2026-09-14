// Fast Relist on the inventory page. A "Save to Fast Relist" button above the
// auction form's own Auction Item button keeps that form's values, and every
// item with a saved relist gets a refresh badge that opens the panel's Fast
// Relist view. Plain DOM, like the other badges: this runs before any Vue.
import { mdiRefresh } from '@mdi/js';
import { api } from '../lib/ext-api.js';
import {
  RELIST_KEY, readAuctionForm, cleanRelists, withRelist, relistKey,
} from '../lib/fast-relist.js';
import {
  isSdbPath, readSdbRow, sdbAuctionPopup, readSdbAuctionForm, readSdbAuctionPin, SDB_PIN_KEY,
} from '../lib/sdb.js';

const SAVE = 'neosnipe-relist-save';
const BADGE = 'neosnipe-relist';
// The box's badge sits in the flow beside the item's name rather than over its
// image: a row is not a tile, and there is nothing to pin a corner to.
const SDB_BADGE = 'neosnipe-relist-sdb';
const SDB_SAVE = 'neosnipe-relist-save-sdb';

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

${B}.${SDB_BADGE} {
  position: static !important; inset: auto !important;
  display: inline-flex !important; vertical-align: middle !important;
  margin: 0 0 0 6px !important; flex: 0 0 auto !important;
}

.${SAVE} {
  display: block !important; width: fit-content !important; margin: 0 auto 8px !important;
  padding: 6px 14px !important; border-radius: 8px !important;
  background: #1f6feb !important; color: #fff !important; cursor: pointer !important;
  font: 700 13px/1.2 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
  text-align: center !important; box-shadow: 0 1px 3px rgba(0,0,0,.25) !important;
  user-select: none !important;
}
/* Last child of the dialog's body, which is a flex column with its own gap —
   so the spacing above comes from that rather than from a margin here. */
.${SAVE}.${SDB_SAVE} {
  margin: 4px auto 0 !important; align-self: center !important;
}

.${SAVE}:hover { background: #1a5fd0 !important; }
.${SAVE}:focus-visible { outline: 2px solid #1f6feb !important; outline-offset: 2px !important; }
.${SAVE}[data-state="saved"] { background: #2e7d32 !important; }
.${SAVE}[data-state="bad"] { background: #c62828 !important; }
`;

let saved = {};
let openRelist = null;
let onSdb = false;

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

/**
 * Keeps the form's values as the item's Fast Relist. `read` overrides where the
 * values come from (the box's dialog rather than the inventory's form), and
 * `readPin` says how to find a PIN worth keeping with them.
 */
async function save(btn, form, { read, readPin } = {}) {
  const entry = read
    ? read()
    : readAuctionForm(form, { fallbackName: document.querySelector('#invDesc h3')?.textContent });
  if (!entry) return flash(btn, 'Could not read the form', 'bad');
  if (!entry.startPrice) return flash(btn, 'Enter a start price first', 'bad');

  // Only ever a PIN you have just typed yourself, and never an empty one over
  // a PIN already kept.
  const pin = readPin?.() ?? null;

  try {
    const got = await api.storage.local.get(RELIST_KEY);
    // The object id is for this copy only, so it is not kept.
    const { objId, ...keep } = entry;
    await api.storage.local.set({
      [RELIST_KEY]: withRelist(got[RELIST_KEY], { ...keep, savedAt: Date.now() }),
      ...(pin ? { [SDB_PIN_KEY]: pin } : {}),
    });
    btn.dataset.item = entry.name;
    flash(btn, pin ? 'Saved, with your PIN ✓' : 'Saved to Fast Relist ✓', 'saved');
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
        source: 'inventory',
        name: el.dataset.itemname,
        objId: el.dataset.objid || null,
        imageUrl: el.dataset.image || null,
      });
    });
    el.append(btn);
  }
}

/**
 * The same badge on every box row with a saved relist, beside the item's name.
 * Rows the box will not auction — no-trade, NC, an unverified account — get no
 * badge: the panel could not finish what it started.
 */
function syncSdbBadges() {
  for (const row of document.querySelectorAll('tr')) {
    const cell = row.querySelector(':scope .sdb-item-name');
    const badge = row.querySelector(`:scope .${SDB_BADGE}`);
    const item = cell ? readSdbRow(row) : null;
    if (!item || !item.canAuction || !saved[relistKey(item.name)]) {
      badge?.remove();
      continue;
    }
    if (badge) continue;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `${BADGE} ${SDB_BADGE}`;
    btn.title = `Fast Relist "${item.name}" from your Safety Deposit Box`;
    btn.setAttribute('aria-label', btn.title);
    btn.append(refreshGlyph());
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      openRelist?.({ source: 'sdb', ...item });
    });
    cell.append(btn);
  }
}

/**
 * The same Save button in the box's "Put up for Auction" dialog, at the foot of
 * its body under the PIN field — the dialog's footer holds Cancel and Confirm,
 * where a third button is easy to miss and easy to hit by mistake. The dialog
 * is the box's own form, so saving from it works exactly as saving from the
 * inventory's does, and it is where you already are when you decide these
 * values are worth keeping.
 */
function addSdbSaveButton() {
  const popup = sdbAuctionPopup(document);
  const body = popup?.querySelector('.popup-body__2020');
  if (!body || body.querySelector(`.${SAVE}`)) return;

  // No button on a dialog whose values cannot be read — there is nothing to save.
  const form = readSdbAuctionForm(popup);
  if (!form) return;
  const name = form.name;
  const btn = document.createElement('div');
  btn.className = `${SAVE} ${SDB_SAVE}`;
  btn.setAttribute('role', 'button');
  btn.tabIndex = 0;
  if (name) btn.dataset.item = name;
  btn.textContent = saveLabel(name);
  const run = (event) => {
    event.preventDefault();
    event.stopPropagation();
    // Read the dialog afresh: these are the values as they are when pressed.
    save(btn, null, {
      read: () => readSdbAuctionForm(sdbAuctionPopup(document)),
      readPin: () => readSdbAuctionPin(sdbAuctionPopup(document)),
    });
  };
  btn.addEventListener('click', run);
  btn.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    run(event);
  });
  body.append(btn);
}

function scan() {
  if (onSdb) {
    addSdbSaveButton();
    syncSdbBadges();
    // A label reads the saved list, which may have changed since it was drawn.
    const saveBtn = document.querySelector(`.${SDB_SAVE}:not([data-state])`);
    if (saveBtn) saveBtn.textContent = saveLabel(saveBtn.dataset.item);
    return;
  }
  addSaveButton();
  syncBadges();
  // A label reads the saved list, which may have changed since it was drawn.
  const btn = document.querySelector(`.${SAVE}:not([data-state])`);
  if (btn) btn.textContent = saveLabel(btn.dataset.item);
}

/**
 * `open(item)` shows the panel's Fast Relist view. The item says where it came
 * from: `{ source: 'inventory', name, objId, imageUrl }` from the inventory,
 * `{ source: 'sdb', name, objInfoId, imageUrl }` from the Safety Deposit Box.
 *
 * Both pages can save: the inventory from its auction form, the box from its
 * own "Put up for Auction" dialog.
 */
export function startFastRelist({ open } = {}) {
  onSdb = isSdbPath(location.pathname);
  if (!onSdb && !/^\/inventory\.phtml/i.test(location.pathname)) return;
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
