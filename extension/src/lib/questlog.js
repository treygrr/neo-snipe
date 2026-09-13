// The Quest Log: today's quests, claiming their rewards, and the few quests a
// single request can finish. Pure given a parsed document or JSON — the store
// does the fetching. Requests and replies come from real traffic, saved in
// test/fixtures/questlog/ with a README of every endpoint.
import { INVENTORY_URL } from './neopets-search.js';

const NEOPETS = 'https://www.neopets.com';
export const QUESTLOG_URL = `${NEOPETS}/questlog/`;
export const RETRIEVE_URL = `${NEOPETS}/np-templates/ajax/questlog/retrieveQuests.php`;
export const CLAIM_URL = `${NEOPETS}/np-templates/ajax/questlog/claimRewards.php`;
export const FISHING_URL = `${NEOPETS}/water/fishing.phtml`;
export const WHEEL_RESULT_URL = `${NEOPETS}/np-templates/ajax/wheels/getResult.php`;
// Visiting this page is what both NC Mall quests ask for.
export const NC_POPULAR_URL = 'https://ncmall.neopets.com/mall/search.phtml?type=popular_items&cat=54&page=1&limit=24';
const NC_MALL_URL = NC_POPULAR_URL;

// The Quest Log button's count of quests ready to claim, shared by every tab in
// storage.local, and how old it may get before a page reads the list again.
export const QUEST_READY_KEY = 'questReady';
export const QUEST_REFRESH_MS = 10 * 60_000;

/** How many quests Neopets will hand a reward for right now. */
export const readyCount = (quests) => (quests ?? []).filter((q) => q.claimable).length;

/** Which list `retrieveQuests.php` returns. */
export const DAILY_TAB = 2;

export class QuestLogError extends Error {
  constructor(message) {
    super(message);
    this.name = 'QuestLogError';
  }
}

/**
 * The per-session token Neopets checks on every quest log request. Every page
 * carries it inline (the header's own scripts post it), and some forms carry
 * it as a hidden field. Null when the page has neither — logged out.
 */
export function readRefCk(doc) {
  const field = doc?.querySelector?.('input[name="_ref_ck"]')?.getAttribute('value');
  if (/^[0-9a-f]{32}$/i.test(field ?? '')) return field;
  for (const s of doc?.querySelectorAll?.('script') ?? []) {
    const m = /_ref_ck['"]?\s*[:,]\s*['"]([0-9a-f]{32})['"]/i.exec(s.textContent ?? '');
    if (m) return m[1];
  }
  return null;
}

// FormData, as the quest log page itself posts: that is the encoding these two
// were captured working with.
export function retrieveBody(ck, tab = DAILY_TAB) {
  const body = new FormData();
  body.append('_ref_ck', ck);
  body.append('tab', String(tab));
  return body;
}

export function claimBody(ck, questId) {
  const body = new FormData();
  body.append('_ref_ck', ck);
  body.append('mode', 'quest');
  body.append('quest', String(questId));
  return body;
}

/** The fishing vortex's one-button form. */
export const fishingBody = () => new URLSearchParams({ go_fish: '1' });

/** What the wheel page's script sends; the token is only ever set on Monotony. */
export const wheelBody = (type) => new URLSearchParams({ type: String(type), token: '' });

// --- wheels ------------------------------------------------------------------

/**
 * Every wheel's page and the type its spin posts, read off each wheel's own
 * `gameoptions.js`. Only the four a quest asks for can be run from here:
 * Monotony spins for minutes behind a start token, and Extravagance costs
 * 100,000 NP behind a confirmation.
 */
export const WHEELS = [
  { name: 'Excitement', type: 2, url: `${NEOPETS}/faerieland/wheel.phtml`, runnable: true },
  { name: 'Knowledge', type: 1, url: `${NEOPETS}/medieval/knowledge.phtml`, runnable: true },
  { name: 'Mediocrity', type: 3, url: `${NEOPETS}/prehistoric/mediocrity.phtml`, runnable: true },
  { name: 'Misfortune', type: 4, url: `${NEOPETS}/halloween/wheel/index.phtml`, runnable: true },
  { name: 'Monotony', type: 5, url: `${NEOPETS}/prehistoric/monotony/monotony.phtml`, runnable: false },
  { name: 'Extravagance', type: 6, url: `${NEOPETS}/desert/extravagance.phtml`, runnable: false },
];

/** The wheel a quest names, or null when it names none. */
export function wheelFor(quest) {
  const text = questText(quest);
  return WHEELS.find((w) => new RegExp(`wheel of ${w.name}`, 'i').test(text)) ?? null;
}

