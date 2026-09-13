<script setup>
import { computed } from 'vue';
import { mdiMagnify, mdiRefresh } from '@mdi/js';
import {
  state, setSearchQuery, setSearchSort, runSearch, searchPageItem, sortedListings,
  crossCached,
} from './store.js';

// One component, both wizards: they differ only in which slot they read and
// what the empty state calls them.
const props = defineProps({ kind: { type: String, required: true } });

const slot = computed(() => state.search[props.kind]);
const rows = computed(() => sortedListings(props.kind));
const label = computed(() => (props.kind === 'wiz' ? 'Shop Wizard' : 'Super Shop Wizard'));

const SORTS = [
  { id: 'price-asc', label: 'Price ↑' },
  { id: 'price-desc', label: 'Price ↓' },
  { id: 'name-asc', label: 'A–Z' },
  { id: 'name-desc', label: 'Z–A' },
];

const since = (at) => {
  const mins = Math.floor((state.now - at) / 60000);
  return mins < 1 ? 'just now' : `${mins}m ago`;
};

const ageText = computed(() => (slot.value.at ? since(slot.value.at) : ''));

// Whatever the other wizard has already found for this item. Shown alongside,
// never instead: it is a free second opinion, not this panel's result.
const other = computed(() => crossCached(props.kind));

const summary = computed(() => {
  const n = rows.value.length;
  if (!n) return 'No shops are stocking this right now.';
  const cheapest = rows.value.reduce(
    (low, r) => (r.price != null && (low == null || r.price < low) ? r.price : low),
    null,
  );
  const searched = props.kind === 'wiz' && slot.value.searches > 1
    ? ` · ${slot.value.searches} searches`
    : '';
  return `${n} shop${n === 1 ? '' : 's'}${cheapest == null ? '' : ` · cheapest ${cheapest.toLocaleString('en-US')} NP`}${searched}`;
});

const onSubmit = () => runSearch(props.kind);
</script>

<template>
  <div class="ns-wiz">
    <div class="ns-wiz-box">
      <input
        class="ns-wiz-input"
        type="search"
        :placeholder="`Search the ${label}…`"
        :value="slot.query"
        @input="setSearchQuery(kind, $event.target.value)"
        @keyup.enter="onSubmit"
      >
      <v-btn
        size="x-small"
        variant="tonal"
        :icon="mdiMagnify"
        :disabled="!slot.query.trim() || slot.loading"
        aria-label="Search"
        title="Search"
        @click="onSubmit"
      />
    </div>

    <!-- Everything this page holds, so a search is one click rather than a
         retyped name. -->
    <template v-if="state.pageItems.length && !slot.listings && !slot.loading">
      <p class="ns-wiz-hint">On this page</p>
      <div class="ns-wiz-items">
        <button
          v-for="item in state.pageItems"
          :key="item.name"
          type="button"
          class="ns-wiz-item"
          :title="`Search for ${item.name}`"
          @click="searchPageItem(kind, item)"
        >
          <img v-if="item.imageUrl" :src="item.imageUrl" :alt="''" class="ns-wiz-thumb">
          <span class="ns-wiz-item-name">{{ item.name }}</span>
        </button>
      </div>
    </template>

    <div v-if="slot.loading" class="ns-wiz-state">
      <v-progress-circular indeterminate size="22" width="2" />
      <span>Searching for {{ slot.name }}…</span>
    </div>

    <v-alert
      v-else-if="slot.error"
      type="warning"
      variant="tonal"
      density="compact"
      class="ns-wiz-error"
    >
      <div>{{ slot.error }}</div>
      <v-btn size="x-small" variant="text" class="mt-1" @click="runSearch(kind, { force: true })">
        Try again
      </v-btn>
    </v-alert>

    <template v-else-if="slot.listings">
      <div class="ns-wiz-head">
        <span class="ns-wiz-name">{{ slot.name }}</span>
        <button
          type="button"
          class="ns-wiz-again"
          :title="slot.fromCache
            ? `Held from a search ${ageText} — search again for fresh prices`
            : `Searched ${ageText} — search again`"
          @click="runSearch(kind, { force: true })"
        ><v-icon :icon="mdiRefresh" size="12" /> {{ slot.fromCache ? `cached ${ageText}` : ageText }}</button>
      </div>

      <p class="ns-wiz-summary">{{ summary }}</p>

      <div v-if="rows.length" class="ns-wiz-sorts">
        <button
          v-for="s in SORTS"
          :key="s.id"
          type="button"
          class="ns-wiz-sort"
          :class="{ 'ns-wiz-sort--on': slot.sort === s.id }"
          @click="setSearchSort(kind, s.id)"
        >{{ s.label }}</button>
      </div>

      <v-table v-if="rows.length" density="compact" class="ns-rows ns-wiz-rows">
        <tbody>
          <tr v-for="r in rows" :key="r.owner + r.price">
            <td class="ns-shop-owner">
              <a v-if="r.href" :href="r.href" target="_blank" rel="noopener">{{ r.owner }}</a>
              <span v-else>{{ r.owner }}</span>
            </td>
            <td class="ns-num">{{ r.priceText }}</td>
            <td class="ns-num ns-shop-stock">{{ r.amount ? `x${r.amount}` : '' }}</td>
          </tr>
        </tbody>
      </v-table>
    </template>

    <template v-if="other">
      <div class="ns-wiz-other-head">
        <span>Already found by the {{ other.label }}</span>
        <span class="ns-wiz-other-age">cached {{ since(other.at) }}</span>
      </div>
      <v-table density="compact" class="ns-rows ns-wiz-rows ns-wiz-other">
        <tbody>
          <tr v-for="r in other.listings" :key="'x' + r.owner + r.price">
            <td class="ns-shop-owner">
              <a v-if="r.href" :href="r.href" target="_blank" rel="noopener">{{ r.owner }}</a>
              <span v-else>{{ r.owner }}</span>
            </td>
            <td class="ns-num">{{ r.priceText }}</td>
            <td class="ns-num ns-shop-stock">{{ r.amount ? `x${r.amount}` : '' }}</td>
          </tr>
        </tbody>
      </v-table>
    </template>

    <p v-if="!slot.listings && !slot.loading && !other && !state.pageItems.length" class="ns-wiz-empty">
      Type an item name to search the {{ label }}.
    </p>
  </div>
