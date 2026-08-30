import { MARK } from './detect.js';

const BADGE_CLASS = 'neosnipe-badge';
const ANCHOR_CLASS = 'neosnipe-anchor';

// The badge is the one thing we deliberately put in the host document, so its
// styles are a single scoped rule rather than anything Vuetify.
const BADGE_CSS = `
.${BADGE_CLASS} {
  position: absolute; right: 0; bottom: 0; z-index: 20;
  width: 16px; height: 16px; padding: 0; margin: 0;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(0,0,0,.25); border-radius: 50%;
  background: #fff; color: #1f6feb; cursor: pointer; line-height: 1;
  font-size: 10px; opacity: .45; transition: opacity .12s ease, transform .12s ease;
  box-shadow: 0 1px 2px rgba(0,0,0,.2);
}
.${BADGE_CLASS}:hover, .${BADGE_CLASS}:focus-visible { opacity: 1; transform: scale(1.15); }
.${ANCHOR_CLASS}:hover > .${BADGE_CLASS} { opacity: 1; }

/* "Only show badges on hover" keeps them out of the way until you go looking. */
body[data-neosnipe-hover-only] .${BADGE_CLASS} { opacity: 0; }
body[data-neosnipe-hover-only] .${ANCHOR_CLASS}:hover > .${BADGE_CLASS},
body[data-neosnipe-hover-only] .${BADGE_CLASS}:focus-visible,
body[data-neosnipe-hover-only] .${BADGE_CLASS}[data-state] { opacity: 1; }
.${BADGE_CLASS}[data-state="loading"] { opacity: 1; color: #999; }
.${BADGE_CLASS}[data-state="error"]   { opacity: 1; color: #d33; }
.${BADGE_CLASS} svg { width: 10px; height: 10px; fill: currentColor; }
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

export function setBadgeState(btn, state) {
  if (state) btn.dataset.state = state;
  else delete btn.dataset.state;
}
