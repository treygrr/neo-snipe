import { MARK } from './detect.js';
import { DEFAULT_ICON_STEP, cleanIconStep, badgePx, badgeGlyphPx } from '../lib/launcher-size.js';

const BADGE_CLASS = 'neosnipe-badge';
const ANCHOR_CLASS = 'neosnipe-anchor';

// The badge is the one thing we deliberately put in the host document, so its
// styles are a single scoped rule rather than anything Vuetify. Some Neopets
// pages (e.g. the redesigned market) style every <button> in a card, so each
// declaration is !important to keep the page from restyling the badge. Its size
// comes from custom properties on the root, which setBadgeSize sets — `all:
// initial` leaves custom properties alone, so they still reach it.
const B = `button.${BADGE_CLASS}`;
const BADGE_CSS = `
${B} {
  all: initial !important;
  box-sizing: border-box !important;
  position: absolute !important; inset: auto 0 0 auto !important; z-index: 20 !important;
  width: var(--neosnipe-badge, 16px) !important; height: var(--neosnipe-badge, 16px) !important;
  min-width: 0 !important; min-height: 0 !important; max-width: none !important; max-height: none !important;
  padding: 0 !important; margin: 0 !important; float: none !important;
  display: flex !important; align-items: center !important; justify-content: center !important;
  border: 1px solid rgba(0,0,0,.25) !important; border-radius: 50% !important;
  background: #fff !important; color: #1f6feb !important; cursor: pointer !important;
  line-height: 1 !important; font-size: 10px !important;
  opacity: .45 !important; transform: none !important;
  transition: opacity .12s ease, transform .12s ease !important;
  box-shadow: 0 1px 2px rgba(0,0,0,.2) !important;
}
${B}:hover, ${B}:focus-visible { opacity: 1 !important; transform: scale(1.15) !important; }
.${ANCHOR_CLASS}:hover > ${B} { opacity: 1 !important; }

/* "Only show badges on hover" keeps them out of the way until you go looking. */
body[data-neosnipe-hover-only] ${B} { opacity: 0 !important; }
body[data-neosnipe-hover-only] .${ANCHOR_CLASS}:hover > ${B},
body[data-neosnipe-hover-only] ${B}:focus-visible,
body[data-neosnipe-hover-only] ${B}[data-state] { opacity: 1 !important; }
${B}[data-state="loading"] { opacity: 1 !important; color: #999 !important; }
${B}[data-state="error"]   { opacity: 1 !important; color: #d33 !important; }
${B} svg {
  display: block !important;
  width: var(--neosnipe-badge-glyph, 10px) !important; height: var(--neosnipe-badge-glyph, 10px) !important;
  margin: 0 !important; fill: currentColor !important; stroke: none !important;
}
`;

// A magnifier, inline so it needs no web-accessible resource.
const ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 3a6.5 6.5 0 0 1 5.25 10.33l5.46 5.46-1.42 1.42-5.46-5.46A6.5 6.5 0 1 1 9.5 3zm0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z"/></svg>`;

let stylesInjected = false;
function injectStyles() {
  if (stylesInjected) return;
  stylesInjected = true;
  const style = document.createElement('style');
  style.dataset.neosnipe = 'badge';
  style.textContent = BADGE_CSS;
  document.head.appendChild(style);
}

/**
 * Anchors the badge to the item without disturbing the page's own layout: we
 * only ever add `position: relative` to a static element.
 *
 * Grid surfaces (inventory, main shop) use a sized <div> for the item, which
 * can hold the badge directly. A bare <img> cannot, so we anchor to its parent
 * — or wrap it, when that parent holds several images.
 */
function anchorFor(el) {
  if (el.tagName !== 'IMG') {
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    el.classList.add(ANCHOR_CLASS);
    return el;
  }

  const img = el;
  const parent = img.parentElement;
  if (!parent) return null;

  // If the parent holds several images, "position: relative" on it would anchor
  // every badge to the same box, so wrap this image instead.
  const sharesParent = parent.querySelectorAll('img').length > 1;

  if (sharesParent) {
    const wrap = document.createElement('span');
    wrap.dataset.neosnipe = 'wrap';
    wrap.className = ANCHOR_CLASS;
    wrap.style.cssText = 'position:relative;display:inline-block;line-height:0';
    img.replaceWith(wrap);
    wrap.appendChild(img);
    return wrap;
  }

  if (getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
  parent.classList.add(ANCHOR_CLASS);
  return parent;
}

export function addBadge(el, item, onActivate) {
  const anchor = anchorFor(el);
  if (!anchor) return null;

  injectStyles();
  el.dataset[MARK] = '1';

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = BADGE_CLASS;
  btn.innerHTML = ICON;
  btn.title = `neo-snipe: look up "${item.name}"`;
  btn.setAttribute('aria-label', btn.title);

  btn.addEventListener('click', (event) => {
    // Neopets attaches its own handlers to item images and their containers.
    event.preventDefault();
    event.stopPropagation();
    onActivate(btn, item);
  });

  anchor.appendChild(btn);
  return btn;
}

/** Sizes every badge on the page, now and later, from the `badgeIconStep` setting. */
export function setBadgeSize(step) {
  const clean = cleanIconStep(step, DEFAULT_ICON_STEP.badge);
  const root = document.documentElement.style;
  root.setProperty('--neosnipe-badge', `${badgePx(clean)}px`);
  root.setProperty('--neosnipe-badge-glyph', `${badgeGlyphPx(clean)}px`);
}

export function setBadgeState(btn, state) {
  if (state) btn.dataset.state = state;
  else delete btn.dataset.state;
}
