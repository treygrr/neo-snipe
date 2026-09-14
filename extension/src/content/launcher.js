// The bottom-right bar. Plain DOM for the same reason the badges are: it sits
// on every Neopets page, so it must not pull in Vue or Vuetify. Its buttons are
// what load the panel.
import {
  mdiBagPersonal, mdiDragVertical, mdiVolcano, mdiLoading, mdiCheckCircle, mdiScriptText,
  mdiHeart, mdiClockOutline, mdiFood, mdiCog, mdiChevronLeft, mdiChevronRight, mdiDragHorizontal,
} from '@mdi/js';
import {
  LAUNCHER, readPosition, writePosition, clamp, startDrag, DRAG_THRESHOLD,
} from '../lib/positions.js';
import { LAUNCHER_BUTTONS, fullOrder } from '../lib/tab-order.js';
import { INVENTORY_URL } from '../lib/neopets-search.js';
import { MAGMA_POOL_URL } from '../lib/magma.js';
import { DEFAULT_ICON_STEP, cleanIconStep, iconPx } from '../lib/launcher-size.js';

const CLASS = 'neosnipe-launcher';
// How long the bar takes to fold or unfold, in ms — the .2s in its CSS below.
const FOLD_MS = 200;
// Glyph sizes come from the icon-size settings, one per orientation. A
// horizontal button is 6px bigger than its glyph (26 around the default 20); a
// vertical one V_PAD bigger (42 around the default 32), so it is easier to see
// and to touch. A window too short for the column shrinks the vertical ones.
const H_ICON = iconPx(DEFAULT_ICON_STEP.horizontal);
const V_PAD = 10;
const V_BUTTON = iconPx(DEFAULT_ICON_STEP.vertical) + V_PAD;
const V_MIN = 26;

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
  /* The horizontal glyph size; setLauncherIconSteps overrides it inline. */
  --ns-i: ${H_ICON}px;
  position: fixed; right: 16px; bottom: 16px; z-index: 2147482000;
  display: flex; align-items: center; gap: 2px;
  height: calc(var(--ns-i) + 14px); padding: 0 3px; margin: 0;
  border: 1px solid rgba(0,0,0,.15); border-radius: calc(var(--ns-i) / 2 + 7px);
  background: #fff; color: #1f6feb;
  font: 600 12px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  box-shadow: 0 2px 8px rgba(0,0,0,.18);
  transition: box-shadow .12s ease, transform .12s ease;
}
.${CLASS}:hover { box-shadow: 0 4px 14px rgba(0,0,0,.24); transform: translateY(-1px); }

