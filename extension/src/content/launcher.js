// The bottom-right bar. Plain DOM for the same reason the badges are: it sits
// on every Neopets page, so it must not pull in Vue or Vuetify. Clicking it is
// what loads the panel.
import { mdiBagPersonal } from '@mdi/js';
import iconSvg from '../../icons/icon.svg?raw';
import { LAUNCHER, readPosition, writePosition, clamp, startDrag } from '../lib/positions.js';
import { INVENTORY_URL } from '../lib/neopets-search.js';

const CLASS = 'neosnipe-launcher';

// The app icon, as a data URI. A data-URI SVG is its own document, so its
// gradient ids cannot collide with anything Neopets has defined — inlining the
// markup into the page would risk exactly that.
//
// At this size the fine detail turns to mud, the same way it does at 16px, so
// the same `.detail` hook the icon build uses is switched off here too.
const ICON_URL = `data:image/svg+xml,${encodeURIComponent(
  iconSvg.replace('<defs>', '<style>.detail{display:none}</style><defs>'),
)}`;

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

.${CLASS}-main, .${CLASS}-inv {
  display: flex; align-items: center; height: 26px; padding: 0;
  border: 0; background: transparent; color: inherit; font: inherit;
  border-radius: 13px; cursor: pointer;
}
.${CLASS}-main { gap: 6px; padding: 0 8px 0 6px; }
.${CLASS}-inv { justify-content: center; width: 26px; }
.${CLASS}-main:hover, .${CLASS}-inv:hover { background: rgba(31,111,235,.12); }
.${CLASS}-main:focus-visible, .${CLASS}-inv:focus-visible {
  outline: 2px solid currentColor; outline-offset: -2px;
}
.${CLASS}-inv svg { width: 17px; height: 17px; display: block; fill: currentColor; }

.${CLASS}-icon {
  width: 20px; height: 20px; flex: 0 0 auto;
  background: url("${ICON_URL}") center / contain no-repeat;
  border-radius: 5px;
}

/* Moved: left/top are set inline, so the default corner must stop applying. */
.${CLASS}[data-moved="1"] { right: auto; bottom: auto; }
.${CLASS}[data-draggable="1"] { cursor: grab; }
.${CLASS}[data-dragging="1"] {
  cursor: grabbing; transform: none;
  box-shadow: 0 6px 18px rgba(0,0,0,.3);
  /* A drag over the page must not select the text under it. */
  user-select: none;
}
`;



let button = null;
// Off until settings have been read, so the button cannot be dragged away in
// the moment before we know whether that is allowed.
let draggable = false;
// Set by a drag that actually moved, and cleared on the next tick, so the
// click the browser fires at the end of a drag does not also open the panel.
let suppressClick = false;

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

  const main = document.createElement('button');
  main.type = 'button';
  main.className = `${CLASS}-main`;
  const icon = document.createElement('span');
  icon.className = `${CLASS}-icon`;
  const label = document.createElement('span');
  label.textContent = 'neo-snipe';
  main.append(icon, label);
  main.title = 'neo-snipe — favourites and dailies';
  main.setAttribute('aria-label', main.title);

  // A plain link, so it can be middle-clicked or opened in a new tab like any
  // other. Styled as a button because it sits in a row of them.
  const inv = document.createElement('a');
  inv.className = `${CLASS}-inv`;
  inv.href = INVENTORY_URL;
  inv.title = 'Your inventory';
  inv.setAttribute('aria-label', inv.title);
  inv.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${mdiBagPersonal}"/></svg>`;

  button.append(main, inv);

  main.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (suppressClick) return;
    onActivate(button);
  });

  // A drag that ends on the link must not also follow it.
  inv.addEventListener('click', (event) => {
    if (suppressClick) event.preventDefault();
    else event.stopPropagation();
  });

  button.addEventListener('pointerdown', onPointerDown);

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
