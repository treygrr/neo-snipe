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

// The Super Shop Wizard is deliberately absent here. It has no page you can
// link to with a query — it is a JSON endpoint, so it lives in the Shops tab
// (src/lib/ssw.js) where its results can actually be shown.
export const searchesFor = (name) => SEARCHES.map((s) => ({ ...s, href: s.url(name) }));
