// The Magma Pool checker. Plain DOM and storage only: it runs on every Neopets
// page, so nothing here may import Vue.
//
// Each account's guard naps for ten minutes at the same NST time every day.
// While checking is on and this account has no time yet, the pool page is
// loaded every ten minutes — one clock shared by every open Neopets tab — until
// a load finds it open, and that minute is saved for the account. Every load is
// written to the check log, which the bar's button opens.
import { api, readSettings, writeSettings } from '../lib/ext-api.js';
import { DEFAULTS } from '../lib/messages.js';
import {
  MAGMA_POOL_URL, MAGMA_CHECK_MS, ACCOUNT_URL, MAGMA_LOG,
  readPoolDetail, readAccountName, isAccountPage, poolTimeAt, cleanPoolTimes,
  excerptOf, withLogEntry,
} from '../lib/magma.js';
import { setMagmaState, onMagmaClick, showLauncherNotice } from './launcher.js';

// When any tab last loaded the pool page, so ten minutes means ten minutes
// however many tabs are open.
const LAST_CHECK = 'magmaLastCheck';
// The logged-in account, as last read from the settings page. Read by the
// settings view too.
export const ACCOUNT = 'magmaAccount';
const ACCOUNT_TTL_MS = MAGMA_CHECK_MS;
// Only asks storage whether a check is due; the check itself is ten minutes apart.
const TICK_MS = 30_000;

const minutesUntil = (ms) => Math.max(1, Math.ceil(ms / 60_000));

async function readPoolSettings() {
  const s = await readSettings({
    magmaPoolCheck: DEFAULTS.magmaPoolCheck,
    magmaPoolTimes: DEFAULTS.magmaPoolTimes,
  });
  return { enabled: s.magmaPoolCheck === true, times: cleanPoolTimes(s.magmaPoolTimes) };
}

async function fetchDoc(url) {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error(`Neopets returned ${res.status}.`);
  return new DOMParser().parseFromString(await res.text(), 'text/html');
}

const here = () => location.origin + location.pathname;

// What to quote from a page nothing on which was recognised: its content area
// where it has one, so the excerpt is not the site's menu.
const quotable = (doc) => doc.querySelector?.('.content, #content') ?? doc.body;

async function appendLog(entry) {
  const { [MAGMA_LOG]: log } = await api.storage.local.get(MAGMA_LOG).catch(() => ({}));
  await api.storage.local.set({ [MAGMA_LOG]: withLogEntry(log, entry) }).catch(() => {});
}

/**
 * Who is logged in, or null. `fresh` goes to the settings page rather than the
 * cache, which is what happens when checking starts on a page, when a click
 * asks to try again, and before a time is saved — so a stale or failed read
 * never lingers, and switching accounts cannot file one account's time under
 * another. Ticks in between use the name that read left behind.
 */
async function currentAccount({ fresh = false } = {}) {
  if (!fresh) {
    const { [ACCOUNT]: cached } = await api.storage.local.get(ACCOUNT).catch(() => ({}));
    if (cached && Date.now() - cached.at < ACCOUNT_TTL_MS) return cached.name ?? null;
  }
  const doc = isAccountPage(here()) ? document : await fetchDoc(ACCOUNT_URL);
  const name = readAccountName(doc);
  await api.storage.local.set({ [ACCOUNT]: { name, at: Date.now() } }).catch(() => {});
  return name;
}

async function lastCheck() {
  const { [LAST_CHECK]: at = 0 } = await api.storage.local.get(LAST_CHECK).catch(() => ({}));
  return Number(at) || 0;
}

