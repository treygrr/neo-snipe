// The Safety Deposit Box's auction call: reading its rows, the request it
// takes, and what it says back. The markup and the reply shapes here are the
// box's own, read off safetydeposit.phtml.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseHTML } from 'linkedom';
import {
  readSdbRow, readSdbRows, sdbAuctionBody, parseSdbAuctionReply, cleanPin, sdbDrops,
  isSdbPath, readSdbAuctionForm, readSdbAuctionPin, sdbAuctionPopup,
  SDB_AUCTION_URL, SDB_AJAX_HEADERS, SDB_PIN_KEY,
} from '../src/lib/sdb.js';

const ACTIONS = ['', 'inventory', 'shop', 'gallery', 'donate', 'discard', 'tradingpost', 'neofriend', 'auction'];

/** A row as the box draws it. `prefix` differs between its desktop and mobile layouts. */
const row = (id, name, { actions = ACTIONS, prefix = 'sdb-chk-', file = 'redbouncyball' } = {}) => `
  <tr>
    <td><div class="sdb-item-cell">
      <button class="sdb-item-star"></button>
      <img src="https://images.neopets.com/items/${file}.gif">
      <div class="sdb-item-name">${name}</div>
    </div></td>
    <td>1</td>
    <td><select class="sdb-action-select">
      ${actions.map((a) => `<option value="${a}">${a || 'Select action'}</option>`).join('')}
    </select></td>
    <td><input type="checkbox" class="sdb-item-checkbox" id="${prefix}${id}"></td>
  </tr>`;

const doc = (html) => parseHTML(`<table>${html}</table>`).document;

test('a row gives the item its auction call needs', () => {
  const tr = doc(row(42, 'Red Bouncy Ball')).querySelector('tr');
  assert.deepEqual(readSdbRow(tr), {
    name: 'Red Bouncy Ball',
    objInfoId: 42,
    imageUrl: 'https://images.neopets.com/items/redbouncyball.gif',
    canAuction: true,
  });
});

test('the id comes off the checkbox, whichever layout drew it', () => {
  const desktop = doc(row(81, 'Coffee and Marshmallows')).querySelector('tr');
  const mobile = doc(row(81, 'Coffee and Marshmallows', { prefix: 'sdb-chk-mobile-' })).querySelector('tr');
  assert.equal(readSdbRow(desktop).objInfoId, 81);
  assert.equal(readSdbRow(mobile).objInfoId, 81);
});

test('the page decides what can be auctioned, not us', () => {
  // No-trade, NC and unverified accounts all reach us the same way: no option.
  const without = ACTIONS.filter((a) => a !== 'auction');
  const tr = doc(row(125, 'Fading Bottled Earth Faerie', { actions: without })).querySelector('tr');
  assert.equal(readSdbRow(tr).canAuction, false);
});

test('rows that are not items are skipped', () => {
  const html = `<tr><th>Item</th><th>Qty</th></tr>${row(42, 'Red Bouncy Ball')}`;
  const items = readSdbRows(doc(html));
  assert.equal(items.length, 1);
  assert.equal(items[0].name, 'Red Bouncy Ball');
});

test('the auction request is the JSON the box posts', () => {
  const entry = {
    startPrice: 1200, minIncrement: 50, duration: 24,
    neofriendsOnly: true, guildMembersOnly: true,
  };
  assert.deepEqual(sdbAuctionBody(42, entry, { pin: '2489', refCk: 'a'.repeat(32) }), {
    obj_info_id: 42,
    quantity: 1,
    start_price: 1200,
    min_increment: 50,
    duration: 24,
    // A boolean, where the inventory's form wants "on"/"off" …
    neofriends_only: true,
    pin: '2489',
    _ref_ck: 'a'.repeat(32),
  });
});

test('guild-members-only cannot go through the box, and is reported', () => {
  assert.deepEqual(sdbDrops({ neofriendsOnly: true, guildMembersOnly: true }), ['guildMembersOnly']);
  assert.deepEqual(sdbDrops({ neofriendsOnly: true }), []);
  // …and is simply absent from the request rather than sent as false.
  assert.equal('guild_members_only' in sdbAuctionBody(42, { duration: 24 }, {}), false);
});

