// The bottom-right bar. Plain DOM for the same reason the badges are: it sits
// on every Neopets page, so it must not pull in Vue or Vuetify. Its buttons are
// what load the panel.
import {
  mdiBagPersonal, mdiDragVertical, mdiVolcano, mdiLoading, mdiCheckCircle, mdiScriptText,
  mdiHeart, mdiClockOutline, mdiFood, mdiCog, mdiChevronLeft, mdiChevronRight,
} from '@mdi/js';
import { LAUNCHER, readPosition, writePosition, clamp, startDrag } from '../lib/positions.js';
import { INVENTORY_URL } from '../lib/neopets-search.js';
import { MAGMA_POOL_URL } from '../lib/magma.js';

const CLASS = 'neosnipe-launcher';
// How long the bar takes to fold or unfold, in ms — the .2s in its CSS below.
const FOLD_MS = 200;

// Neopets' own artwork, inlined at build time. Hot-linking images.neopets.com
// would leave the buttons blank the moment those paths move, and a data URI
// needs no web-accessible resource — which the Safari build cannot rely on.
import SW_ICON from '../../icons/shopwizard-icon.png?inline';
import SSW_ICON from '../../icons/ssw-icon.png?inline';

// The Magma Pool button's glyph for each state it can be in.
const MAGMA_GLYPHS = { idle: mdiVolcano, loading: mdiLoading, found: mdiCheckCircle };

