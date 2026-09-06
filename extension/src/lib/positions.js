// Where you last left the panel and the launcher button.
//
// storage.local, deliberately, where the settings themselves are sync: a
// position that suits a 27" monitor is off-screen on a laptop, and syncing
// would have two machines overwrite each other's every time you dragged
// anything. This is device state, so it stays on the device.
import { api } from './ext-api.js';

const KEY = 'positions';

export const PANEL = 'panel';
export const LAUNCHER = 'launcher';

const valid = (pos) => pos && Number.isFinite(pos.x) && Number.isFinite(pos.y);

async function readAll() {
  try {
    const stored = (await api.storage.local.get(KEY))[KEY];
    return stored && typeof stored === 'object' ? stored : {};
  } catch {
    return {};
  }
}

/** `{ x, y }` in viewport pixels from the top left, or null if never moved. */
export async function readPosition(name) {
  const pos = (await readAll())[name];
  return valid(pos) ? { x: pos.x, y: pos.y } : null;
}

export async function writePosition(name, { x, y }) {
  const all = await readAll();
  try {
    await api.storage.local.set({ [KEY]: { ...all, [name]: { x: Math.round(x), y: Math.round(y) } } });
  } catch { /* not worth surfacing */ }
}

/** Forgetting a position is what puts the thing back where it started. */
export async function clearPosition(name) {
  const all = await readAll();
  delete all[name];
  try {
    await api.storage.local.set({ [KEY]: all });
  } catch { /* as above */ }
}

/**
 * Keeps a remembered position reachable. A window narrower than the one the
 * position was saved on would otherwise leave the panel — or worse, the button
 * that opens it — entirely off-screen with no way back.
 */
export function clamp({ x, y }, { width, height }, margin = 8) {
  const maxX = Math.max(margin, window.innerWidth - width - margin);
  const maxY = Math.max(margin, window.innerHeight - height - margin);
  return {
    x: Math.min(Math.max(x, margin), maxX),
    y: Math.min(Math.max(y, margin), maxY),
  };
}

/**
 * Shared pointer-drag behaviour for the panel and the launcher.
 *
 * `onMove` is handed the clamped position as the pointer moves and `onEnd`
 * the final one, so the caller decides what to paint and what to persist.
 *
 * Two details earn their keep. Pointer capture means a fast drag that outruns
 * the cursor still tracks — the launcher's own events would otherwise stop the
 * moment the pointer left the button, and inside the popover's shadow host,
 * which sets `pointer-events: none`, there is nothing underneath to catch
 * them. And nothing moves until the pointer has travelled past a threshold, so
 * an ordinary click is still an ordinary click; `moved` lets the caller
 * swallow the click that a real drag ends with.
 */
export const DRAG_THRESHOLD = 4;

export function startDrag(event, { origin, onMove, onEnd }) {
  const startX = event.clientX;
  const startY = event.clientY;
  const target = event.currentTarget;
  let moved = false;

  const move = (e) => {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (!moved && Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
    moved = true;
    e.preventDefault();
    onMove({ x: origin.x + dx, y: origin.y + dy });
  };

  const up = (e) => {
    target.removeEventListener('pointermove', move);
    target.removeEventListener('pointerup', up);
    target.removeEventListener('pointercancel', up);
    try { target.releasePointerCapture(e.pointerId); } catch { /* already gone */ }
    onEnd({ moved, x: origin.x + (e.clientX - startX), y: origin.y + (e.clientY - startY) });
  };

  try { target.setPointerCapture(event.pointerId); } catch { /* fall back to bubbling */ }
  target.addEventListener('pointermove', move);
  target.addEventListener('pointerup', up);
  target.addEventListener('pointercancel', up);
}