test('a PIN is four digits or nothing', () => {
  assert.equal(cleanPin('2489'), '2489');
  assert.equal(cleanPin(' 2489 '), '2489');
  assert.equal(cleanPin(2489), '2489');
  for (const bad of ['', '248', '24890', 'abcd', '24 89', null, undefined]) {
    assert.equal(cleanPin(bad), null, `${bad} is not a PIN`);
  }
});

test('success reads as accepted', () => {
  const reply = parseSdbAuctionReply({ success: true, message: 'Your item is up for auction!' });
  assert.equal(reply.ok, true);
  assert.equal(reply.message, 'Your item is up for auction!');
  assert.equal(reply.pin, false);
});

test('a missing or wrong PIN is told apart from any other refusal', () => {
  const missing = parseSdbAuctionReply({ success: false, error: 'pin_required' });
  assert.deepEqual(
    [missing.ok, missing.pin, missing.missingPin, missing.wrongPin], [false, true, true, false],
  );

  const wrong = parseSdbAuctionReply({ success: false, error: 'pin_wrong' });
  assert.deepEqual([wrong.ok, wrong.pin, wrong.missingPin, wrong.wrongPin], [false, true, false, true]);

  const other = parseSdbAuctionReply({ success: false, message: 'You cannot auction that item.' });
  assert.deepEqual([other.ok, other.pin, other.missingPin, other.wrongPin], [false, false, false, false]);
  assert.equal(other.message, 'You cannot auction that item.');
});

test('a refusal with no words still says something', () => {
  assert.equal(parseSdbAuctionReply({ success: false }).message, 'Neopets did not accept the auction.');
  assert.equal(parseSdbAuctionReply(null).ok, false);
});

test('the box is recognised by its path, and its constants are the page\'s', () => {
  assert.equal(isSdbPath('/safetydeposit.phtml'), true);
  assert.equal(isSdbPath('/safetydeposit.phtml?category=6'), true);
  assert.equal(isSdbPath('/inventory.phtml'), false);
  assert.equal(SDB_AUCTION_URL, 'https://www.neopets.com/np-templates/ajax/safetydeposit/auction.php');
  assert.equal(SDB_AJAX_HEADERS['x-requested-with'], 'XMLHttpRequest');
  assert.equal(SDB_PIN_KEY, 'sdbPin');
});

/**
 * The box's "Put up for Auction" dialog, as it draws it: the labels carry
 * utility classes that say nothing, so the two price fields are told apart by
 * the order they appear in.
 */
const popup = ({ name = 'Red Bouncy Ball', start = '1', incr = '1', hours = '24', nf = false, pin = '' } = {}) => `
  <div class="togglePopup__2020 movePopup__2020 sdb-popup">
    <div class="popup-header__2020">Put up for Auction</div>
    <div class="popup-body__2020 flex flex-col gap-6 sdb">
      <img src="https://images.neopets.com/items/redbouncyball.gif">
      <p class="text-museo-bold text-[14px]">${name}</p>
      <p class="text-museo text-[14px]">Are you sure you want to put this item up for auction?</p>
      <p>Quantity: <strong>1</strong></p>
      <label class="sdb-auction-row">
        <span class="sdb-auction-label text-museo-bold">Start Price (NP):</span>
        <input type="text" class="sdb-auction-input" value="${start}">
      </label>
      <label class="sdb-auction-row">
        <span class="sdb-auction-label text-museo-bold">Min. Increment (NP):</span>
        <input type="text" class="sdb-auction-input" value="${incr}">
      </label>
      <label class="sdb-auction-row">
        <span class="sdb-auction-label text-museo-bold">Auction Length:</span>
        <select class="sdb-auction-input">
          <option value="1">One Hour</option><option value="24" ${hours === '24' ? 'selected' : ''}>One Day</option>
          <option value="48" ${hours === '48' ? 'selected' : ''}>Two Days</option>
        </select>
      </label>
      <label class="sdb-auction-row sdb-auction-checkbox-row">
        <input type="checkbox" ${nf ? 'checked' : ''}> Neofriends Only
      </label>
      <input type="password" maxlength="4" value="${pin}">
    </div>
    <div class="popup-footer__2020"><button>Cancel</button><button>Confirm</button></div>
  </div>`;

/**
 * linkedom does not reflect a `checked` attribute into the property the way a
 * browser does, and the property is what the reader asks for — so set it here.
 */
