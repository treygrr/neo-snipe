// The Quest Log button's count: how many quests are finished and waiting to be
// claimed. Plain DOM and storage only — it runs on every Neopets page, so
// nothing here may import Vue.
//
// The list is read at most once every ten minutes however many tabs are open:
// the count and when it was read live in storage.local, and the panel writes
// the same entry whenever it reads the list itself.
import { api } from '../lib/ext-api.js';
import {
  RETRIEVE_URL, QUESTLOG_URL, QUEST_READY_KEY, QUEST_REFRESH_MS,
  readRefCk, retrieveBody, parseQuestList, readyCount,
} from '../lib/questlog.js';
import { setQuestCount } from './launcher.js';

async function readCached() {
  const { [QUEST_READY_KEY]: cached } = await api.storage.local.get(QUEST_READY_KEY).catch(() => ({}));
  return cached && typeof cached === 'object' ? cached : null;
}

async function refresh(cached) {
  // No token means a page that cannot ask — logged out, or not a site page.
  const ck = readRefCk(document);
  if (!ck) return;

  // Claimed before the read, keeping the count we have, so a tab starting a
  // moment later sees it fresh and does not read the list as well.
  await api.storage.local.set({ [QUEST_READY_KEY]: { ...cached, at: Date.now() } }).catch(() => {});

  const res = await fetch(RETRIEVE_URL, {
    method: 'POST',
    credentials: 'include',
    referrer: QUESTLOG_URL,
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    body: retrieveBody(ck),
  });
  if (!res.ok) return;
  const { quests } = parseQuestList(await res.json(), (html) => new DOMParser().parseFromString(html, 'text/html'));
  await api.storage.local.set({ [QUEST_READY_KEY]: { count: readyCount(quests), at: Date.now() } }).catch(() => {});
}

export function startQuestBadge() {
  const show = (entry) => setQuestCount(entry?.count ?? 0);

  readCached()
    .then(async (cached) => {
      show(cached);
      if (!cached?.at || Date.now() - cached.at >= QUEST_REFRESH_MS) await refresh(cached);
    })
    .catch(() => { /* the count is a convenience; the panel still works */ });

  // A claim in the panel, or another tab's read, updates every open tab.
  api.storage.onChanged?.addListener((changes, area) => {
    if (area && area !== 'local') return;
    if (QUEST_READY_KEY in changes) show(changes[QUEST_READY_KEY].newValue);
  });
}
