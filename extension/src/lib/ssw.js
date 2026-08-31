// The Super Shop Wizard.
//
// It is not a page you can link to with a query — it is a JSON endpoint the
// SSW interface calls. The parameters and the response shape here are taken
// from a real request and response, saved in test/fixtures/ssw/.
//
// Premium only. There is no reliable way to know that in advance, so the
// endpoint's own `error` field is what tells us.

const ENDPOINT = 'https://www.neopets.com/np-templates/views/shops/ssw/ssw_query.php';

export class SswError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SswError';
  }
}

/** `cb` is a cache-buster; the real UI sends a changing number. */
export function sswQueryUrl(name, { exact = true, cb = Math.floor(Math.random() * 1e6) } = {}) {
  const params = new URLSearchParams({
    q: String(name ?? '').trim(),
    caller: 'h5',
    priceOnly: '0',
    context: '0',
    partial: exact ? '0' : '1',
    min_price: '',
    max_price: '',
    lang: 'en',
    json: '1',
    cb: String(cb),
  });
  return `${ENDPOINT}?${params}`;
}

// href='/browseshop.phtml?owner=x&buy_obj_info_id=7460&buy_cost_neopoints=6750'
const HREF = /href=['"]([^'"]+)['"]/i;

/**
 * The response carries parallel arrays — owners, amounts, prices, price_str,
 * links — already sorted cheapest first, plus a per-row anchor that links
 * straight into that shop with the item selected.
 */
export function parseSswResponse(json) {
  const data = json?.data;
  if (!data) throw new SswError('The Super Shop Wizard returned something unexpected.');

  // How the endpoint reports a refusal, including not having Premium.
  if (data.error) throw new SswError(String(data.error));

  const rows = Math.min(
    data.owners?.length ?? 0,
    data.prices?.length ?? 0,
    data.links?.length ?? 0,
  );

  const listings = [];
  for (let i = 0; i < rows; i++) {
    const href = (data.links[i]?.match(HREF) || [])[1];
    listings.push({
      owner: data.owners[i],
      price: Number(data.prices[i]),
      priceText: data.price_str?.[i] ?? `${Number(data.prices[i]).toLocaleString('en-US')} NP`,
      amount: Number(data.amounts?.[i] ?? 0) || null,
      // Relative in the response; the popover needs it absolute.
      href: href ? new URL(href, 'https://www.neopets.com').href : null,
    });
  }

  return {
    itemName: json.req?.item_name ?? null,
    // Neopets' own item id, straight from Neopets — not to be confused with a
    // Jelly Neo item id, which is a different numbering scheme entirely.
    neopetsItemId: json.req?.oii ?? null,
    rowCount: data.rowcount ?? listings.length,
    listings,
  };
}
