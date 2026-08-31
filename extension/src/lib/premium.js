// Working out whether the account has Neopets Premium.
//
// The site nav carries premium entries only for subscribers: links to
// /premium/…, the Super Shop Wizard icon, and a premium widget. Verified on one
// account before and after subscribing — the same page went from zero
// /premium/ links to nine, on inventory, the shop wizard and the safety
// deposit box alike.
//
// Deliberately not done by probing the SSW endpoint. That is also a reliable
// signal ("Access denied." without Premium) but it spends a request on every
// check, and reading the nav costs nothing.

const PREMIUM_LINK = 'a[href^="/premium/"], a[href*="neopets.com/premium/"]';
const PREMIUM_WIDGET = '[class*="ssw-icon"], [class*="ssw-char"], [class*="premium-widget"]';
// Pages render the site nav; without it, absence of premium links proves nothing.
const NAV = '[class*="nav-"], nav, #navprofile';

/**
 * @returns {boolean|null} true/false when the page carries the nav, null when
 *   it does not — an unknown, which callers must not read as "no premium".
 */
export function detectPremium(doc = document) {
  if (!doc?.querySelector) return null;
  if (!doc.querySelector(NAV)) return null;

  return Boolean(doc.querySelector(PREMIUM_LINK) || doc.querySelector(PREMIUM_WIDGET));
}
