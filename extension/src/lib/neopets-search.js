// Where to look an item up on Neopets.
//
// These URL shapes are taken verbatim from the "Find This Item" links on a
// Jelly Neo item page, not written from memory — the same discipline as the
// rest of this codebase, and for the same reason.
const base = 'https://www.neopets.com';
const q = (name) => encodeURIComponent(String(name ?? '').trim()).replace(/%20/g, '+');

export const SEARCHES = [
  {
    id: 'wizard',
    label: 'Shop Wiz',
    title: 'Search the Shop Wizard',
    url: (name) => `${base}/shops/wizard.phtml?string=${q(name)}`,
  },
  {
    id: 'trading',
    label: 'Trades',
    title: 'Search the Trading Post for this exact item',
    url: (name) =>
      `${base}/island/tradingpost.phtml?type=browse&criteria=item_exact&sort_by=newest&search_string=${q(name)}`,
  },
  {
    id: 'auctions',
    label: 'Auctions',
    title: 'Search the Auction House for this exact item',
    url: (name) => `${base}/genie.phtml?type=process_genie&criteria=exact&auctiongenie=${q(name)}`,
  },
];

/**
 * Premium only. Shown when the user has said they have Premium, because there
 * is no reliable way to detect it from a page the extension can see.
 */
export const SUPER_WIZARD = {
  id: 'super',
  label: 'Super Wiz',
  title: 'Search the Super Shop Wizard (Premium)',
  url: (name) => `${base}/shops/wizard.phtml?string=${q(name)}&type=super`,
};

export const searchesFor = (name, { premium = false } = {}) =>
  [...SEARCHES, ...(premium ? [SUPER_WIZARD] : [])]
    .map((s) => ({ ...s, href: s.url(name) }));
