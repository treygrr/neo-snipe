import { readSettings } from './ext-api.js';
import { PANEL_TABS, POPOVER_TABS } from './tab-order.js';

export const LOOKUP = 'neosnipe:lookup';
export const TP_LOOKUP = 'neosnipe:trading-post';
// The content script announces itself so the toolbar button can be enabled for
// that tab only — which avoids asking for the broad "tabs" permission just to
// find out what page a tab is on.
export const HELLO = 'neosnipe:hello';
export const OPEN_PANEL = 'neosnipe:open-panel';

export const DEFAULTS = {
  hoverOnly: true,
  // Read the nav to work out whether the account has Premium. On by default;
  // turn it off to say so by hand with `premium` below.
  premiumAuto: true,
  // Only consulted when premiumAuto is off.
  premium: false,
  // What a shop item has to beat Jelly Neo's estimate by before the popover
  // calls it worth buying.
  minMargin: 1000,
  // Tick off dailies as you visit them, cleared at midnight Neopets time.
  trackDailyVisits: true,
  // How long a search result is reused for the same item before the tab will
  // spend another search on it, in minutes. Zero searches afresh every time.
  // Separate figures because the two wizards behave differently: the regular
  // one returns a partial list that repeated searches fill in, the Super Shop
  // Wizard a complete one in a single call.
  wizCacheMinutes: 15,
  sswCacheMinutes: 15,
  // Drag the panel by its title bar, and the launcher button by itself. Each
  // remembers where it was left; turning one off puts that one back in its
  // default corner without forgetting the position.
  movablePanel: true,
  movableLauncher: true,
  // Drag the tabs in either bar to reorder them. The stored order covers every
  // tab this build knows about, including any hidden right now.
  movableTabs: true,
  // Reopen an item's popover on the tab you were last on, rather than on
  // whichever tab sits first in the order.
  rememberPopoverTab: false,
  panelTabOrder: PANEL_TABS,
  popoverTabOrder: POPOVER_TABS,
};

export async function getSettings() {
  return readSettings(DEFAULTS);
}

/** Human-readable text for each error code the service worker can return. */
export const ERROR_TEXT = {
  offline: 'Could not reach Jelly Neo. Check your connection.',
  not_found: 'No matching item on Jelly Neo.',
  scrape_failed: "Jelly Neo's layout changed — the parser needs updating.",
  no_item_id: 'No Jelly Neo item id, so trading post history is unavailable.',
  internal: 'Something went wrong looking this up.',
  disconnected: 'The lookup was interrupted — try again, it should be quick now.',
  no_permission: 'Access to Jelly Neo has not been granted yet — open the extension options to allow it.',
};
