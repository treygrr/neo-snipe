<script setup>
import { computed } from 'vue';
import { mdiContentSave, mdiDeleteOutline, mdiGavel } from '@mdi/js';
import {
  state, makeRelistAuction, deleteRelist, saveRelistEdits, relistEdited,
} from './store.js';
import { AUCTION_DURATIONS } from '../lib/fast-relist.js';

const entry = computed(() => state.relist.entry);
const draft = computed(() => state.relist.draft);
const item = computed(() => state.relist.item);
const image = computed(() => item.value?.imageUrl || entry.value?.imageUrl);

// Whole NP only, as the auction form takes it.
const MAX_START = 200_000_000;
const setNp = (key, event) => {
  const n = Math.min(MAX_START, Number(event.target.value.replace(/[^\d]/g, '')) || 0);
  state.relist.draft[key] = n;
  event.target.value = n ? n.toLocaleString('en-US') : '';
};
const shown = (n) => (n ? Number(n).toLocaleString('en-US') : '');

const durations = Object.entries(AUCTION_DURATIONS).map(([hours, label]) => ({ hours: Number(hours), label }));

const savedOn = computed(() => (entry.value?.savedAt
  ? new Date(entry.value.savedAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  : null));

const canAuction = computed(() => Boolean(
  draft.value?.startPrice && item.value?.objId && !item.value?.listed,
));
</script>

<template>
  <div class="ns-relist">
    <header class="ns-relist-head">
      <img v-if="image" :src="image" alt="" class="ns-relist-img">
      <div class="ns-relist-title">
        <div class="ns-relist-name">{{ item?.name }}</div>
        <div v-if="savedOn" class="ns-relist-saved">
          Saved {{ savedOn }}<template v-if="relistEdited()"> · edited</template>
        </div>
      </div>
    </header>

    <p v-if="!entry || !draft" class="ns-relist-empty">
      No Fast Relist is saved for this item. Open it in your inventory, choose Put up for Auction!,
      fill in the form and press Save to Fast Relist.
    </p>

    <template v-else>
      <div class="ns-relist-form">
        <label class="ns-relist-field">
          <span>Start price (NP)</span>
          <input
            class="ns-relist-input ns-relist-start"
            inputmode="numeric"
            :value="shown(draft.startPrice)"
            :disabled="state.relist.busy"
            @change="setNp('startPrice', $event)"
          >
        </label>

        <label class="ns-relist-field">
          <span>Minimum increment (NP)</span>
          <input
            class="ns-relist-input ns-relist-increment"
            inputmode="numeric"
            :value="shown(draft.minIncrement)"
            :disabled="state.relist.busy"
            @change="setNp('minIncrement', $event)"
          >
        </label>

        <label class="ns-relist-field">
          <span>Auction length</span>
          <select
            v-model.number="state.relist.draft.duration"
            class="ns-relist-input ns-relist-duration"
            :disabled="state.relist.busy"
          >
            <option v-for="d in durations" :key="d.hours" :value="d.hours">{{ d.label }}</option>
          </select>
        </label>

        <v-switch
          v-model="state.relist.draft.neofriendsOnly"
          label="NeoFriends only"
          color="primary"
          density="compact"
          inset
          hide-details
          class="ns-relist-check"
          :disabled="state.relist.busy"
        />
        <v-switch
          v-model="state.relist.draft.guildMembersOnly"
          label="Guild members only"
          color="primary"
          density="compact"
          inset
          hide-details
          class="ns-relist-check"
          :disabled="state.relist.busy"
        />
      </div>

      <p v-if="!draft.startPrice" class="ns-relist-note">Enter a start price to make the auction.</p>
      <p v-else-if="!item?.objId" class="ns-relist-note">
        This item is not in your inventory right now, so there is nothing to auction.
      </p>
      <p
        v-if="state.relist.result"
        class="ns-relist-result"
        :class="{ 'ns-relist-result--bad': !state.relist.result.ok }"
      >{{ state.relist.result.message }}</p>

      <div class="ns-relist-actions">
        <v-btn
          color="primary"
          variant="flat"
          size="small"
          class="ns-relist-make"
          :prepend-icon="mdiGavel"
          :loading="state.relist.busy"
          :disabled="!canAuction"
          @click="makeRelistAuction"
        >{{ item?.listed ? 'Auction made' : 'Make auction' }}</v-btn>
        <v-btn
          variant="tonal"
          size="small"
          class="ns-relist-save"
          :prepend-icon="mdiContentSave"
          :disabled="state.relist.busy || !relistEdited()"
          title="Keep these values as this item's Fast Relist"
          @click="saveRelistEdits"
        >Save changes</v-btn>
        <v-spacer />
        <v-btn
          variant="text"
          size="small"
          color="error"
          class="ns-relist-delete"
          :prepend-icon="mdiDeleteOutline"
          :disabled="state.relist.busy"
          @click="deleteRelist"
        >Delete</v-btn>
      </div>
    </template>
  </div>
</template>

<style scoped>
.ns-relist { display: flex; flex-direction: column; padding: 10px 12px 12px; gap: 8px; font-size: 11.5px; }

.ns-relist-head { display: flex; align-items: center; gap: 10px; }
.ns-relist-img { width: 48px; height: 48px; flex: 0 0 auto; border-radius: 6px; object-fit: contain; }
.ns-relist-title { min-width: 0; }
.ns-relist-name { font-size: 13px; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ns-relist-saved { font-size: 10.5px; opacity: .6; }

.ns-relist-empty { margin: 0; padding: 20px 12px; text-align: center; color: rgba(0, 0, 0, .58); }

.ns-relist-form { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 10px; }
.ns-relist-field { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.ns-relist-field > span { font-weight: 600; color: rgba(0, 0, 0, .7); }
.ns-relist-input {
  width: 100%; box-sizing: border-box; min-width: 0;
  font: inherit; font-size: 12px; font-variant-numeric: tabular-nums;
  padding: 5px 7px; border: 1px solid rgba(0, 0, 0, .25); border-radius: 5px;
  background: #fff; color: inherit;
}
.ns-relist-input:focus { outline: 2px solid rgba(31, 111, 235, .5); outline-offset: 0; border-color: #1f6feb; }
/* Each switch on a row of its own, across both columns. */
.ns-relist-check { grid-column: 1 / -1; flex: 0 0 auto; }
.ns-relist-check :deep(.v-label) { font-size: 11.5px; font-weight: 600; opacity: .8; }

.ns-relist-note { margin: 0; color: #b45309; font-size: 11px; }
.ns-relist-result { margin: 0; color: #2e7d32; font-size: 11px; }
.ns-relist-result--bad { color: #c62828; }

.ns-relist-actions { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.ns-relist-make, .ns-relist-save, .ns-relist-delete { text-transform: none; letter-spacing: 0; }
</style>