.${CLASS}-fav, .${CLASS}-dailies, .${CLASS}-foodclub, .${CLASS}-sw, .${CLASS}-ssw, .${CLASS}-quests,
.${CLASS}-magma, .${CLASS}-inv, .${CLASS}-settings, .${CLASS}-toggle {
  display: flex; align-items: center; justify-content: center;
  width: calc(var(--ns-i) + 6px); height: calc(var(--ns-i) + 6px); padding: 0;
  border: 0; background: transparent; color: inherit; font: inherit;
  border-radius: calc(var(--ns-i) / 2 + 3px); cursor: pointer;
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

/* Every button's glyph is the same --ns-i square, whatever it is drawn from. */
.${CLASS}-glyph {
  display: block;
  width: var(--ns-i); height: var(--ns-i); flex: 0 0 auto;
  background: center / contain no-repeat;
}
.${CLASS}-sw .${CLASS}-glyph { background-image: url("${SW_ICON}"); }
.${CLASS}-ssw .${CLASS}-glyph { background-image: url("${SSW_ICON}"); }

/* The Super Shop Wizard is Premium-only, so its button is too. */
.${CLASS}[data-premium="0"] .${CLASS}-ssw { display: none; }
/* Icon-set glyphs are drawn at the same --ns-i square as the artwork ones. */
.${CLASS}-fav svg, .${CLASS}-dailies svg, .${CLASS}-foodclub svg, .${CLASS}-quests svg,
.${CLASS}-magma svg, .${CLASS}-inv svg, .${CLASS}-settings svg, .${CLASS}-toggle svg {
  width: var(--ns-i); height: var(--ns-i); display: block; fill: currentColor;
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

/* Any button can be dragged along the bar into a new place. touch-action keeps a
   finger's drag from scrolling the page instead. The one being carried is tinted,
   and doubled class so it outranks the pressed look. */
.${CLASS} > button:not(.${CLASS}-toggle), .${CLASS} > a { touch-action: none; }
.${CLASS}[data-reordering="1"] { user-select: none; cursor: grabbing; }
.${CLASS}.${CLASS} > [data-reordering="1"] {
  background: rgba(31,111,235,.22); box-shadow: inset 0 0 0 1px rgba(31,111,235,.55); cursor: grabbing;
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
  width: 14px; height: calc(var(--ns-i) + 6px); flex: 0 0 auto;
  margin-right: -2px;
  cursor: grab; opacity: .4;
  touch-action: none;
}
.${CLASS}[data-draggable="1"] .${CLASS}-grip { display: flex; }
.${CLASS}-grip:hover { opacity: .75; }
.${CLASS}[data-dragging="1"] .${CLASS}-grip { cursor: grabbing; opacity: .75; }
.${CLASS}-grip svg {
  width: calc(var(--ns-i) * 4 / 5); height: calc(var(--ns-i) * 4 / 5); display: block; fill: currentColor;
}

/* Collapsed: only the handle and the arrow stay, so the bar can be tucked away.
   The notice is left alone because a Magma Pool time must still reach you.
   Folding is animated, so it cannot be display: none — the buttons narrow to
   nothing and fade, cancelling the bar's gap as they go, and only then turn
   hidden, which is what takes them out of the tab order. Expanding runs it
   backwards, visible first. Buttons the Premium and Magma rules above hide are
   still display: none, and simply stay that way. */
.${CLASS} > :not(.${CLASS}-grip):not(.${CLASS}-toggle):not(.${CLASS}-notice) {
  max-width: calc(var(--ns-i) + 20px);
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

/* Vertical: a column docked flush against the left or right edge of the window
   (data-side), at the height it was left. The caret sits on top, so folding the
   buttons away leaves it exactly where it was, and folded, the caret is all
   that shows — the grip goes too. Every button is --ns-v square, bigger than
   the horizontal ones unless the window is too short for that. While it is
   being dragged it has no side, and follows the pointer freely. */
.${CLASS}[data-vertical="1"] {
  --ns-v: ${V_BUTTON}px;
  flex-direction: column; width: auto; height: auto; padding: 3px; bottom: auto;
  border-radius: calc(var(--ns-v) / 2 + 3px);
}
.${CLASS}[data-vertical="1"]:hover { transform: none; }
.${CLASS}[data-vertical="1"][data-side="right"] {
  left: auto; right: 0; border-right: 0;
  border-top-right-radius: 0; border-bottom-right-radius: 0;
}
.${CLASS}[data-vertical="1"][data-side="left"] {
  left: 0; right: auto; border-left: 0;
  border-top-left-radius: 0; border-bottom-left-radius: 0;
}
.${CLASS}[data-vertical="1"] > button, .${CLASS}[data-vertical="1"] > a {
  width: var(--ns-v); height: var(--ns-v); border-radius: calc(var(--ns-v) / 2);
}
.${CLASS}[data-vertical="1"] > * > svg, .${CLASS}[data-vertical="1"] .${CLASS}-glyph {
  width: calc(var(--ns-v) - 10px); height: calc(var(--ns-v) - 10px);
}
.${CLASS}[data-vertical="1"] .${CLASS}-toggle { order: -2; }
.${CLASS}[data-vertical="1"] .${CLASS}-grip {
  order: -1; width: var(--ns-v); height: calc(var(--ns-v) / 2); margin-right: 0;
}
.${CLASS}[data-vertical="1"] .${CLASS}-grip svg {
  width: calc(var(--ns-v) * 6 / 13); height: calc(var(--ns-v) * 6 / 13);
}
.${CLASS}[data-vertical="1"] .${CLASS}-count {
  top: 0; right: 0; min-width: 16px; height: 16px; padding: 0 4px;
  border-radius: 8px; font-size: 10px; line-height: 16px;
}
/* The fold, turned on its side: heights instead of widths. */
.${CLASS}[data-vertical="1"] > :not(.${CLASS}-toggle):not(.${CLASS}-notice) {
  max-width: none; max-height: calc(var(--ns-v) + 4px); margin-right: 0;
  transition: max-height .2s ease, margin-bottom .2s ease, opacity .15s ease, visibility 0s linear 0s;
}
.${CLASS}[data-vertical="1"][data-collapsed="1"] > :not(.${CLASS}-toggle):not(.${CLASS}-notice) {
  max-width: none; max-height: 0; margin-right: 0; margin-bottom: -2px;
  opacity: 0; overflow: hidden; visibility: hidden; pointer-events: none;
  transition: max-height .2s ease, margin-bottom .2s ease, opacity .15s ease, visibility 0s linear .2s;
}
/* A notice goes beside a docked bar, on the side facing into the window. */
.${CLASS}[data-vertical="1"] .${CLASS}-notice { top: 0; bottom: auto; right: calc(100% + 8px); }
.${CLASS}[data-vertical="1"][data-side="left"] .${CLASS}-notice { right: auto; left: calc(100% + 8px); }

/* Until the settings say which way up the bar goes and where, it is laid out
   but not shown, so a vertical bar does not flash up as a horizontal one. */
.${CLASS}[data-settling="1"] { visibility: hidden; }
.${CLASS}[data-settling="1"], .${CLASS}[data-settling="1"] > * { transition: none !important; }
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
// Collapsed is in-memory only: every page load starts with a horizontal bar
// showing and a vertical one tucked away behind its caret.
let collapsed = false;
// Vertical docks the bar against a side of the window; `side` is which.
let vertical = false;
let side = 'right';
// Set by addLauncher, so the caret and grip can be redrawn when the layout turns.
let showCollapsed = () => {};
let gripPath = null;
let settleTimer = null;
// Where a docked caret sat before its buttons came out, so folding them away
// puts it back even if the column had to be pulled up to fit.
let dockedY = null;
// The glyph size the horizontal bar draws, and the button size a vertical one
// aims for before fitting the window — from the icon-size settings.
let hIcon = H_ICON;
let vButton = V_BUTTON;
// The buttons that drag into a new order, against the id the saved order (the
// synced `launcherOrder` setting) knows each by, and who saves a new one.
const orderIds = new Map();
let reorderHandler = null;

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

/** Flush against one side of the window, `y` from the top. */
function dock(y, toSide) {
  side = toSide === 'left' ? 'left' : 'right';
  button.dataset.side = side;
  button.style.left = '';
  button.style.top = `${y}px`;
  button.dataset.moved = '1';
  showCollapsed();
}

/** Whichever side of the window a bar at `x` is nearer to. */
function nearestSide(x, width) {
  return x + width / 2 < window.innerWidth / 2 ? 'left' : 'right';
}

/**
 * Back to where the bar starts: the bottom-right corner the stylesheet puts a
 * horizontal bar in, or the right edge with the caret halfway down.
 */
function unplace() {
  if (vertical) {
    const { height } = size();
    const caret = button.querySelector(`.${CLASS}-toggle`)?.offsetHeight || vButton;
    dock(clamp({ x: 0, y: window.innerHeight / 2 - caret / 2 }, { width: 0, height }).y, 'right');
    return;
  }
  button.style.left = '';
  button.style.top = '';
  delete button.dataset.moved;
  delete button.dataset.side;
}

/** Keeps a moved bar inside the window, without saving anything. */
function reclamp() {
  if (!button?.dataset.moved) return;
  const pos = clamp(position(), size());
  if (vertical) dock(pos.y, side);
  else place(pos);
}

/**
 * Sizes a vertical bar's buttons: the size its icon-size setting asks for, or as
 * big as still fits the column in the window. The grip counts as half a button.
 */
function fitVertical() {
  if (!button) return;
  if (!vertical) {
    button.style.removeProperty('--ns-v');
    return;
  }
  const shown = [...button.children].filter((el) => el !== notice && getComputedStyle(el).display !== 'none');
  const units = shown.reduce((n, el) => n + (el.classList.contains(`${CLASS}-grip`) ? 0.5 : 1), 0);
  // The margin clamp keeps either end, the bar's padding and border, and the gaps.
  const room = window.innerHeight - 16 - 8 - 2 * Math.max(0, shown.length - 1);
  const fit = Math.floor(room / Math.max(units, 1));
  button.style.setProperty('--ns-v', `${Math.max(V_MIN, Math.min(vButton, fit))}px`);
}

/** Hides the bar until `done` settles, so a layout change is not seen half-made. */
function settle() {
  if (!button) return;
  button.dataset.settling = '1';
  clearTimeout(settleTimer);
  // Settings that never arrive must not leave the bar invisible for good.
  settleTimer = setTimeout(unsettle, 1500);
}

function unsettle() {
  clearTimeout(settleTimer);
  if (!button?.dataset.settling) return;
  // Two frames: one to lay out without transitions, one to turn them back on.
  requestAnimationFrame(() => requestAnimationFrame(() => { delete button.dataset.settling; }));
}

/**
 * Where the bar sits, leaving out the hover lift. The pointer is over the bar
 * whenever its arrow is clicked or its grip picked up, and a measured rect
 * includes that transform, so clamping from one crept the bar up a pixel each
 * time. offsetLeft/Top ignore transforms and, for a fixed element, are
 * measured from the viewport.
 */
function position() {
  // A docked bar has only its top inline; its left comes from the side it is on.
  return {
    x: button.style.left ? parseFloat(button.style.left) : button.offsetLeft,
    y: button.style.top ? parseFloat(button.style.top) : button.offsetTop,
  };
}

function size() {
  const rect = button.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}

async function restorePosition() {
  if (!button) return;
  const saved = draggable ? await readPosition(LAUNCHER) : null;
  dockedY = null;
  fitVertical();
  if (!saved) unplace();
  else if (vertical) dock(clamp(saved, size()).y, nearestSide(saved.x, size().width));
  else {
    delete button.dataset.side;
    place(clamp(saved, size()));
  }
  unsettle();
}

function onPointerDown(event) {
  // Left button only, and only when the feature is on.
  if (!draggable || event.button !== 0) return;

  startDrag(event, {
    origin: position(),
    onMove: (pos) => {
      button.dataset.dragging = '1';
      // Undocked while it moves, so it can be carried across to the other side.
      delete button.dataset.side;
      place(clamp(pos, size()));
    },
    onEnd: ({ moved, x, y }) => {
      delete button.dataset.dragging;
      if (!moved) return;
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 0);
      const final = clamp({ x, y }, size());
      if (vertical) {
        // Snap to the nearer side. Saved as that edge's x, so turning the bar
        // back to horizontal leaves it on the same side.
        const { width } = size();
        const toSide = nearestSide(final.x, width);
        dock(final.y, toSide);
        dockedY = null;
        const edge = document.documentElement.clientWidth || window.innerWidth;
        writePosition(LAUNCHER, { x: toSide === 'left' ? 0 : edge - width, y: final.y });
        return;
      }
      place(final);
      writePosition(LAUNCHER, final);
    },
  });
}

/** The bar's buttons in the order they sit now, by id. */
function currentOrder() {
  return [...button.children].map((el) => orderIds.get(el)).filter(Boolean);
}

/**
 * Carries one bar button past its neighbours, along the bar whichever way up it
 * is. Always on. No pointer capture, unlike the grip: the click that ends a
 * gesture must land where it otherwise would, so a Ctrl-click on a link still
 * opens a new tab. It only becomes a drag past the threshold, and the click
 * after a drag is swallowed.
 */
function onButtonPointerDown(event) {
  if (event.button !== 0 || !event.isPrimary) return;
  const el = event.currentTarget;
  const startX = event.clientX;
  const startY = event.clientY;
  let moving = false;

  const centre = (o) => {
    const r = o.getBoundingClientRect();
    return vertical ? r.top + r.height / 2 : r.left + r.width / 2;
  };

  const move = (e) => {
    if (e.pointerId !== event.pointerId) return;
    if (!moving) {
      if (Math.abs(e.clientX - startX) < DRAG_THRESHOLD && Math.abs(e.clientY - startY) < DRAG_THRESHOLD) return;
      moving = true;
      el.dataset.reordering = '1';
      button.dataset.reordering = '1';
    }
    e.preventDefault();
    // Only buttons that are showing: a hidden SSW or Magma Pool button keeps its
    // place in the order but is not somewhere to drop.
    const others = [...button.children].filter((o) => o !== el && orderIds.has(o) && o.offsetParent !== null);
    if (!others.length) return;
    const along = vertical ? e.clientY : e.clientX;
    const before = others.find((o) => along < centre(o));
    // Past the last one: just after it, which is still ahead of the arrow.
    const target = before ?? others[others.length - 1].nextElementSibling;
    if (!target || target === el || el.nextElementSibling === target) return;
    button.insertBefore(el, target);
  };

  const end = (e) => {
    if (e.pointerId !== event.pointerId) return;
    document.removeEventListener('pointermove', move, true);
    document.removeEventListener('pointerup', end, true);
    document.removeEventListener('pointercancel', end, true);
    if (!moving) return;
    delete el.dataset.reordering;
    delete button.dataset.reordering;
    suppressClick = true;
    setTimeout(() => { suppressClick = false; }, 0);
    reorderHandler?.(currentOrder());
  };

  document.addEventListener('pointermove', move, { capture: true, passive: false });
  document.addEventListener('pointerup', end, true);
  document.addEventListener('pointercancel', end, true);
}

/** Puts the buttons in a saved order, repaired against the buttons this build has. */
export function setLauncherOrder(saved) {
  if (!button) return;
  const toggle = button.querySelector(`.${CLASS}-toggle`);
  const byId = new Map([...orderIds].map(([el, id]) => [id, el]));
  for (const id of fullOrder(saved, LAUNCHER_BUTTONS)) {
    const el = byId.get(id);
    if (el) button.insertBefore(el, toggle);
  }
}

/** Who saves the order once a button has been dragged somewhere new: `fn(order)`. */
export function onLauncherReorder(fn) {
  reorderHandler = fn;
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

/**
 * Stands the bar on its side, docked against the nearer edge of the window with
 * its buttons tucked away behind the caret — or lays it back down, showing.
 * `restore: false` leaves placing it to a setLauncherDraggable call that follows,
 * which is how the page load avoids reading the position twice.
 */
export function setLauncherVertical(on, { restore = true } = {}) {
  const next = !!on;
  if (!button) { vertical = next; return; }
  if (next === vertical && (button.dataset.vertical === '1') === next) {
    if (restore) restorePosition();
    return;
  }
  settle();
  vertical = next;
  if (vertical) button.dataset.vertical = '1';
  else delete button.dataset.vertical;
  collapsed = vertical;
  gripPath?.setAttribute('d', vertical ? mdiDragHorizontal : mdiDragVertical);
  fitVertical();
  showCollapsed();
  if (restore) restorePosition();
}

/**
 * The icon sizes, as steps from the `launcherIconStep` (horizontal) and
 * `verticalIconStep` settings. Applied straight away, and kept on screen.
 */
export function setLauncherIconSteps({ horizontal, vertical: verticalStep } = {}) {
  hIcon = iconPx(cleanIconStep(horizontal, DEFAULT_ICON_STEP.horizontal));
  vButton = iconPx(cleanIconStep(verticalStep, DEFAULT_ICON_STEP.vertical)) + V_PAD;
  if (!button) return;
  button.style.setProperty('--ns-i', `${hIcon}px`);
  fitVertical();
  reclamp();
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
  // Settings read before the bar existed.
  button.style.setProperty('--ns-i', `${hIcon}px`);

  // First in the row, so the whole bar can be picked up from its edge without
  // going anywhere near a button that does something.
  const grip = document.createElement('span');
  grip.className = `${CLASS}-grip`;
  grip.title = 'Drag to move the bar';
  grip.setAttribute('aria-hidden', 'true');
  const gripGlyph = glyph(vertical ? mdiDragHorizontal : mdiDragVertical, false);
  gripPath = gripGlyph.path;
  grip.append(gripGlyph.svg);

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

  // The Magma Pool: a real link to the pool, so a Ctrl- or middle-click opens
  // it in a new tab. A plain click is the checker's, which opens the `magma`
  // view (the check log) — so it is marked pressed like the view buttons.
  magma = document.createElement('a');
  magma.className = `${CLASS}-magma`;
  magma.href = MAGMA_POOL_URL;
  magma.title = 'Magma Pool';
  magma.setAttribute('aria-label', magma.title);
  magma.setAttribute('aria-pressed', 'false');
  viewButtons.set('magma', magma);
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
  // A click that ends a drag of this button must not follow the link.
  inv.addEventListener('click', (event) => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopPropagation();
  });

  const settings = viewButton('settings', `${CLASS}-settings`, 'Settings', mdiCog);

  // Far right, and not a view: it hides every other button, never the panel.
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = `${CLASS}-toggle`;
  const toggleGlyph = glyph(mdiChevronLeft);
  toggle.append(toggleGlyph.svg);
  // Horizontal: left while the buttons show, right once they are folded away.
  // Docked: into the window to bring them out, towards the edge to put them away.
  showCollapsed = () => {
    if (collapsed) button.dataset.collapsed = '1';
    else delete button.dataset.collapsed;
    const pointsRight = vertical && side === 'right' ? !collapsed : collapsed;
    toggleGlyph.path.setAttribute('d', pointsRight ? mdiChevronRight : mdiChevronLeft);
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
    if (vertical && !collapsed) dockedY = position().y;
    if (vertical && collapsed && dockedY !== null) {
      const back = dockedY;
      dockedY = null;
      setTimeout(() => { if (vertical && collapsed) dock(clamp({ x: 0, y: back }, size()).y, side); }, FOLD_MS + 20);
    }
    // A moved bar grows rightwards from its left edge, so expanding near the
    // edge could push it off-screen. Clamp it, but do not save: nothing moved.
    // Only once the buttons have finished unfolding — measured any sooner, the
    // bar is still narrow and the clamp would let it end up past the edge.
    // A docked bar grows downwards from its caret in the same way.
    if (!collapsed && button.dataset.moved) {
      setTimeout(() => { if (!collapsed) reclamp(); }, FOLD_MS + 20);
    }
  });

  button.append(grip, fav, dailies, foodclub, sw, ssw, quests, magma, inv, settings, toggle);
  showCollapsed();

  // Only the grip moves the bar. The buttons drag too, but only into a new order,
  // and without a pointer capture — which is what leaves their clicks, and the
  // links' Ctrl-click and middle-click, working: a capture retargets the click
  // that ends a gesture to whatever element took it.
  grip.addEventListener('pointerdown', onPointerDown);
  for (const [el, id] of [
    [fav, 'favourites'], [dailies, 'dailies'], [foodclub, 'foodclub'], [sw, 'wiz'], [ssw, 'ssw'],
    [quests, 'quests'], [magma, 'magma'], [inv, 'inventory'], [settings, 'settings'],
  ]) {
    orderIds.set(el, id);
    el.addEventListener('pointerdown', onButtonPointerDown);
  }
  // Links would otherwise start the browser's own drag, which cancels the pointer.
  magma.draggable = false;
  inv.draggable = false;
  button.addEventListener('dragstart', (event) => event.preventDefault());

  // A window that has since been made narrower must not strand the button
  // off-screen, since it is the only way back to the panel.
  window.addEventListener('resize', () => {
    fitVertical();
    reclamp();
  });

  // Shown once the settings have placed it (see settle).
  settle();
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
  if (!button) return;
  button.dataset.premium = on ? '1' : '0';
  // One button more or fewer changes what a docked column has room for.
  if (vertical) { fitVertical(); reclamp(); }
}

/**
 * The Magma Pool button's state: 'off' hides it, 'idle' shows the volcano,
 * 'loading' spins, 'found' is a checkmark. `title` says why, on hover.
 */
export function setMagmaState(state, title = 'Magma Pool') {
  if (!button || !magma) return;
  const shownBefore = button.dataset.magma && button.dataset.magma !== 'off';
  button.dataset.magma = state;
  if (vertical && shownBefore !== (state !== 'off')) { fitVertical(); reclamp(); }
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