const CSS = `
/* The bar itself is only a container: it carries the position, the drag and
   whether it is collapsed, while each button inside owns its own click and
   shows whether its view is open. */
.${CLASS} {
  position: fixed; right: 16px; bottom: 16px; z-index: 2147482000;
  display: flex; align-items: center; gap: 2px;
  height: 34px; padding: 0 3px; margin: 0;
  border: 1px solid rgba(0,0,0,.15); border-radius: 17px;
  background: #fff; color: #1f6feb;
  font: 600 12px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  box-shadow: 0 2px 8px rgba(0,0,0,.18);
  transition: box-shadow .12s ease, transform .12s ease;
}
.${CLASS}:hover { box-shadow: 0 4px 14px rgba(0,0,0,.24); transform: translateY(-1px); }

.${CLASS}-fav, .${CLASS}-dailies, .${CLASS}-foodclub, .${CLASS}-sw, .${CLASS}-ssw, .${CLASS}-quests,
.${CLASS}-magma, .${CLASS}-inv, .${CLASS}-settings, .${CLASS}-toggle {
  display: flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; padding: 0;
  border: 0; background: transparent; color: inherit; font: inherit;
  border-radius: 13px; cursor: pointer;
}
.${CLASS} button:hover, .${CLASS} a:hover { background: rgba(31,111,235,.12); }
.${CLASS} button:focus-visible, .${CLASS} a:focus-visible {
  outline: 2px solid currentColor; outline-offset: -2px;
}
/* The button whose view the panel is showing. As specific as the hover rule
   and after it, so a pressed button still looks pressed under the pointer. */
.${CLASS} button[aria-pressed="true"] {
  background: rgba(31,111,235,.18); color: #14459c;
  box-shadow: inset 0 0 0 1px rgba(31,111,235,.45);
}

/* Every button's glyph is the same 20px square, whatever it is drawn from. */
.${CLASS}-glyph {
  display: block;
  width: 20px; height: 20px; flex: 0 0 auto;
  background: center / contain no-repeat;
}
.${CLASS}-sw .${CLASS}-glyph { background-image: url("${SW_ICON}"); }
.${CLASS}-ssw .${CLASS}-glyph { background-image: url("${SSW_ICON}"); }

/* The Super Shop Wizard is Premium-only, so its button is too. */
.${CLASS}[data-premium="0"] .${CLASS}-ssw { display: none; }
/* Icon-set glyphs are drawn at the same 20px square as the artwork ones. */
.${CLASS}-fav svg, .${CLASS}-dailies svg, .${CLASS}-foodclub svg, .${CLASS}-quests svg,
.${CLASS}-magma svg, .${CLASS}-inv svg, .${CLASS}-settings svg, .${CLASS}-toggle svg {
  width: 20px; height: 20px; display: block; fill: currentColor;
}

/* Quests ready to claim, as a count on the Quest Log button's corner. */
.${CLASS}-quests { position: relative; }
.${CLASS}-count {
  position: absolute; top: -3px; right: -4px;
  min-width: 14px; height: 14px; padding: 0 3px; box-sizing: border-box;
  border-radius: 7px; background: #2e7d32; color: #fff;
  font: 700 9px/14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  text-align: center; pointer-events: none;
}

/* The Magma Pool button only exists while checking is switched on. */
.${CLASS}:not([data-magma]) .${CLASS}-magma,
.${CLASS}[data-magma="off"] .${CLASS}-magma { display: none; }
.${CLASS}[data-magma="idle"] .${CLASS}-magma { color: #c2410c; }
.${CLASS}[data-magma="loading"] .${CLASS}-magma { color: #c2410c; cursor: progress; }
.${CLASS}[data-magma="loading"] .${CLASS}-magma svg { animation: ${CLASS}-spin .8s linear infinite; }
.${CLASS}[data-magma="found"] .${CLASS}-magma { color: #2e7d32; }
@keyframes ${CLASS}-spin { to { transform: rotate(360deg); } }

/* A short message above the bar, which is where the eye already is. */
.${CLASS}-notice {
  position: absolute; right: 0; bottom: calc(100% + 8px);
  display: flex; align-items: flex-start; gap: 8px;
  box-sizing: border-box; width: max-content; max-width: min(320px, calc(100vw - 32px));
  padding: 9px 10px 9px 12px; border-radius: 10px;
  background: #1f2937; color: #fff; box-shadow: 0 6px 20px rgba(0,0,0,.28);
  font: 500 12px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  cursor: default;
}
/* A bar dragged to the top of the window gets its notice underneath instead. */
.${CLASS}[data-notice-below="1"] .${CLASS}-notice { bottom: auto; top: calc(100% + 8px); }
.${CLASS}-notice-text { flex: 1 1 auto; min-width: 0; }
.${CLASS}-notice-link { display: block; margin-top: 3px; color: #fdba74; font-weight: 700; text-decoration: none; }
.${CLASS}-notice-link:hover { text-decoration: underline; }
.${CLASS} .${CLASS}-notice-x {
  flex: 0 0 auto; width: 18px; height: 18px; padding: 0; margin: -2px -2px 0 0;
  border: 0; border-radius: 9px; background: transparent; color: inherit;
  font: 16px/18px sans-serif; cursor: pointer; opacity: .7;
}
.${CLASS} .${CLASS}-notice-x:hover { opacity: 1; background: rgba(255,255,255,.15); }

/* The handle. Hidden entirely when dragging is switched off, so the bar does
   not offer an affordance that would do nothing. */
.${CLASS}-grip {
  display: none; align-items: center; justify-content: center;
  width: 14px; height: 26px; flex: 0 0 auto;
  margin-right: -2px;
  cursor: grab; opacity: .4;
  touch-action: none;
}
.${CLASS}[data-draggable="1"] .${CLASS}-grip { display: flex; }
.${CLASS}-grip:hover { opacity: .75; }
.${CLASS}[data-dragging="1"] .${CLASS}-grip { cursor: grabbing; opacity: .75; }
.${CLASS}-grip svg { width: 16px; height: 16px; display: block; fill: currentColor; }

/* Collapsed: only the handle and the arrow stay, so the bar can be tucked away.
   The notice is left alone because a Magma Pool time must still reach you.
   Folding is animated, so it cannot be display: none — the buttons narrow to
   nothing and fade, cancelling the bar's gap as they go, and only then turn
   hidden, which is what takes them out of the tab order. Expanding runs it
   backwards, visible first. Buttons the Premium and Magma rules above hide are
   still display: none, and simply stay that way. */
.${CLASS} > :not(.${CLASS}-grip):not(.${CLASS}-toggle):not(.${CLASS}-notice) {
  max-width: 40px;
  transition: max-width .2s ease, margin-right .2s ease, opacity .15s ease, visibility 0s linear 0s;
}
.${CLASS}[data-collapsed="1"] > :not(.${CLASS}-grip):not(.${CLASS}-toggle):not(.${CLASS}-notice) {
  max-width: 0; margin-right: -2px; opacity: 0; overflow: hidden;
  visibility: hidden; pointer-events: none;
  transition: max-width .2s ease, margin-right .2s ease, opacity .15s ease, visibility 0s linear .2s;
}
@media (prefers-reduced-motion: reduce) {
  .${CLASS} > * { transition: none !important; }
}

/* Moved: left/top are set inline, so the default corner must stop applying. */
.${CLASS}[data-moved="1"] { right: auto; bottom: auto; }
.${CLASS}[data-dragging="1"] {
  transform: none;
  box-shadow: 0 6px 18px rgba(0,0,0,.3);
  /* A drag over the page must not select the text under it. */
  user-select: none;
}
`;



