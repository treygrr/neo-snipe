import { findItemElements, describeItem, MARK } from './detect.js';
import { addBadge, setBadgeState } from './badge.js';
import { addLauncher, setLauncherOpen } from './launcher.js';
import { applyPendingBet, onBetPage } from './foodclub-fill.js';
import { getSettings } from '../lib/messages.js';

/**
 * Shared content-script body. `loadUi` differs per browser: Chrome imports the
 * Vue bundle on demand, Safari has it bundled in already (Safari cannot
 * dynamically import an extension resource).
 */
export function run(loadUi) {
  let uiPromise = null;
  function ui() {
    if (!uiPromise) {
      uiPromise = (async () => {
        const { mount, store } = await loadUi();
        await mount.mountPopover();
        // Keep the launcher in step when the panel closes itself.
        store.watchPanel(setLauncherOpen);
        // So the heart reflects saved state the first time a popover opens.
        await store.loadFavourites();
        return store;
      })();
    }
    return uiPromise;
  }

  async function openPanel() {
    const store = await ui();
    store.togglePanel();
  }

  async function activate(btn, item) {
    setBadgeState(btn, 'loading');
    try {
      const store = await ui();
      await store.openFor(btn, item);
      setBadgeState(btn, store.state.error ? 'error' : null);
    } catch (err) {
      console.error('[neo-snipe] failed to open popover', err);
      setBadgeState(btn, 'error');
    }
  }

  function scan(root = document) {
    for (const el of findItemElements(root)) {
      const item = describeItem(el);
      // Mark unnamed items too, so we don't re-examine them on every mutation.
      if (!item) { el.dataset[MARK] = 'skip'; continue; }
      addBadge(el, item, activate);
    }
  }

  // Neopets loads inventory and quickstock contents after the initial render.
  let pending = null;
  const observer = new MutationObserver(() => {
    if (pending) return;
    pending = setTimeout(() => { pending = null; scan(); }, 150);
  });

  // Diagnostic marker: lets you confirm from devtools that the content script ran.
  document.documentElement.dataset.neosnipe = 'active';

  // One body-level attribute drives the hover-only rule for every badge.
  getSettings().then(({ hoverOnly }) => {
    if (hoverOnly) document.body.dataset.neosnipeHoverOnly = '';
    else delete document.body.dataset.neosnipeHoverOnly;
  });

  addLauncher(() => { openPanel().catch((err) => console.error('[neo-snipe] panel failed', err)); });

  // If the panel sent us here to place a bet, fill the form (never submit it).
  if (onBetPage()) {
    applyPendingBet().catch((err) => console.error('[neo-snipe] could not fill the bet', err));
  }

  scan();
  observer.observe(document.body, { childList: true, subtree: true });
}
