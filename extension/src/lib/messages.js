import { readSettings } from './ext-api.js';

export const LOOKUP = 'neosnipe:lookup';
export const TP_LOOKUP = 'neosnipe:trading-post';

export const DEFAULTS = {
  hoverOnly: true,
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
};