// --- quest kinds -------------------------------------------------------------

const questText = (q) => [q?.title, q?.description, ...(q?.tasks ?? []).map((t) => t.label)]
  .filter(Boolean).join(' ');

// Checked in order: "Play With a Pet" has to be caught before "Play a Game",
// and "Popular NC Items" before the plain NC Mall visit.
const KINDS = [
  ['fishing', /fishing|reel in/i],
  ['wheel', /spin the wheel|wheel of/i],
  ['purchase', /purchase|buy an item/i],
  ['customise', /customi[sz]e/i],
  ['play', /play with/i],
  ['game', /play a game|games room/i],
  ['read', /\bread\b/i],
  ['feed', /\bfeed\b/i],
  ['groom', /\bgroom/i],
  ['battledome', /battledome|\bfight\b/i],
  ['ncpopular', /popular nc/i],
  ['ncmall', /nc mall/i],
];

export function questKind(quest) {
  const text = questText(quest);
  return KINDS.find(([, re]) => re.test(text))?.[0] ?? 'unknown';
}

const LINKS = {
  fishing: FISHING_URL,
  purchase: `${NEOPETS}/objects.phtml`,
  customise: `${NEOPETS}/customise/`,
  play: INVENTORY_URL,
  game: `${NEOPETS}/games/`,
  read: INVENTORY_URL,
  feed: INVENTORY_URL,
  groom: INVENTORY_URL,
  battledome: `${NEOPETS}/dome/`,
  ncpopular: NC_MALL_URL,
  ncmall: NC_MALL_URL,
};

/** Where to go to do a quest by hand. */
export function questLink(quest) {
  if (quest.kind === 'wheel') return wheelFor(quest)?.url ?? QUESTLOG_URL;
  return LINKS[quest.kind] ?? QUESTLOG_URL;
}

// The quests done by using an item on a pet; `lib/item-use.js` knows how.
const USE_KINDS = ['read', 'feed', 'play', 'groom'];

/**
 * Which runner can finish a quest, or null. Fishing always can; a wheel only
 * when the quest names one that spins in a single request; the item quests by
 * using a suitable item from your inventory on your active pet.
 */
export function runnerFor(quest) {
  if (quest.complete) return null;
  if (quest.kind === 'fishing') return 'fishing';
  if (quest.kind === 'wheel' && wheelFor(quest)?.runnable) return 'wheel';
  if (USE_KINDS.includes(quest.kind)) return 'use';
  // Both NC Mall quests: loading the popular items page is the whole task.
  if (quest.kind === 'ncpopular' || quest.kind === 'ncmall') return 'visit';
  // Finds the shop and the item; the buying itself stays your click.
  if (quest.kind === 'purchase') return 'shop';
  // Adds a wearable to the active pet, saves, then saves the outfit back.
  if (quest.kind === 'customise') return 'customise';
  return null;
}

// --- the list ----------------------------------------------------------------

const text = (el) => el?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
const npAmount = (s) => Number(String(s ?? '').replace(/[^\d]/g, '')) || null;

function parseTask(el) {
  const count = /(\d+)\s*\/\s*(\d+)/.exec(text(el.querySelector('.ql-task-num')));
  return {
    label: text(el.querySelector('.ql-task-description')),
    done: !!el.querySelector('.ql-task-complete'),
    have: count ? Number(count[1]) : null,
    need: count ? Number(count[2]) : null,
  };
}

function parseReward(el) {
  const img = el.querySelector('.ql-reward-img');
  const label = text(el.querySelector('.ql-reward-label'));
  if (img?.classList.contains('ql-reward-np')) return { type: 'np', label, amount: npAmount(label) };
  return { type: 'item', label, image: img?.querySelector('img')?.getAttribute('src') ?? null };
}

function parseQuest(el) {
  const id = el.id.replace(/^Quest/, '') || el.querySelector('[data-quest]')?.getAttribute('data-quest');
  const icon = el.querySelector('.ql-quest-category img')?.getAttribute('src') ?? '';
  const tasks = [...el.querySelectorAll('.ql-task')].map(parseTask);
  const claim = el.querySelector('.ql-claim');
  const quest = {
    id,
    title: text(el.querySelector('.ql-quest-title')),
    description: text(el.querySelector('.ql-quest-description')),
    icon: icon.split('/').pop().replace(/\.\w+$/, '') || null,
    premium: el.classList.contains('ql-premium'),
    tasks,
    complete: tasks.length > 0 && tasks.every((t) => t.done),
    claimable: !!claim && !claim.hasAttribute('disabled'),
    reward: parseReward(el),
  };
  quest.kind = questKind(quest);
  quest.link = questLink(quest);
  quest.runner = runnerFor(quest);
  quest.wheel = quest.kind === 'wheel' ? wheelFor(quest) : null;
  return quest;
}