</template>

<style scoped>
.ns-wiz { display: flex; flex-direction: column; gap: 6px; }

.ns-wiz-box { display: flex; align-items: center; gap: 6px; }
.ns-wiz-input {
  flex: 1 1 auto; min-width: 0;
  padding: 5px 8px; font-size: 12px;
  border: 1px solid rgba(0,0,0,.2); border-radius: 6px;
  background: rgba(0,0,0,.02); color: inherit;
}
.ns-wiz-input:focus { outline: 2px solid rgb(var(--v-theme-primary)); outline-offset: -1px; }

.ns-wiz-hint, .ns-wiz-empty { font-size: 11px; opacity: .7; margin: 0; }
.ns-wiz-items { display: flex; flex-direction: column; gap: 1px; max-height: 200px; overflow-y: auto; }
.ns-wiz-item {
  display: flex; align-items: center; gap: 6px;
  padding: 3px 4px; border: 0; border-radius: 4px;
  background: transparent; color: inherit; font: inherit; text-align: left; cursor: pointer;
}
.ns-wiz-item:hover { background: rgba(0,0,0,.06); }
/* Small and inline, so the list stays a list rather than a gallery. */
.ns-wiz-thumb { width: 20px; height: 20px; object-fit: contain; flex: 0 0 auto; }
.ns-wiz-item-name { font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.ns-wiz-state { display: flex; align-items: center; gap: 8px; font-size: 12px; opacity: .8; padding: 6px 0; }
.ns-wiz-error { font-size: 12px; }

.ns-wiz-head { display: flex; align-items: baseline; gap: 6px; }
.ns-wiz-name { font-weight: 600; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ns-wiz-again {
  margin-left: auto; flex: 0 0 auto;
  border: 0; background: transparent; color: inherit; cursor: pointer;
  font-size: 11px; opacity: .7; white-space: nowrap;
}
.ns-wiz-again:hover { opacity: 1; text-decoration: underline; }
.ns-wiz-summary { font-size: 11px; opacity: .75; margin: 0; }

.ns-wiz-sorts { display: flex; gap: 4px; }
.ns-wiz-sort {
  padding: 2px 7px; border: 1px solid rgba(0,0,0,.15); border-radius: 10px;
  background: transparent; color: inherit; font: inherit; font-size: 11px; cursor: pointer;
}
.ns-wiz-sort--on {
  background: rgb(var(--v-theme-primary)); color: rgb(var(--v-theme-on-primary));
  border-color: transparent;
}
.ns-wiz-rows { max-height: 260px; overflow-y: auto; }

/* The other wizard's find is secondary to this panel's own, and reads that way. */
.ns-wiz-other-head {
  display: flex; align-items: baseline; gap: 6px;
  font-size: 11px; opacity: .7;
  border-top: 1px solid rgba(0,0,0,.12); padding-top: 6px; margin-top: 2px;
}
.ns-wiz-other-age { margin-left: auto; white-space: nowrap; }
.ns-wiz-other { max-height: 180px; opacity: .85; }
</style>