let button = null;
let magma = null;
let magmaPath = null;
let magmaHandler = null;
let notice = null;
let noticeTimer = null;
// Off until settings have been read, so the button cannot be dragged away in
// the moment before we know whether that is allowed.
let draggable = false;
// Set by a drag that actually moved, and cleared on the next tick, so the
// click the browser fires at the end of a drag does not also press whatever
// button it ended over.
let suppressClick = false;
// Each view button against its view, so the open one can be marked.
const viewButtons = new Map();
// Collapsed is in-memory only: every page load starts with the whole bar showing.
let collapsed = false;

/**
 * An SVG glyph built as nodes. innerHTML would do it in a line, but store
 * reviewers flag every innerHTML assignment, and the path is all that varies.
 */
function glyph(d, hidden = true) {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  if (hidden) svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(NS, 'path');
  path.setAttribute('d', d);
  svg.append(path);
  return { svg, path };
}

function place({ x, y }) {
  button.style.left = `${x}px`;
  button.style.top = `${y}px`;
  button.dataset.moved = '1';
}

/** Back to the bottom-right corner the stylesheet puts it in. */
function unplace() {
  button.style.left = '';
  button.style.top = '';
  delete button.dataset.moved;
}

/**
 * Where the bar sits, leaving out the hover lift. The pointer is over the bar
 * whenever its arrow is clicked or its grip picked up, and a measured rect
 * includes that transform, so clamping from one crept the bar up a pixel each
 * time. offsetLeft/Top ignore transforms and, for a fixed element, are
 * measured from the viewport.
 */
function position() {
  if (button.dataset.moved) return { x: parseFloat(button.style.left), y: parseFloat(button.style.top) };
  return { x: button.offsetLeft, y: button.offsetTop };
}

function size() {
  const rect = button.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}

async function restorePosition() {
  if (!button) return;
  const saved = draggable ? await readPosition(LAUNCHER) : null;
  if (saved) place(clamp(saved, size()));
  else unplace();
}

function onPointerDown(event) {
  // Left button only, and only when the feature is on.
  if (!draggable || event.button !== 0) return;

  startDrag(event, {
    origin: position(),
    onMove: (pos) => {
      button.dataset.dragging = '1';
      place(clamp(pos, size()));
    },
    onEnd: ({ moved, x, y }) => {
      delete button.dataset.dragging;
      if (!moved) return;
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 0);
      const final = clamp({ x, y }, size());
      place(final);
      writePosition(LAUNCHER, final);
    },
  });
}

/**
 * Turning dragging off returns the button to its corner but leaves the saved
 * position alone, so turning it back on puts it where you had it.
 */
export function setLauncherDraggable(on) {
  draggable = !!on;
  if (!button) return;
  if (draggable) button.dataset.draggable = '1';
  else delete button.dataset.draggable;
  restorePosition();
}

/** Forgets the position and returns the button to the corner. */
export function resetLauncherPosition() {
  if (button) unplace();
}

