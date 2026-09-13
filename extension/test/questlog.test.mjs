// The Quest Log: today's list, claiming, and the fishing and wheel runners,
// against replies captured off the live site (see fixtures/questlog/README.md).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseHTML } from 'linkedom';
import {
  parseQuestList, parseClaim, parseFishing, parseWheel, readRefCk, intervalMs,
  retrieveBody, claimBody, fishingBody, wheelBody, wheelFor, questKind, runnerFor,
  QuestLogError, RETRIEVE_URL, CLAIM_URL, FISHING_URL, WHEEL_RESULT_URL, QUESTLOG_URL,
} from '../src/lib/questlog.js';

const fixture = (f) => readFileSync(resolve('test/fixtures/questlog', f), 'utf8');
const parse = (html) => parseHTML(`<!doctype html><html>${html}</html>`).document;
const doc = (body) => parse(`<body>${body}</body>`);
const daily = (output = fixture('retrieve-daily.html')) =>
  parseQuestList({ ...JSON.parse(fixture('retrieve-daily.json')), output }, parse);

test('the endpoints are the ones captured', () => {
  assert.equal(RETRIEVE_URL, 'https://www.neopets.com/np-templates/ajax/questlog/retrieveQuests.php');
  assert.equal(CLAIM_URL, 'https://www.neopets.com/np-templates/ajax/questlog/claimRewards.php');
  assert.equal(FISHING_URL, 'https://www.neopets.com/water/fishing.phtml');
  assert.equal(WHEEL_RESULT_URL, 'https://www.neopets.com/np-templates/ajax/wheels/getResult.php');
  assert.equal(QUESTLOG_URL, 'https://www.neopets.com/questlog/');
});

test('request bodies carry exactly what the pages send', () => {
  assert.deepEqual([...retrieveBody('ck').entries()], [['_ref_ck', 'ck'], ['tab', '2']]);
  assert.deepEqual([...claimBody('ck', 352136013).entries()],
    [['_ref_ck', 'ck'], ['mode', 'quest'], ['quest', '352136013']]);
  assert.equal(fishingBody().toString(), 'go_fish=1');
  assert.equal(wheelBody(2).toString(), 'type=2&token=');
});

test("the page's token is read from its scripts or a form field", () => {
  const ck = '83cd6370c9cc26b99c9505d4cf53f5ff';
  assert.equal(readRefCk(doc(`<script>$.ajax({ data: { "_ref_ck":'${ck}' } })</script>`)), ck);
  assert.equal(readRefCk(doc(`<script>formData.append("_ref_ck", "${ck}");</script>`)), ck);
  assert.equal(readRefCk(doc(`<form><input type="hidden" name="_ref_ck" value="${ck}"></form>`)), ck);
  assert.equal(readRefCk(doc('<form action="/login.phtml"></form>')), null);
});

test("today's six quests, in the order Neopets lists them", () => {
  const { quests } = daily();
  assert.deepEqual(quests.map((q) => [q.id, q.title, q.kind]), [
    ['352136009', 'Purchase an Item', 'purchase'],
    ['352136010', 'Spin the Wheel', 'wheel'],
    ['352136011', 'Customise a Pet', 'customise'],
    ['352136014', 'Play a Game', 'game'],
    ['352136013', 'Go Fishing', 'fishing'],
    ['352136012', 'Read to a Pet', 'read'],
  ]);
});

test('each quest carries its reward, tasks and state', () => {
  const [purchase, spin, , , , read] = daily().quests;

  assert.deepEqual(purchase.reward, {
    type: 'item', label: 'Orange Tuskaninny Morphing Potion',
    image: 'https://images.neopets.com/items/pot_tuskaninny_orange.gif',
  });
  assert.deepEqual(purchase.tasks, [{ label: 'Purchase Item(s)', done: false, have: 0, need: 3 }]);
  assert.equal(purchase.icon, 'Purchase');

  assert.deepEqual(spin.reward, { type: 'np', label: '6,665 NP', amount: 6665 });
  assert.deepEqual(spin.tasks, [{ label: 'Spin the Wheel of Excitement', done: false, have: null, need: null }]);
  assert.equal(spin.complete, false);
  assert.equal(spin.claimable, false);

  // Only the Premium quest carries the flag. Finishing it did count toward the
  // bonus when captured, so the flag is shown, not used to discount anything.
  assert.equal(read.premium, true);
  assert.ok(daily().quests.filter((q) => q.id !== read.id).every((q) => !q.premium));
});

