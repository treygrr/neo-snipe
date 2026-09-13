// The Purchase an Item quest, between the panel's Shop button and your clicks.
// Plain DOM and storage only — it runs on every Neopets page.
//
// The panel picks a random shop with stock and its cheapest item, saves that as
// the plan, and opens the shop. On that shop's page this marks the item; on the
// haggle page it fills in the asking price and puts the cursor on Haggle!; once
// the item is yours it counts the buy and offers the next shop.
//
// It never clicks to buy. The confirmation is guarded by Cloudflare Turnstile,
// and a purchase is yours to make.
import { api } from '../lib/ext-api.js';
import {
  SHOPPING_KEY, shopIdOf, shopUrl, readShopStock, cheapestItem, isSoldOut, readHaggle,
  isLivePlan, findShopWithStock,
} from '../lib/shops.js';
import { QUEST_READY_KEY } from '../lib/questlog.js';
import { showLauncherNotice } from './launcher.js';

const CLASS = 'neosnipe-shop';

const CSS = `
.${CLASS}-target {
  position: relative;
  outline: 3px solid #2e7d32 !important; outline-offset: 4px; border-radius: 8px;
}
.${CLASS}-label {
  position: absolute; left: 50%; top: -30px; transform: translateX(-50%); z-index: 5;
  white-space: nowrap; padding: 5px 9px; border-radius: 10px;
  background: #2e7d32; color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,.25);
  font: 600 11px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  pointer-events: none;
}
.${CLASS}-offer { outline: 3px solid #2e7d32 !important; outline-offset: 2px; }
`;

async function readPlan() {
  const { [SHOPPING_KEY]: plan } = await api.storage.local.get(SHOPPING_KEY).catch(() => ({}));
  return isLivePlan(plan) ? plan : null;
}
const savePlan = (plan) => api.storage.local.set({ [SHOPPING_KEY]: plan }).catch(() => {});
const clearPlan = () => api.storage.local.remove(SHOPPING_KEY).catch(() => {});

async function fetchDoc(url) {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error(`Neopets returned ${res.status}.`);
  return new DOMParser().parseFromString(await res.text(), 'text/html');
}

const np = (n) => `${Number(n).toLocaleString('en-US')} NP`;
const buyNumber = (plan) => plan.total - plan.remaining + 1;

function addStyle() {
  if (document.querySelector('style[data-neosnipe="shopping"]')) return;
  const style = document.createElement('style');
  style.dataset.neosnipe = 'shopping';
  style.textContent = CSS;
  document.head.appendChild(style);
}

/** Picks the next shop and offers it as a link: going there is still your click. */
async function offerNextShop(plan, lead) {
  const next = await findShopWithStock(fetchDoc, { exclude: [plan.shopId] }).catch(() => null);
  if (!next) {
    showLauncherNotice(`${lead} Every shop tried just now was sold out — press Shop in the Quest Log to look again.`,
      { ms: 30_000 });
    return;
  }
  const nextPlan = { ...plan, ...next, at: Date.now() };
  await savePlan(nextPlan);
  showLauncherNotice(`${lead} Next: ${next.item.name} for ${np(next.item.price)} at ${next.shopName}.`,
    { href: shopUrl(next.shopId), label: `Go to ${next.shopName}`, ms: 60_000 });
}

/** On the planned shop's page: mark the item to click, or find another shop. */
async function onShop(plan) {
  if (shopIdOf(location.href) !== plan.shopId) return;

  const stock = readShopStock(document);
  // The planned item if it is still here; otherwise whatever is cheapest now.
  const target = stock.find((i) => i.stockId === plan.item.stockId) ?? cheapestItem(stock);
  if (!target || isSoldOut(document)) {
    await offerNextShop(plan, `${plan.shopName} sold out before you got here.`);
    return;
  }
  if (target.stockId !== plan.item.stockId) await savePlan({ ...plan, item: target, at: Date.now() });

  const card = [...document.querySelectorAll('form[name="items_for_sale"] .shop-item')]
    .find((c) => (c.querySelector('.item-img')?.getAttribute('data-link') ?? '').includes(`stock_id=${target.stockId}`));
  if (!card) return;

  addStyle();
  card.classList.add(`${CLASS}-target`);
  const label = document.createElement('div');
  label.className = `${CLASS}-label`;
  label.textContent = `Cheapest here · buy ${buyNumber(plan)} of ${plan.total}`;
  card.append(label);
  card.scrollIntoView({ block: 'center' });
  showLauncherNotice(`Click ${target.name} (${np(target.price)}), then Yes, to buy it.`, { ms: 20_000 });
}

/** On a haggle page: fill in the asking price, or count a buy that went through. */
async function onHaggle(plan) {
  const haggle = readHaggle(document);

  if (haggle.paid != null) {
    // Reloading the accepted page must not count the same buy twice.
    const receipt = `${haggle.added || haggle.itemName}|${haggle.paid}`;
    if (plan.lastReceipt === receipt && Date.now() - (plan.lastReceiptAt ?? 0) < 5 * 60_000) return;

    const remaining = plan.remaining - 1;
    const lead = `Bought ${haggle.added || haggle.itemName} for ${np(haggle.paid)} (${plan.total - remaining} of ${plan.total}).`;
    // The quest count is stale now; the next page reads it afresh.
    await api.storage.local.remove(QUEST_READY_KEY).catch(() => {});
    if (remaining <= 0) {
      await clearPlan();
      showLauncherNotice(`${lead} That's the Purchase an Item quest done — claim it in the Quest Log.`, { ms: 30_000 });
      return;
    }
    await offerNextShop({ ...plan, remaining, lastReceipt: receipt, lastReceiptAt: Date.now() }, lead);
    return;
  }

  const offer = document.querySelector('input[name="current_offer"]');
  if (!offer || haggle.askingPrice == null) return;
  if (plan.item.objInfoId && new URL(location.href).searchParams.get('obj_info_id') !== plan.item.objInfoId) return;

  addStyle();
  offer.value = String(haggle.askingPrice);
  offer.dispatchEvent(new Event('input', { bubbles: true }));
  offer.classList.add(`${CLASS}-offer`);
  const submit = offer.form?.querySelector('input[type="submit"], button[type="submit"], button');
  (submit ?? offer).focus();
  showLauncherNotice(`Offer filled in at the asking price, ${np(haggle.askingPrice)}. Press Haggle! to buy.`, { ms: 20_000 });
}

export function startShopping() {
  const path = location.pathname;
  if (path !== '/objects.phtml' && path !== '/haggle.phtml') return;
  readPlan()
    .then((plan) => {
      if (!plan) return undefined;
      return path === '/haggle.phtml' ? onHaggle(plan) : onShop(plan);
    })
    .catch((err) => console.error('[neo-snipe] shopping helper failed', err));
}