export function addLauncher(onActivate) {
  if (button || !document.body) return button;

  const style = document.createElement('style');
  style.dataset.neosnipe = 'launcher';
  style.textContent = CSS;
  document.head.appendChild(style);

  button = document.createElement('div');
  button.className = CLASS;

  // First in the row, so the whole bar can be picked up from its edge without
  // going anywhere near a button that does something.
  const grip = document.createElement('span');
  grip.className = `${CLASS}-grip`;
  grip.title = 'Drag to move the bar';
  grip.setAttribute('aria-hidden', 'true');
  grip.append(glyph(mdiDragVertical, false).svg);

  // Each opens the panel on its own view, and closes it when that view is
  // already up. A drag that ends over one does not trigger it. Icon only: the
  // name is carried by the title and the aria-label, which is what a screen
  // reader reads out. `d` draws from the icon set; without it the button shows
  // Neopets' artwork.
  const viewButton = (view, className, title, d = null) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = className;
    el.title = title;
    el.setAttribute('aria-label', title);
    el.setAttribute('aria-pressed', 'false');
    if (d) {
      el.append(glyph(d).svg);
    } else {
      const art = document.createElement('span');
      art.className = `${CLASS}-glyph`;
      el.append(art);
    }
    el.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (suppressClick) return;
      onActivate(view);
    });
    viewButtons.set(view, el);
    return el;
  };

  const fav = viewButton('favourites', `${CLASS}-fav`, 'Favourites', mdiHeart);
  const dailies = viewButton('dailies', `${CLASS}-dailies`, 'Dailies', mdiClockOutline);
  const foodclub = viewButton('foodclub', `${CLASS}-foodclub`, 'Food Club', mdiFood);
  const sw = viewButton('wiz', `${CLASS}-sw`, 'Shop Wizard search');
  const ssw = viewButton('ssw', `${CLASS}-ssw`, 'Super Shop Wizard search');
  const quests = viewButton('quests', `${CLASS}-quests`, 'Quest Log', mdiScriptText);

  // The Magma Pool: a real link to the pool, so once the time is found it is
  // an ordinary link. Before that, the checker takes the click instead.
  magma = document.createElement('a');
  magma.className = `${CLASS}-magma`;
  magma.href = MAGMA_POOL_URL;
  magma.title = 'Magma Pool';
  magma.setAttribute('aria-label', magma.title);
  const magmaGlyph = glyph(MAGMA_GLYPHS.idle);
  magmaPath = magmaGlyph.path;
  magma.append(magmaGlyph.svg);
  magma.addEventListener('click', (event) => {
    event.stopPropagation();
    if (suppressClick) { event.preventDefault(); return; }
    magmaHandler?.(event, button.dataset.magma || 'off');
  });

  // A plain link, so it can be middle-clicked or opened in a new tab like any
  // other. Styled as a button because it sits in a row of them.
  const inv = document.createElement('a');
  inv.className = `${CLASS}-inv`;
  inv.href = INVENTORY_URL;
  inv.title = 'Your inventory';
  inv.setAttribute('aria-label', inv.title);
  inv.append(glyph(mdiBagPersonal).svg);

  const settings = viewButton('settings', `${CLASS}-settings`, 'Settings', mdiCog);

  // Far right, and not a view: it hides every other button, never the panel.
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = `${CLASS}-toggle`;
  const toggleGlyph = glyph(mdiChevronLeft);
  toggle.append(toggleGlyph.svg);
  // Left while the buttons show, right once they are folded away.
  const showCollapsed = () => {
    if (collapsed) button.dataset.collapsed = '1';
    else delete button.dataset.collapsed;
    toggleGlyph.path.setAttribute('d', collapsed ? mdiChevronRight : mdiChevronLeft);
    toggle.title = collapsed ? 'Show the neo-snipe buttons' : 'Hide the neo-snipe buttons';
    toggle.setAttribute('aria-label', toggle.title);
    toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
  };
  toggle.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (suppressClick) return;
    collapsed = !collapsed;
    showCollapsed();
    // A moved bar grows rightwards from its left edge, so expanding near the
    // edge could push it off-screen. Clamp it, but do not save: nothing moved.
    // Only once the buttons have finished unfolding — measured any sooner, the
    // bar is still narrow and the clamp would let it end up past the edge.
    if (!collapsed && button.dataset.moved) {
      setTimeout(() => {
        if (!collapsed && button.dataset.moved) place(clamp(position(), size()));
      }, FOLD_MS + 20);
    }
  });

  button.append(grip, fav, dailies, foodclub, sw, ssw, quests, magma, inv, settings, toggle);
  showCollapsed();

  // Only the grip drags. Keeping the capture off the buttons is what leaves
  // their clicks — and the inventory link's ctrl-click and middle-click —
  // working: a pointer capture retargets the click that ends a gesture to
  // whatever element took the capture.
  grip.addEventListener('pointerdown', onPointerDown);

  // A window that has since been made narrower must not strand the button
  // off-screen, since it is the only way back to the panel.
  window.addEventListener('resize', () => {
    if (button?.dataset.moved) place(clamp(position(), size()));
  });

  document.body.appendChild(button);
  return button;
}

