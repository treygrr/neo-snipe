import { readSettings } from './ext-api.js';

export const LOOKUP = 'neosnipe:lookup';
export const TP_LOOKUP = 'neosnipe:trading-post';

export const DEFAULTS = {
  backendUrl: 'http://127.0.0.1:8787',
  token: '',
  hoverOnly: true,
};

export async function getSettings() {
  return readSettings(DEFAULTS);
}

/** Human-readable text for each error code the service worker can return. */
export const ERROR_TEXT = {
  backend_down: 'Cannot reach the neo-snipe server. Is it running?',
  unauthorized: 'The server rejected the token. Check the extension options.',
  not_found: 'No matching item on Jelly Neo.',
  timeout: 'The lookup took too long.',
  scrape_failed: "Jelly Neo's layout changed — the scraper needs updating.",
  no_token: 'Set your server token in the extension options first.',
  no_item_id: 'No Jelly Neo item id, so trading post history is unavailable.',
  internal: 'The server hit an unexpected error.',
};
