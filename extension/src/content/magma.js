// The Magma Pool checker. Plain DOM and storage only: it runs on every Neopets
// page, so nothing here may import Vue.
//
// Each account's guard naps for ten minutes at the same NST time every day.
// While checking is on and this account has no time yet, the pool page is
// loaded every ten minutes — one clock shared by every open Neopets tab — until
// a load finds it open, and that minute is saved for the account.
import { api, readSettings, writeSettings } from '../lib/ext-api.js';
import { DEFAULTS } from '../lib/messages.js';
import {
  MAGMA_POOL_URL, MAGMA_CHECK_MS, ACCOUNT_URL,
  readPoolState, readAccountName, poolTimeAt, cleanPoolTimes,
} from '../lib/magma.js';
import { setMagmaState, onMagmaClick, showLauncherNotice } from './launcher.js';

// When any tab last loaded the pool page, so ten minutes means ten minutes
// however many tabs are open.
const LAST_CHECK = 'magmaLastCheck';
// The logged-in account, kept briefly so each page load does not also load
// the settings page. Read by the settings view too.
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

/**
 * Who is logged in, or null. `fresh` skips the cache: a time is only ever
 * saved against a name read just now, so switching accounts cannot file one
 * account's time under another.
 */
async function currentAccount({ fresh = false } = {}) {
  if (!fresh) {
    const { [ACCOUNT]: cached } = await api.storage.local.get(ACCOUNT).catch(() => ({}));
    if (cached && Date.now() - cached.at < ACCOUNT_TTL_MS) return cached.name ?? null;
  }
  const doc = here() === ACCOUNT_URL ? document : await fetchDoc(ACCOUNT_URL);
  const name = readAccountName(doc);
  await api.storage.local.set({ [ACCOUNT]: { name, at: Date.now() } }).catch(() => {});
  return name;
}

async function lastCheck() {
  const { [LAST_CHECK]: at = 0 } = await api.storage.local.get(LAST_CHECK).catch(() => ({}));
  return Number(at) || 0;
}

export function startMagmaPool() {
  let busy = false;

  /** Puts the bar's button in the state storage says it is in. */
  async function render() {
    const { enabled, times } = await readPoolSettings();
    if (!enabled) return setMagmaState('off');
    if (busy) return undefined;

    const account = await currentAccount().catch(() => null);
    if (!account) return setMagmaState('idle', 'Magma Pool — log in to Neopets to start checking');
    if (times[account]) {
      return setMagmaState('found', `Magma Pool — ${account}'s guard naps at ${times[account]} NST daily. Go to the pool.`);
    }

    const wait = await lastCheck() + MAGMA_CHECK_MS - Date.now();
    return setMagmaState('idle', wait > 0
      ? `Magma Pool — closed at the last check. Next check in ${minutesUntil(wait)}m.`
      : 'Magma Pool — checking shortly.');
  }

  /**
   * One check, if one is due: 'off', 'no-account', 'found' (already known),
   * 'not-due', 'open' or 'closed'.
   */
  async function check() {
    if (busy) return 'busy';
    const { enabled, times } = await readPoolSettings();
    if (!enabled) { await render(); return 'off'; }

    const account = await currentAccount().catch(() => null);
    if (!account) { await render(); return 'no-account'; }
    if (times[account]) { await render(); return 'found'; }

    const onPool = here() === MAGMA_POOL_URL;
    // Being on the pool page is a check already paid for, so it is always due.
    if (!onPool && Date.now() - await lastCheck() < MAGMA_CHECK_MS) { await render(); return 'not-due'; }

    busy = true;
    // Claimed before the load, so a tab ticking a moment later sees it taken.
    await api.storage.local.set({ [LAST_CHECK]: Date.now() }).catch(() => {});
    setMagmaState('loading', 'Checking the Magma Pool…');

    let result = 'closed';
    try {
      const doc = onPool ? document : await fetchDoc(MAGMA_POOL_URL);
      if (readPoolState(doc.body?.textContent) === 'open') {
        const confirmed = await currentAccount({ fresh: true });
        if (confirmed) {
          const time = poolTimeAt();
          // A fresh read and a new object: the stored map may have gained
          // another account's time since this check began.
          const latest = (await readPoolSettings()).times;
          await writeSettings({ magmaPoolTimes: { ...latest, [confirmed]: time } });
          showLauncherNotice(
            `The Magma Pool is open for ${confirmed}! The guard naps at ${time} NST every day.`,
            { href: MAGMA_POOL_URL, label: 'Go to the pool', ms: 30_000 },
          );
          result = 'open';
        }
      }
    } catch {
      // Offline, or logged out mid-check: the next tick simply tries again.
    } finally {
      busy = false;
    }
    await render();
    return result;
  }

  // Found: the button is a plain link to the pool, so let it be one. Otherwise a
  // click asks for a check now, which still has to wait for the ten minutes.
  onMagmaClick(async (event, state) => {
    if (state === 'found') return;
    event.preventDefault();
    if (state === 'loading') return;
    const result = await check();
    if (result === 'not-due') {
      const wait = await lastCheck() + MAGMA_CHECK_MS - Date.now();
      showLauncherNotice(`The Magma Pool can be checked every 10 minutes. Next check in ${minutesUntil(wait)}m.`);
    } else if (result === 'no-account') {
      showLauncherNotice('Log in to Neopets so the Magma Pool can be checked for your account.');
    } else if (result === 'closed') {
      showLauncherNotice('The guard is awake. Checking again in 10 minutes.');
    }
  });

  const tick = () => { check().catch(() => {}); };

  // The settings toggle, a Forget, or another tab finding the time all arrive
  // here, so every open tab's button agrees without reloading.
  // Without onChanged the 30-second tick still catches up, only more slowly.
  api.storage.onChanged?.addListener((changes) => {
    if ('magmaPoolCheck' in changes || 'magmaPoolTimes' in changes) tick();
  });

  tick();
  setInterval(tick, TICK_MS);
}