/**
 * Marks the button whose view the panel is showing; closed clears them all.
 * `data-open` on the bar is kept as the plain open/closed flag.
 */
export function setLauncherOpen(open, view = null) {
  if (!button) return;
  button.dataset.open = open ? '1' : '0';
  for (const [v, el] of viewButtons) el.setAttribute('aria-pressed', open && v === view ? 'true' : 'false');
}

/** The SSW button only exists for accounts that have the Super Shop Wizard. */
export function setLauncherPremium(on) {
  if (button) button.dataset.premium = on ? '1' : '0';
}

/**
 * The Magma Pool button's state: 'off' hides it, 'idle' shows the volcano,
 * 'loading' spins, 'found' is a checkmark. `title` says why, on hover.
 */
export function setMagmaState(state, title = 'Magma Pool') {
  if (!button || !magma) return;
  button.dataset.magma = state;
  if (MAGMA_GLYPHS[state]) magmaPath.setAttribute('d', MAGMA_GLYPHS[state]);
  magma.title = title;
  magma.setAttribute('aria-label', title);
  magma.setAttribute('aria-busy', state === 'loading' ? 'true' : 'false');
}

/** Who handles a click on the Magma Pool button: `fn(event, state)`. */
export function onMagmaClick(fn) {
  magmaHandler = fn;
}

/**
 * How many quests are ready to claim, as a small count on the Quest Log
 * button. Zero removes it rather than showing a 0.
 */
export function setQuestCount(count) {
  const el = button?.querySelector(`.${CLASS}-quests`);
  if (!el) return;
  const n = Math.max(0, Math.floor(Number(count)) || 0);
  let bubble = el.querySelector(`.${CLASS}-count`);
  if (!n) {
    bubble?.remove();
    el.title = 'Quest Log';
  } else {
    if (!bubble) {
      bubble = document.createElement('span');
      bubble.className = `${CLASS}-count`;
      bubble.setAttribute('aria-hidden', 'true');
      el.append(bubble);
    }
    bubble.textContent = n > 9 ? '9+' : String(n);
    el.title = `Quest Log — ${n} ready to claim`;
  }
  el.setAttribute('aria-label', el.title);
}

export function hideLauncherNotice() {
  clearTimeout(noticeTimer);
  notice?.remove();
  notice = null;
}

/**
 * A message above the bar, with an optional link. Replaces any notice already
 * showing, and goes by itself after `ms`.
 */
export function showLauncherNotice(text, { href = null, label = null, ms = 12_000 } = {}) {
  if (!button) return;
  hideLauncherNotice();

  notice = document.createElement('div');
  notice.className = `${CLASS}-notice`;
  notice.setAttribute('role', 'status');

  const body = document.createElement('div');
  body.className = `${CLASS}-notice-text`;
  body.textContent = text;
  if (href) {
    const link = document.createElement('a');
    link.className = `${CLASS}-notice-link`;
    link.href = href;
    link.textContent = label || href;
    body.append(link);
  }

  const close = document.createElement('button');
  close.type = 'button';
  close.className = `${CLASS}-notice-x`;
  close.setAttribute('aria-label', 'Dismiss');
  close.textContent = '×';
  close.addEventListener('click', (event) => {
    event.stopPropagation();
    hideLauncherNotice();
  });

  notice.append(body, close);
  button.dataset.noticeBelow = button.getBoundingClientRect().top < 90 ? '1' : '0';
  button.append(notice);
  noticeTimer = setTimeout(hideLauncherNotice, ms);
}
