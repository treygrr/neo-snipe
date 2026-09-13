// The bottom-right bar. Plain DOM for the same reason the badges are: it sits
// on every Neopets page, so it must not pull in Vue or Vuetify. Clicking it is
// what loads the panel.
import {
  mdiBagPersonal, mdiDragVertical, mdiVolcano, mdiLoading, mdiCheckCircle,
} from '@mdi/js';
import iconSvg from '../../icons/icon.svg?raw';
import { LAUNCHER, readPosition, writePosition, clamp, startDrag } from '../lib/positions.js';
import { INVENTORY_URL } from '../lib/neopets-search.js';
import { MAGMA_POOL_URL } from '../lib/magma.js';

const CLASS = 'neosnipe-launcher';

// Neopets' own artwork, inlined at build time. Hot-linking images.neopets.com
// would leave the buttons blank the moment those paths move, and a data URI
// needs no web-accessible resource — which the Safari build cannot rely on.
import SW_ICON from '../../icons/shopwizard-icon.png?inline';
import SSW_ICON from '../../icons/ssw-icon.png?inline';

// The app icon, as a data URI. A data-URI SVG is its own document, so its
// gradient ids cannot collide with anything Neopets has defined — inlining the
// markup into the page would risk exactly that.
//
// At this size the fine detail turns to mud, the same way it does at 16px, so
// the same `.detail` hook the icon build uses is switched off here too.
const ICON_URL = `data:image/svg+xml,${encodeURIComponent(
  iconSvg.replace('<defs>', '<style>.detail{display:none}</style><defs>'),
)}`;

// The Magma Pool button's glyph for each state it can be in.
const MAGMA_GLYPHS = { idle: mdiVolcano, loading: mdiLoading, found: mdiCheckCircle };

const CSS = `
/* The bar itself is only a container now: it carries the position, the drag
   and the open state, while each button inside owns its own click. */
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
.${CLASS}[data-open="1"] {
  background: #e8f0fe; border-color: #1f6feb; color: #14459c;
  box-shadow: 0 2px 10px rgba(31,111,235,.35);
}

.${CLASS}-main, .${CLASS}-sw, .${CLASS}-ssw, .${CLASS}-magma, .${CLASS}-inv {
  display: flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; padding: 0;
  border: 0; background: transparent; color: inherit; font: inherit;
  border-radius: 13px; cursor: pointer;
}
.${CLASS} button:hover, .${CLASS} a:hover { background: rgba(31,111,235,.12); }
.${CLASS} button:focus-visible, .${CLASS} a:focus-visible {
  outline: 2px solid currentColor; outline-offset: -2px;
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
/* Matched to the app icon above, so the two buttons read as a pair. */
.${CLASS}-inv svg, .${CLASS}-magma svg { width: 20px; height: 20px; display: block; fill: currentColor; }

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

.${CLASS}-icon {
  width: 20px; height: 20px; flex: 0 0 auto;
  background: url("${ICON_URL}") center / contain no-repeat;
  border-radius: 5px;
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
// click the browser fires at the end of a drag does not also open the panel.
let suppressClick = false;

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

  const rect = button.getBoundingClientRect();
  startDrag(event, {
    origin: { x: rect.left, y: rect.top },
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

  // Icon only. The name is carried by the title and the aria-label, which is
  // what a screen reader reads out, so dropping the text costs nothing there.
  const main = document.createElement('button');
  main.type = 'button';
  main.className = `${CLASS}-main`;
  const icon = document.createElement('span');
  icon.className = `${CLASS}-icon`;
  main.append(icon);
  main.title = 'neo-snipe — favourites and dailies';
  main.setAttribute('aria-label', main.title);

  // Each opens the panel on its own search view. Same click path as the main
  // button, so a drag that ends over one does not trigger it either.
  const viewButton = (view, className, title) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = className;
    el.title = title;
    el.setAttribute('aria-label', title);
    const art = document.createElement('span');
    art.className = `${CLASS}-glyph`;
    el.append(art);
    el.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (suppressClick) return;
      onActivate(view);
    });
    return el;
  };

  const sw = viewButton('wiz', `${CLASS}-sw`, 'Shop Wizard search');
  const ssw = viewButton('ssw', `${CLASS}-ssw`, 'Super Shop Wizard search');

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

  button.append(grip, main, sw, ssw, magma, inv);

  main.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (suppressClick) return;
    onActivate('panel');
  });

  // Only the grip drags. Keeping the capture off the buttons is what leaves
  // their clicks — and the inventory link's ctrl-click and middle-click —
  // working: a pointer capture retargets the click that ends a gesture to
  // whatever element took the capture.
  grip.addEventListener('pointerdown', onPointerDown);

  // A window that has since been made narrower must not strand the button
  // off-screen, since it is the only way back to the panel.
  window.addEventListener('resize', () => {
    if (button?.dataset.moved) place(clamp(button.getBoundingClientRect(), size()));
  });

  document.body.appendChild(button);
  return button;
}

export function setLauncherOpen(open) {
  if (button) button.dataset.open = open ? '1' : '0';
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
