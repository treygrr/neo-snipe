import { readSettings } from './ext-api.js';
import { POPOVER_TABS, LAUNCHER_BUTTONS } from './tab-order.js';
import { DEFAULT_ICON_STEP } from './launcher-size.js';

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
  // Drag the bar by its handle. It remembers where it was left; turning this off
  // puts it back in its corner without forgetting the position. The panel's
  // title bar and the popover's tabs always drag, so they have no switch.
  movableLauncher: true,
  // Stand the bar on its side, docked against the nearer edge of the window with
  // bigger buttons, and tucked away behind a caret until that is pressed.
  verticalLauncher: false,
  // How big the bar's icons are, as a step: 1 is 20px and each step to 5 adds
  // 4px. The horizontal and vertical bars keep their own, starting at the sizes
  // they had before this could be changed.
  launcherIconStep: DEFAULT_ICON_STEP.horizontal,
  verticalIconStep: DEFAULT_ICON_STEP.vertical,
  // The 🔍 badge on each item, in the same five steps: 1 is 16px, 5 is 32px.
  badgeIconStep: DEFAULT_ICON_STEP.badge,
  // Reopen an item's popover on the tab you were last on, rather than on
  // whichever tab sits first in the order.
  rememberPopoverTab: false,
  // Look for this account's Magma Pool window every ten minutes while a Neopets
  // page is open, with its button on the bar. Off by default: it loads a page.
  magmaPoolCheck: false,
  // Each account's pool time once found, as NST "HH:MM", keyed by lowercased
  // username. Kept, and exported, whether or not checking is switched on.
  // Always replaced, never mutated: this default object is shared.
  magmaPoolTimes: {},
  // Put the day's cached Jelly Neo prices and trading post histories in an
  // export, so another browser starts with them. Off: they bloat the file.
  exportIncludeCache: false,
  // The price popover's tabs, and the bar's buttons, in the order you dragged
  // them into. Each covers everything this build knows about, including
  // whatever is hidden right now.
  popoverTabOrder: POPOVER_TABS,
  launcherOrder: LAUNCHER_BUTTONS,
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
