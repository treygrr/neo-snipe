<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { mdiDeleteOutline } from '@mdi/js';
import { state } from './store.js';
import { api } from '../lib/ext-api.js';
import { MAGMA_LOG, MAGMA_POOL_URL, cleanPoolTimes, nextPoolOpening } from '../lib/magma.js';
import { formatCountdown } from '../lib/daily-visits.js';

// The checker in the content script writes one entry per pool load, newest
// first. Watched rather than read once, so a check that lands while this view
// is open appears at the top of it.
const MAGMA_ACCOUNT = 'magmaAccount';
const log = ref([]);
const account = ref(null);

async function read() {
  const got = await api.storage.local.get([MAGMA_LOG, MAGMA_ACCOUNT]).catch(() => ({}));
  log.value = Array.isArray(got[MAGMA_LOG]) ? got[MAGMA_LOG] : [];
  account.value = got[MAGMA_ACCOUNT]?.name ?? null;
}

function onStorageChange(changes) {
  if (MAGMA_LOG in changes || MAGMA_ACCOUNT in changes) read();
  if ('magmaPoolTimes' in changes) state.settings.magmaPoolTimes = changes.magmaPoolTimes.newValue ?? {};
}

onMounted(() => {
  read();
  api.storage.onChanged.addListener(onStorageChange);
});
onBeforeUnmount(() => api.storage.onChanged.removeListener(onStorageChange));

const clearLog = () => api.storage.local.remove(MAGMA_LOG).catch(() => {});

const RESULTS = {
  open: { label: 'Open', color: 'green' },
  closed: { label: 'Closed', color: 'grey' },
  unknown: { label: 'Unreadable', color: 'orange' },
  error: { label: 'Failed', color: 'red' },
};

const TRIGGERS = {
  start: 'page opened',
  timer: '10-minute timer',
  click: 'you clicked',
  settings: 'settings changed',
  'pool-page': 'you were on the pool page',
};

const status = computed(() => {
  const who = account.value;
  const time = who && cleanPoolTimes(state.settings.magmaPoolTimes)[who];
  if (time) {
    const left = formatCountdown(Math.max(0, nextPoolOpening(time, state.now) - state.now));
    return `${who}'s guard naps at ${time} NST — opens in ${left}.`;
  }
  if (!state.settings.magmaPoolCheck) return 'Checking is switched off.';
  if (!who) return 'Waiting to see who is logged in.';
  return `Looking for ${who}'s time: one check every 10 minutes.`;
});

const when = (entry) => {
  const local = new Date(entry.at).toLocaleString([], {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  return entry.nst ? `${local} · NST ${entry.nst}` : local;
};

const meta = (entry) => [TRIGGERS[entry.trigger] ?? entry.trigger, entry.account]
  .filter(Boolean)
  .join(' · ');
</script>

<template>
  <div class="ns-magma">
    <header class="ns-magma-bar">
      <span class="ns-magma-status">{{ status }}</span>
      <a :href="MAGMA_POOL_URL" target="_blank" rel="noopener" class="ns-magma-open">Go to the pool</a>
      <v-btn
        v-if="log.length"
        :icon="mdiDeleteOutline"
        size="x-small"
        variant="text"
        class="ns-magma-clear"
        aria-label="Clear the log"
        title="Clear the log"
        @click="clearLog"
      />
    </header>

    <p v-if="!log.length" class="ns-magma-empty">
      <template v-if="state.settings.magmaPoolCheck">No checks yet. The first one runs shortly.</template>
      <template v-else>No checks yet. Switch on Find pool time in Settings to start checking.</template>
    </p>

    <div
      v-for="(entry, i) in log"
      :key="`${entry.at}-${i}`"
      class="ns-magma-row"
    >
      <div class="ns-magma-head">
        <v-chip
          size="x-small"
          label
          variant="tonal"
          :color="RESULTS[entry.result]?.color"
          class="ns-magma-result"
        >{{ RESULTS[entry.result]?.label ?? entry.result }}</v-chip>
        <span class="ns-magma-when" :title="new Date(entry.at).toString()">{{ when(entry) }}</span>
      </div>
      <div class="ns-magma-meta">{{ meta(entry) }}</div>
      <div v-if="entry.matched" class="ns-magma-matched">Read “{{ entry.matched }}”</div>
      <div v-else-if="entry.result === 'unknown'" class="ns-magma-matched ns-magma-matched--none">
        Found neither the open nor the closed wording.
      </div>
      <div v-if="entry.saved" class="ns-magma-saved">Saved {{ entry.saved }} NST for {{ entry.account }}</div>
      <div v-if="entry.note" class="ns-magma-note">{{ entry.note }}</div>
      <div v-if="entry.excerpt" class="ns-magma-excerpt" :title="entry.excerpt">{{ entry.excerpt }}</div>
    </div>
  </div>
</template>

<style scoped>
.ns-magma { display: flex; flex-direction: column; }

.ns-magma-bar {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 6px 6px 12px; font-size: 11px;
  border-bottom: 1px solid rgba(0, 0, 0, .06);
}
.ns-magma-status { flex: 1 1 auto; min-width: 0; opacity: .7; }
.ns-magma-open { flex: 0 0 auto; color: rgb(var(--v-theme-primary)); text-decoration: none; font-weight: 600; }
.ns-magma-open:hover { text-decoration: underline; }

.ns-magma-empty { margin: 0; padding: 32px 24px; text-align: center; font-size: 12px; color: rgba(0, 0, 0, .58); }

.ns-magma-row {
  display: flex; flex-direction: column; gap: 2px;
  padding: 8px 12px; border-bottom: 1px solid rgba(0, 0, 0, .06);
  font-size: 11px; line-height: 1.35;
}
.ns-magma-head { display: flex; align-items: center; gap: 8px; }
.ns-magma-result { flex: 0 0 auto; font-weight: 600; }
.ns-magma-when { font-variant-numeric: tabular-nums; font-weight: 600; font-size: 11.5px; }
.ns-magma-meta { color: rgba(0, 0, 0, .5); }
.ns-magma-matched { color: rgba(0, 0, 0, .75); }
.ns-magma-matched--none { font-style: italic; color: #b45309; }
.ns-magma-saved { color: #2e7d32; font-weight: 600; }
.ns-magma-note { color: #b91c1c; }
.ns-magma-excerpt {
  color: rgba(0, 0, 0, .5); font-style: italic;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
</style>