/** `openLog()` shows the check log in the panel; run.js supplies it. */
export function startMagmaPool({ openLog = null } = {}) {
  let busy = false;
  // Whether this page has put the button on the bar yet — see check().
  let placed = false;

  /** Puts the bar's button in the state storage says it is in. */
  async function render() {
    const { enabled, times } = await readPoolSettings();
    if (!enabled) return setMagmaState('off');
    if (busy) return undefined;

    const account = await currentAccount().catch(() => null);
    if (!account) return setMagmaState('idle', 'Magma Pool — log in to Neopets to start checking');
    if (times[account]) {
      return setMagmaState('found', `Magma Pool — ${account}'s guard naps at ${times[account]} NST daily. Click for the check log.`);
    }

    const wait = await lastCheck() + MAGMA_CHECK_MS - Date.now();
    return setMagmaState('idle', wait > 0
      ? `Magma Pool — closed at the last check. Next check in ${minutesUntil(wait)}m.`
      : 'Magma Pool — checking shortly.');
  }

  /**
   * One check, if one is due: 'off', 'no-account', 'found' (already known),
   * 'not-due', 'busy', or what the load found — 'open', 'closed', 'unknown'
   * (unreadable, or open for an account that could not be confirmed) or
   * 'error'. `freshAccount` re-reads who is logged in from the settings page
   * first. `trigger` is what asked, for the log: 'start', 'timer', 'click' or
   * 'settings'.
   */
  async function check({ freshAccount = false, trigger = 'timer' } = {}) {
    if (busy) return 'busy';
    const { enabled, times } = await readPoolSettings();
    if (!enabled) { await render(); return 'off'; }

    // Switched on means on the bar, straight away. Everything below waits on
    // the account page, and a button that only popped in once that had loaded
    // looked like the bar was still settling. It starts in the state the last
    // known account had, so a found time shows its checkmark from the first
    // moment rather than a volcano that does nothing when clicked. Once per
    // page: later checks would otherwise flash that state while they run.
    if (!placed && !busy) {
      const { [ACCOUNT]: known } = await api.storage.local.get(ACCOUNT).catch(() => ({}));
      if (known?.name && times[known.name]) {
        setMagmaState('found', `Magma Pool — ${known.name}'s guard naps at ${times[known.name]} NST daily. Click for the check log.`);
      } else {
        setMagmaState('idle', 'Magma Pool — checking your account…');
      }
    }
    placed = true;

    const account = await currentAccount({ fresh: freshAccount }).catch(() => null);
    if (!account) { await render(); return 'no-account'; }
    if (times[account]) { await render(); return 'found'; }

    const onPool = here() === MAGMA_POOL_URL;
    // Being on the pool page is a check already paid for, so it is always due.
    if (!onPool && Date.now() - await lastCheck() < MAGMA_CHECK_MS) { await render(); return 'not-due'; }

    busy = true;
    const at = Date.now();
    // Claimed before the load, so a tab ticking a moment later sees it taken.
    await api.storage.local.set({ [LAST_CHECK]: at }).catch(() => {});
    setMagmaState('loading', 'Checking the Magma Pool…');

    const entry = {
      at,
      nst: poolTimeAt(at),
      trigger: onPool ? 'pool-page' : trigger,
      account,
      result: 'unknown',
      matched: null,
      excerpt: null,
      saved: null,
      note: null,
    };
    try {
      const doc = onPool ? document : await fetchDoc(MAGMA_POOL_URL);
      const text = doc.body?.textContent ?? '';
      const { state: seen, matched } = readPoolDetail(text);
      entry.result = seen;
      entry.matched = matched;
      entry.excerpt = excerptOf(matched ? text : quotable(doc)?.textContent, matched) || null;
      if (seen === 'open') {
        const confirmed = await currentAccount({ fresh: true });
        if (confirmed) {
          const time = poolTimeAt();
          // A fresh read and a new object: the stored map may have gained
          // another account's time since this check began.
          const latest = (await readPoolSettings()).times;
          await writeSettings({ magmaPoolTimes: { ...latest, [confirmed]: time } });
          entry.account = confirmed;
          entry.saved = time;
          showLauncherNotice(
            `The Magma Pool is open for ${confirmed}! The guard naps at ${time} NST every day.`,
            { href: MAGMA_POOL_URL, label: 'Go to the pool', ms: 30_000 },
          );
        } else {
          entry.note = 'Not saved: could not confirm which account is logged in.';
        }
      }
    } catch (err) {
      // Offline, or logged out mid-check: the next tick simply tries again.
      entry.result = 'error';
      entry.note = err?.message || String(err);
    } finally {
      busy = false;
    }
    await appendLog(entry);
    await render();
    if (entry.result === 'open' && !entry.saved) return 'unknown';
    return entry.result;
  }

  // A click opens the log of every check. Unless the time is already found, it
  // also asks for a check now — which still has to wait for the ten minutes —
  // and reads who is logged in again in case the last read failed. A click
  // that closes the log only closes it. Ctrl-, Cmd- and Shift-clicks are left
  // to the link, so the pool can still be opened in a new tab from here.
  onMagmaClick(async (event, state) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey) return;
    event.preventDefault();
    const closing = event.currentTarget?.getAttribute('aria-pressed') === 'true';
    Promise.resolve(openLog?.()).catch((err) => console.error('[neo-snipe] Magma Pool log failed', err));
    if (closing || state === 'found' || state === 'loading') return;

    const result = await check({ freshAccount: true, trigger: 'click' });
    if (result === 'not-due') {
      const wait = await lastCheck() + MAGMA_CHECK_MS - Date.now();
      showLauncherNotice(`The Magma Pool can be checked every 10 minutes. Next check in ${minutesUntil(wait)}m.`);
    } else if (result === 'no-account') {
      showLauncherNotice('Log in to Neopets so the Magma Pool can be checked for your account.');
    } else if (result === 'closed') {
      showLauncherNotice('The guard is awake. Checking again in 10 minutes.');
    } else if (result === 'unknown' || result === 'error') {
      showLauncherNotice('Could not tell whether the pool is open. The log shows what the page said.');
    }
  });

  const tick = (options) => { check(options).catch(() => {}); };

  // The settings toggle, a Forget, or another tab finding the time all arrive
  // here, so every open tab's button agrees without reloading. Checking being
  // switched on is a start like any other, so it reads the account afresh.
  // Without onChanged the 30-second tick still catches up, only more slowly.
  api.storage.onChanged?.addListener((changes) => {
    const switchedOn = changes.magmaPoolCheck?.newValue === true;
    if (switchedOn || 'magmaPoolCheck' in changes || 'magmaPoolTimes' in changes) {
      tick({ freshAccount: switchedOn, trigger: 'settings' });
    }
  });

  // Starting on a page: read who is logged in from the settings page, not the
  // cache, then carry on ticking from what that read left behind.
  tick({ freshAccount: true, trigger: 'start' });
  setInterval(tick, TICK_MS);
}