/** A PHP DateInterval, as the reply's `timer` carries it, in milliseconds. */
export function intervalMs(t) {
  if (!t || typeof t !== 'object') return null;
  const n = (k) => Number(t[k]) || 0;
  return ((((n('d') * 24) + n('h')) * 60 + n('i')) * 60 + n('s')) * 1000;
}

/**
 * `retrieveQuests.php`'s reply, given `parse(html)` to turn its `output` into a
 * document. Claimed quests are not in it at all — Neopets drops them from the
 * list — so everything here is still to do or still to claim.
 */
export function parseQuestList(json, parse) {
  if (!json?.success) {
    throw new QuestLogError(json?.errMsg || 'Neopets would not show the quest log. Are you logged in?');
  }
  const doc = parse(`<body>${json.output ?? ''}</body>`);
  // One marker per quest that counts, each either done or not. The dots between
  // them and the reward at the end share the marker class, so only those two
  // states are counted.
  const markers = [...doc.querySelectorAll('#QuestLogBonusRewards .ql-marker')]
    .filter((m) => m.classList.contains('ql-complete') || m.classList.contains('ql-incomplete'));
  if (!doc.querySelector('.questlog-quests, .questlog-quest')) {
    throw new QuestLogError("Could not read the quest log — its layout may have changed.");
  }
  return {
    quests: [...doc.querySelectorAll('.questlog-quest')].map(parseQuest),
    bonus: {
      done: markers.filter((m) => m.classList.contains('ql-complete')).length,
      total: markers.length,
      // Only there once every quest is done: the id its Claim posts, and what it gives.
      claimId: doc.querySelector('.ql-bonus-claim[data-bonus]')?.getAttribute('data-bonus') ?? null,
      reward: text(doc.querySelector('#QuestLogBonus .ql-bonus-name')) || null,
    },
    expiresInMs: intervalMs(json.timer),
  };
}

/** What the daily bonus's Claim posts, as the quest log page's own script does. */
export function claimBonusBody(ck, bonusId) {
  const body = new FormData();
  body.append('_ref_ck', ck);
  body.append('mode', 'bonus');
  body.append('bonus', String(bonusId));
  return body;
}

// --- replies -------------------------------------------------------------------

// A line break is a gap between words; any other tag is only emphasis, so
// "Come back <b>later</b>!" must not come out as "later !".
const stripTags = (s) => String(s ?? '')
  .replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

/** `claimRewards.php`'s reply: what was given, and the new NP total when NP. */
export function parseClaim(json) {
  if (!json?.success) {
    throw new QuestLogError(stripTags(json?.errMsg) || 'Neopets did not give that reward.');
  }
  return {
    reward: json.reward ?? null,
    np: npAmount(json.npAmt),
    newNp: json.newNp ?? null,
    itemName: json.itemName ? stripTags(json.itemName) : null,
    itemImage: json.itemImg ?? null,
  };
}

/** The fishing vortex page after reeling in: the catch and the new skill. */
export function parseFishing(doc) {
  const body = text(doc?.body);
  if (!/you reel in your line/i.test(body)) {
    const why = [...(doc?.querySelectorAll?.('p') ?? [])].map(text).find((t) => t.length > 12);
    throw new QuestLogError(why || 'The fishing vortex did not say what you caught.');
  }
  const art = doc.querySelector('.item-single__2020');
  const image = /url\((?:&quot;|["'])?([^"')&]+)/.exec(art?.getAttribute('style') ?? '')?.[1] ?? null;
  const caught = art ? text(art.nextElementSibling?.querySelector('b')) : null;
  const skill = /fishing skill increases to (\d+)/i.exec(body);
  return {
    caught: caught || null,
    image: image ? new URL(image, NEOPETS).href : null,
    skill: skill ? Number(skill[1]) : null,
  };
}

/** `getResult.php`'s reply: the prize, and the NP total it leaves you with. */
export function parseWheel(json) {
  if (!json?.success) {
    throw new QuestLogError(stripTags(json?.spinResultMessage || json?.message) || 'The wheel would not spin.');
  }
  return {
    prize: stripTags(json.name) || stripTags(json.prizeDescription) || null,
    image: json.image || json.altimage || null,
    message: stripTags(json.spinResultMessage) || null,
    neopoints: json.neopoints != null ? Number(json.neopoints) : null,
    freeSpin: json.premium_freeSpin === true,
  };
}
