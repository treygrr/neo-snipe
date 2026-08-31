import { readSettings } from './ext-api.js';

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
  no_permission: 'Access to Jelly Neo has not been granted yet — open the extension options to allow it.',
};