test('the bonus is counted from its markers, and the expiry from the timer', () => {
  const list = daily();
  assert.deepEqual(list.bonus, { done: 0, total: 5, claimId: null, reward: null });
  assert.equal(list.expiresInMs, (11 * 3600 + 24 * 60 + 21) * 1000);
  assert.equal(intervalMs(null), null);
});

import { claimBonusBody } from '../src/lib/questlog.js';

test('with every quest done the bonus carries its claim id and reward', () => {
  assert.deepEqual(daily(fixture('bonus-claimable.html')).bonus,
    { done: 5, total: 5, claimId: '70679736', reward: '20,000 NP' });
  assert.deepEqual([...claimBonusBody('ck', '70679736').entries()],
    [['_ref_ck', 'ck'], ['mode', 'bonus'], ['bonus', '70679736']]);
});

test('a finished quest reads as complete and claimable', () => {
  const [fishing] = daily(fixture('quest-claimable.html')).quests;
  assert.equal(fishing.title, 'Go Fishing');
  assert.equal(fishing.complete, true);
  assert.equal(fishing.claimable, true);
  // Nothing left for a runner to do.
  assert.equal(fishing.runner, null);
});

test('fishing, a named wheel and the item quests get runners; everything else gets a link', () => {
  const byTitle = Object.fromEntries(daily().quests.map((q) => [q.title, q]));

  assert.equal(byTitle['Go Fishing'].runner, 'fishing');
  assert.equal(byTitle['Go Fishing'].link, 'https://www.neopets.com/water/fishing.phtml');

  assert.equal(byTitle['Spin the Wheel'].runner, 'wheel');
  assert.deepEqual(byTitle['Spin the Wheel'].wheel && [byTitle['Spin the Wheel'].wheel.name, byTitle['Spin the Wheel'].wheel.type],
    ['Excitement', 2]);
  assert.equal(byTitle['Spin the Wheel'].link, 'https://www.neopets.com/faerieland/wheel.phtml');

  // One runner for every item quest; lib/item-use.js picks the item.
  assert.equal(byTitle['Read to a Pet'].runner, 'use');

  // Purchase gets the shopping helper, which finds the item but never buys it.
  assert.equal(byTitle['Purchase an Item'].runner, 'shop');

  // Customise adds a wearable, saves, and saves the outfit back.
  assert.equal(byTitle['Customise a Pet'].runner, 'customise');

  for (const title of ['Play a Game']) {
    assert.equal(byTitle[title].runner, null, title);
    assert.match(byTitle[title].link, /^https:\/\/www\.neopets\.com\//, title);
  }
  assert.equal(byTitle['Read to a Pet'].link, 'https://www.neopets.com/inventory.phtml');
});

test('each wheel is matched by name, and only the single-spin ones can run', () => {
  const quest = (description) => ({ title: 'Spin the Wheel', description, tasks: [], kind: 'wheel', complete: false });
  assert.equal(wheelFor(quest('Spin the Wheel of Knowledge in Meridell')).type, 1);
  assert.equal(wheelFor(quest('Spin the Wheel of Mediocrity')).type, 3);
  assert.equal(wheelFor(quest('Spin the Wheel of Misfortune')).type, 4);
  assert.equal(runnerFor(quest('Spin the Wheel of Monotony')), null);
  assert.equal(runnerFor(quest('Spin the Wheel of Extravagance')), null);
  // A quest that names no wheel cannot guess one.
  assert.equal(wheelFor(quest('Spin any wheel')), null);
  assert.equal(runnerFor(quest('Spin any wheel')), null);
});

test("the quest kinds Jelly Neo lists are told apart, however they're worded", () => {
  const kind = (title, description = '') => questKind({ title, description, tasks: [] });
  assert.equal(kind('Play With a Pet', 'Play with one of your Neopets'), 'play');
  assert.equal(kind('Play a Game', 'Play any Game or Classic Game in the Games Room'), 'game');
  assert.equal(kind('Feed a Pet'), 'feed');
  assert.equal(kind('Groom a Pet'), 'groom');
  assert.equal(kind('Fight in the Battledome'), 'battledome');
  assert.equal(kind('Check out Popular NC Items'), 'ncpopular');
  assert.equal(kind('Visit NC Mall'), 'ncmall');
  assert.equal(kind('Something new'), 'unknown');
});

test('a refused list is an error, never an empty day', () => {
  assert.throws(() => parseQuestList({ success: false, error: true, errMsg: 'Something has gone wrong!' }, parse),
    (err) => err instanceof QuestLogError && /gone wrong/.test(err.message));
  assert.throws(() => parseQuestList({ success: true, output: '<p>Maintenance</p>' }, parse), QuestLogError);
});

test('a claimed NP reward reports the amount and the new total', () => {
  assert.deepEqual(parseClaim(JSON.parse(fixture('claim-quest-np.json'))),
    { reward: 'np', np: 3286, newNp: '946,017', itemName: null, itemImage: null });
  assert.throws(() => parseClaim({ error: true, errMsg: 'You have <b>already</b> claimed this.' }),
    (err) => err instanceof QuestLogError && err.message === 'You have already claimed this.');
});

test('the fishing page says what was caught and the new skill', () => {
  assert.deepEqual(parseFishing(doc(fixture('fishing-result.html'))), {
    caught: 'Waterfish',
    image: 'https://images.neopets.com/items/vor_waterfish.gif',
    skill: 7,
  });
  assert.throws(() => parseFishing(doc('<p>You need a pet to go fishing, silly!</p>')),
    (err) => err instanceof QuestLogError && /need a pet/.test(err.message));
});

test('a wheel spin reports the prize and the NP it leaves', () => {
  assert.deepEqual(parseWheel(JSON.parse(fixture('wheel-spin-np.json'))), {
    prize: '2,500 NP',
    image: 'https://images.neopets.com/common/bag_of_np.gif',
    message: 'Wow, what a spectacular prize!',
    neopoints: 948017,
    freeSpin: true,
  });
  assert.throws(() => parseWheel({ success: false, spinResultMessage: 'Come back <b>later</b>!' }),
    (err) => err instanceof QuestLogError && err.message === 'Come back later!');
});

// --- the NC Mall quests and the ready count -----------------------------------
import { NC_POPULAR_URL, QUEST_READY_KEY, QUEST_REFRESH_MS, readyCount, questLink } from '../src/lib/questlog.js';

test('both NC Mall quests are done by visiting the popular items page', () => {
  const nc = (title) => {
    const q = { title, description: '', tasks: [], complete: false };
    q.kind = questKind(q);
    return q;
  };
  for (const title of ['Check out Popular NC Items', 'Visit NC Mall']) {
    const q = nc(title);
    assert.equal(runnerFor(q), 'visit', title);
    assert.equal(questLink(q), NC_POPULAR_URL, title);
  }
  assert.equal(NC_POPULAR_URL, 'https://ncmall.neopets.com/mall/search.phtml?type=popular_items&cat=54&page=1&limit=24');
});

test('the ready count is the quests Neopets will hand a reward for', () => {
  assert.equal(readyCount(daily().quests), 0);
  assert.equal(readyCount(daily(fixture('quest-claimable.html')).quests), 1);
  assert.equal(readyCount(undefined), 0);
  assert.equal(QUEST_READY_KEY, 'questReady');
  // Often enough to notice a finished quest, rarely enough not to lean on Neopets.
  assert.ok(QUEST_REFRESH_MS >= 5 * 60_000 && QUEST_REFRESH_MS <= 15 * 60_000);
});