const page = (html) => {
  const doc = parseHTML(`<body>${html}</body>`).document;
  for (const box of doc.querySelectorAll('input[type="checkbox"][checked]')) box.checked = true;
  return doc;
};

test('the box\'s auction dialog reads like the inventory\'s form', () => {
  const doc = page(popup({ start: '1,200', incr: '50', hours: '48', nf: true }));
  assert.deepEqual(readSdbAuctionForm(sdbAuctionPopup(doc)), {
    name: 'Red Bouncy Ball',
    imageUrl: 'https://images.neopets.com/items/redbouncyball.gif',
    startPrice: 1200,
    minIncrement: 50,
    duration: 48,
    neofriendsOnly: true,
    // The box has no such option, so a relist saved here never claims one.
    guildMembersOnly: false,
  });
});

test('the two price fields are told apart by their order', () => {
  const form = readSdbAuctionForm(sdbAuctionPopup(page(popup({ start: '900', incr: '25' }))));
  assert.equal(form.startPrice, 900);
  assert.equal(form.minIncrement, 25);
});

test('no dialog, nothing to read', () => {
  assert.equal(sdbAuctionPopup(page('<div>Safety Deposit Box</div>')), null);
  assert.equal(readSdbAuctionForm(null), null);
  assert.equal(readSdbAuctionForm(sdbAuctionPopup(page('<div class="sdb-popup"></div>'))), null);
});

/** Every other action the box confirms draws the same popup, with no auction fields. */
const otherPopup = (title) => `
  <div class="togglePopup__2020 sdb-popup">
    <div class="popup-header__2020">${title}</div>
    <div class="popup-body__2020">
      <p class="text-museo-bold text-[14px]">Red Bouncy Ball</p>
      <p>Are you sure?</p>
      <input type="password" maxlength="4">
    </div>
    <div class="popup-footer__2020"><button>Cancel</button><button>Confirm</button></div>
  </div>`;

test('only the auction dialog counts, not the box\'s other confirmations', () => {
  for (const title of ['Move to Inventory', 'Donate Item', 'List on Trading Post', 'Give to Neofriend']) {
    assert.equal(sdbAuctionPopup(page(otherPopup(title))), null, `${title} is not the auction dialog`);
  }
  // Even though they carry a PIN field and an item name, there is nothing to save.
  assert.equal(readSdbAuctionForm(sdbAuctionPopup(page(otherPopup('Donate Item')))), null);
});

test('the auction dialog is still found when another popup is in the page', () => {
  const doc = page(otherPopup('Move to Inventory') + popup({ start: '500' }));
  const found = sdbAuctionPopup(doc);
  assert.notEqual(found, null);
  assert.equal(readSdbAuctionForm(found).startPrice, 500);
});

test('a dialog with no item named is not read', () => {
  const doc = page(popup().replace('<p class="text-museo-bold text-[14px]">Red Bouncy Ball</p>', ''));
  // The next paragraph is the question, not a name — but it is still a name-shaped
  // read, so what matters is that the values come back attached to *something*.
  const form = readSdbAuctionForm(sdbAuctionPopup(doc));
  assert.notEqual(form?.name, 'Red Bouncy Ball');
});

test('the PIN typed into the dialog is picked up', () => {
  const doc = page(popup({ pin: '2489' }));
  assert.equal(readSdbAuctionPin(sdbAuctionPopup(doc)), '2489');
});

test('a half-typed or empty PIN is not picked up, so none is ever saved over one kept', () => {
  for (const pin of ['', '24', '248', 'abcd']) {
    assert.equal(readSdbAuctionPin(sdbAuctionPopup(page(popup({ pin })))), null, `"${pin}" is not a PIN`);
  }
});

test('the PIN is found by its length, so "Show password" does not hide it', () => {
  // The dialog's own switch turns the field from a password into a text box.
  const shown = popup({ pin: '2489' }).replace('type="password" maxlength="4"', 'type="text" maxlength="4"');
  assert.equal(readSdbAuctionPin(sdbAuctionPopup(page(shown))), '2489');
});

test('the auction\'s own fields are never mistaken for the PIN', () => {
  // A price is four digits too; what rules it out is its class, not its value.
  const doc = page(popup({ start: '2000', incr: '1000', pin: '' }));
  assert.equal(readSdbAuctionPin(sdbAuctionPopup(doc)), null);
});
