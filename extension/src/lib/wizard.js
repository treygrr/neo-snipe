// The regular Shop Wizard.
//
// Like the Super Shop Wizard it is an endpoint rather than a linkable page,
// but it answers with an HTML fragment rather than JSON. Request fields and
// response markup both come from real traffic, saved in test/fixtures/wizard/.
//
// Searches are rate-limited by Neopets, so this is only ever called when
// someone opens the tab, and results are cached rather than re-fetched.

export const WIZARD_URL = 'https://www.neopets.com/np-templates/ajax/wizard.php';

export class WizardError extends Error {
  constructor(message) {
    super(message);
    this.name = 'WizardError';
  }
}

/**
 * The site posts every field twice — once plain, once under
 * `resubmit_values[...]`, which is how it carries a search forward.
 */
export function wizardBody(name) {
  const values = [
    ['type', 'process_wizard'],
    ['feedset', '0'],
    ['shopwizard', String(name ?? '').trim()],
    ['table', ''],
    ['criteria', 'exact'],
    ['min_price', '1'],
    ['max_price', '999999'],
  ];
  const body = new URLSearchParams();
  for (const [k, v] of values) body.append(`resubmit_values[${k}]`, v);
  for (const [k, v] of values) body.append(k, v);
  return body;
}

// Wording Neopets uses when it will not run the search.
const LIMIT = /too many searches|slow down|wait a (?:little|few)|try again in/i;
const NOTHING = /no shops|did not find|found no|no results/i;

/**
 * @param {Document} doc parsed response fragment
 * Returns listings cheapest first — the response is already in that order.
 */
export function parseWizardResponse(doc) {
  const text = doc.body?.textContent || '';

  if (LIMIT.test(text)) {
    throw new WizardError('The Shop Wizard is asking you to slow down. Try again shortly.');
  }

  const listings = [...doc.querySelectorAll('li')]
    .filter((li) => li.querySelector('a[href*="browseshop.phtml"]'))
    .map((li) => {
      const link = li.querySelector('a[href*="browseshop.phtml"]');
      const href = link.getAttribute('href');
      const priceText = li.querySelector('.wizard-results-price')?.textContent?.trim() || '';
      return {
        owner: link.textContent.trim(),
        priceText,
        price: Number(priceText.replace(/[^\d]/g, '')) || null,
        amount: Number(li.querySelector('p')?.textContent?.trim()) || null,
        href: href ? new URL(href, 'https://www.neopets.com').href : null,
      };
    })
    .filter((l) => l.owner && l.price !== null);

  if (!listings.length && !NOTHING.test(text)) {
    // Neither results nor a message we recognise: say so rather than showing
    // an empty list as though nothing were for sale.
    throw new WizardError("Could not read the Shop Wizard's reply — its layout may have changed.");
  }

  const heading = [...doc.querySelectorAll('h3')]
    .map((h) => h.textContent.trim())
    .find((t) => t && !/^(shop owner|stock|price)$/i.test(t));

  return {
    itemName: heading || null,
    listings,
  };
}
