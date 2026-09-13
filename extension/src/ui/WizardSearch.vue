<script setup>
import { computed, ref } from 'vue';
import { mdiChevronDown, mdiChevronUp, mdiHistory, mdiMagnify, mdiRefresh } from '@mdi/js';
import SW_ICON from '../../icons/shopwizard-icon.png?inline';
import SSW_ICON from '../../icons/ssw-icon.png?inline';
import {
  state, setSearchQuery, setSearchSort, runSearch, searchPageItem, sortedListings,
  crossCached, clearSearch,
} from './store.js';

// One component, both wizards: they differ only in which slot they read and
// what they are called.
const props = defineProps({ kind: { type: String, required: true } });

const slot = computed(() => state.search[props.kind]);
const rows = computed(() => sortedListings(props.kind));
const label = computed(() => (props.kind === 'wiz' ? 'Shop Wizard' : 'Super Shop Wizard'));
const icon = computed(() => (props.kind === 'wiz' ? SW_ICON : SSW_ICON));

const SORTS = [
  { id: 'price-asc', label: 'Price ↑' },
  { id: 'price-desc', label: 'Price ↓' },
  { id: 'name-asc', label: 'A–Z' },
  { id: 'name-desc', label: 'Z–A' },
];

// The page's own items, offered when the box is clicked rather than listed all
// the time. Shaped for VCombobox, which filters on `title` as you type.
const items = computed(() => state.pageItems.map((i) => ({
  title: i.name, value: i.name, imageUrl: i.imageUrl,
})));

const menuOpen = ref(false);

/**
 * Searches only ever start from an explicit act — a pick, Enter, the button.
 * In single mode VCombobox writes its model on every keystroke, so reacting to
 * the model would spend a rate-limited Wizard search per letter typed.
 */
function submit() {
  if (!slot.value.query.trim()) return;
  runSearch(props.kind);
  // Enter makes the combobox re-open its menu on the next tick; closing it
  // after that is what actually leaves it shut.
  setTimeout(() => { menuOpen.value = false; }, 0);
}

const pick = (raw) => searchPageItem(props.kind, { name: raw.title });

// The x clears the result along with the text: an empty box over the last
// item's shops would say two different things. The cache is left alone, so
// searching that item again is still instant.
function clear() {
  clearSearch(props.kind);
  showOther.value = false;
  menuOpen.value = false;
}

const since = (at) => {
  const mins = Math.floor((state.now - at) / 60000);
  return mins < 1 ? 'just now' : `${mins}m ago`;
};

const freshness = computed(() => {
  if (!slot.value.at) return '';
  return slot.value.fromCache ? `cached ${since(slot.value.at)}` : since(slot.value.at);
});

const lowest = (list) => list.reduce(
  (low, r) => (r.price != null && (low == null || r.price < low) ? r.price : low),
  null,
);
const cheapest = computed(() => lowest(rows.value));

const np = (n) => `${n.toLocaleString('en-US')} NP`;
const shops = (n) => `${n} shop${n === 1 ? '' : 's'}`;

const summary = computed(() => {
  const parts = [shops(rows.value.length)];
  if (cheapest.value != null) parts.push(`from ${np(cheapest.value)}`);
  if (props.kind === 'wiz' && slot.value.searches > 1) parts.push(`${slot.value.searches} searches`);
  return parts.join(' · ');
});

// Whatever the other wizard has already found for this item: a second opinion,
// folded to one line so it never pushes this panel's own result off screen.
const other = computed(() => crossCached(props.kind));
const showOther = ref(false);
const otherSummary = computed(() => {
  if (!other.value) return '';
  const low = lowest(other.value.listings);
  return low == null ? shops(other.value.listings.length) : `${shops(other.value.listings.length)} from ${np(low)}`;
});

// Nothing searched yet, nothing in flight, nothing wrong.
const idle = computed(() => !slot.value.listings && !slot.value.loading && !slot.value.error);

// The panel body is a fixed 340px. Padding, the field and the header take 122
// of it, so a lone table capped at 216 fits with no second scrollbar. A table
// takes only the height its rows need below that: a fixed box around three
// rows would just be empty space.
const ROW = 26;
const HEAD = 28;
const tableHeight = (count, cap) => Math.min(HEAD + count * ROW, cap);
const mainCap = computed(() => (other.value && showOther.value ? 150 : 216));
</script>

<template>
  <div class="ns-wiz">
    <v-combobox
      v-model:menu="menuOpen"
      class="ns-wiz-input"
      :model-value="slot.query"
      :items="items"
      :placeholder="`Search the ${label}`"
      :menu-icon="false"
      :loading="slot.loading"
      :menu-props="{ maxHeight: 272, contentClass: 'ns-wiz-menu' }"
      variant="outlined"
      density="compact"
      rounded="lg"
      bg-color="surface"
      autocomplete="off"
      spellcheck="false"
      hide-details
      single-line
      persistent-placeholder
      clearable
      persistent-clear
      @update:search="(v) => setSearchQuery(kind, v ?? '')"
      @keydown.enter="submit"
      @click:clear="clear"
    >
      <template #menu-header>
        <div class="ns-wiz-menu-head">
          <span>On this page</span>
          <span class="ns-wiz-menu-count">{{ items.length }}</span>
        </div>
      </template>

      <template #item="{ props: itemProps, item }">
        <v-list-item
          v-bind="itemProps"
          class="ns-wiz-item"
          density="compact"
          @click="pick(item.raw)"
        >
          <template #prepend>
            <img v-if="item.raw.imageUrl" :src="item.raw.imageUrl" alt="" class="ns-wiz-thumb">
            <span v-else class="ns-wiz-thumb ns-wiz-thumb--blank" />
          </template>
          <template #title>
            <span class="ns-wiz-item-name">{{ item.title }}</span>
          </template>
        </v-list-item>
      </template>

      <!-- Outside the field, level with it. -->
      <template #append>
        <v-btn
          class="ns-wiz-go"
          icon
          height="40"
          width="40"
          rounded="lg"
          variant="flat"
          color="primary"
          :disabled="!slot.query.trim() || slot.loading"
          aria-label="Search"
          title="Search"
          @click="submit"
        >
          <v-icon :icon="mdiMagnify" size="20" />
        </v-btn>
      </template>
    </v-combobox>

    <div v-if="idle" class="ns-wiz-empty">
      <img :src="icon" alt="" class="ns-wiz-empty-icon">
      <p class="ns-wiz-empty-title">Search the {{ label }}</p>
      <p class="ns-wiz-empty-sub">
        <template v-if="items.length">
          Click the search box to pick from the {{ items.length }} items on this page, or type any
          item's name.
        </template>
        <template v-else>Type an item's name to see which shops are selling it.</template>
      </p>
    </div>

    <div v-else-if="slot.loading && !slot.listings" class="ns-wiz-state">
      <v-progress-circular indeterminate size="20" width="2" color="primary" />
      <span>Asking the {{ label }} about <strong>{{ slot.name }}</strong>…</span>
    </div>

    <v-alert
      v-else-if="slot.error"
      class="ns-wiz-error"
      type="warning"
      variant="tonal"
      density="compact"
      rounded="lg"
    >
      {{ slot.error }}
      <template #append>
        <v-btn size="x-small" variant="text" @click="runSearch(kind, { force: true })">Retry</v-btn>
      </template>
    </v-alert>

    <section
      v-if="slot.listings"
      class="ns-wiz-results"
      :class="{ 'ns-wiz-results--busy': slot.loading }"
    >
      <header class="ns-wiz-bar">
        <div class="ns-wiz-bar-text">
          <div class="ns-wiz-name" :title="slot.name">{{ slot.name }}</div>
          <div class="ns-wiz-summary">
            <span>{{ summary }}</span>
            <button
              type="button"
              class="ns-wiz-again"
              :title="slot.fromCache
                ? `Held from a search ${since(slot.at)} — search again for fresh prices`
                : 'Search again'"
              @click="runSearch(kind, { force: true })"
            ><v-icon :icon="mdiRefresh" size="12" />{{ freshness }}</button>
          </div>
        </div>

        <v-btn-toggle
          v-if="rows.length"
          class="ns-wiz-sorts"
          :model-value="slot.sort"
          mandatory
          divided
          density="compact"
          variant="outlined"
          color="primary"
          rounded="lg"
          @update:model-value="(v) => setSearchSort(kind, v)"
        >
          <v-btn
            v-for="s in SORTS"
            :key="s.id"
            :value="s.id"
            class="ns-wiz-sort"
            :class="{ 'ns-wiz-sort--on': slot.sort === s.id }"
            size="small"
          >{{ s.label }}</v-btn>
        </v-btn-toggle>
      </header>

      <v-table
        v-if="rows.length"
        class="ns-wiz-rows"
        density="compact"
        hover
        fixed-header
        :height="tableHeight(rows.length, mainCap)"
      >
        <thead>
          <tr>
            <th>Shop</th>
            <th class="ns-num">Price</th>
            <th class="ns-num">Stock</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="r in rows"
            :key="r.owner + r.price"
            :class="{ 'ns-wiz-best': r.price != null && r.price === cheapest }"
          >
            <td class="ns-shop-owner">
              <a v-if="r.href" :href="r.href" target="_blank" rel="noopener">{{ r.owner }}</a>
              <span v-else>{{ r.owner }}</span>
            </td>
            <td class="ns-num">{{ r.priceText }}</td>
            <td class="ns-num ns-shop-stock">{{ r.amount ? `×${r.amount}` : '' }}</td>
          </tr>
        </tbody>
      </v-table>

      <p v-else class="ns-wiz-none">No shops are stocking this right now.</p>
    </section>

    <section v-if="other" class="ns-wiz-cross">
      <button
        type="button"
        class="ns-wiz-other-head"
        :aria-expanded="showOther"
        @click="showOther = !showOther"
      >
        <v-icon :icon="mdiHistory" size="15" class="ns-wiz-other-icon" />
        <span class="ns-wiz-other-title">Already found by the {{ other.label }}</span>
        <span class="ns-wiz-other-meta">{{ otherSummary }} · cached {{ since(other.at) }}</span>
        <v-icon :icon="showOther ? mdiChevronUp : mdiChevronDown" size="16" />
      </button>

      <v-table
        v-if="showOther"
        class="ns-wiz-rows ns-wiz-other"
        density="compact"
        hover
        fixed-header
        :height="tableHeight(other.listings.length, 150)"
      >
        <thead>
          <tr>
            <th>Shop</th>
            <th class="ns-num">Price</th>
            <th class="ns-num">Stock</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in other.listings" :key="'x' + r.owner + r.price">
            <td class="ns-shop-owner">
              <a v-if="r.href" :href="r.href" target="_blank" rel="noopener">{{ r.owner }}</a>
              <span v-else>{{ r.owner }}</span>
            </td>
            <td class="ns-num">{{ r.priceText }}</td>
            <td class="ns-num ns-shop-stock">{{ r.amount ? `×${r.amount}` : '' }}</td>
          </tr>
        </tbody>
      </v-table>
    </section>
  </div>
</template>

<style scoped>
.ns-wiz { display: flex; flex-direction: column; gap: 10px; padding: 12px; }
/* Several children have overflow hidden (the button group, the table wrapper),
   which lets a flex column squash them below their content. None may shrink. */
.ns-wiz > *, .ns-wiz-results > *, .ns-wiz-cross > * { flex-shrink: 0; }

.ns-wiz-input :deep(.v-field__input) { font-size: 13px; }
/* The outer append sits level with the field rather than on its baseline. */
.ns-wiz-input :deep(.v-input__append) { margin-inline-start: 8px; padding-top: 0; align-items: center; }
.ns-wiz-input :deep(.v-field__clearable) { opacity: .55; }
.ns-wiz-input :deep(.v-field__clearable:hover) { opacity: 1; }

.ns-wiz-thumb { width: 24px; height: 24px; object-fit: contain; flex: 0 0 auto; margin-inline-end: 12px; }
.ns-wiz-thumb--blank { display: inline-block; background: rgba(0, 0, 0, .06); border-radius: 4px; }
.ns-wiz-item-name { font-size: 13px; }

.ns-wiz-menu-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 16px 4px;
  font-size: 11px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase;
  color: rgba(0, 0, 0, .5);
}
.ns-wiz-menu-count {
  font-variant-numeric: tabular-nums; letter-spacing: 0;
  background: rgba(0, 0, 0, .06); border-radius: 8px; padding: 1px 7px;
}

.ns-wiz-empty {
  display: flex; flex-direction: column; align-items: center; text-align: center;
  padding: 44px 32px 12px;
}
.ns-wiz-empty-icon { width: 48px; height: 48px; object-fit: contain; margin-bottom: 14px; }
.ns-wiz-empty-title { margin: 0 0 6px; font-size: 14px; font-weight: 600; }
.ns-wiz-empty-sub { margin: 0; max-width: 300px; font-size: 12px; line-height: 1.55; color: rgba(0, 0, 0, .58); }

.ns-wiz-state {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 48px 0; font-size: 12px; color: rgba(0, 0, 0, .7);
}
.ns-wiz-error { font-size: 12px; }

.ns-wiz-results, .ns-wiz-cross { display: flex; flex-direction: column; gap: 8px; }
.ns-wiz-results--busy { opacity: .55; transition: opacity .15s ease; }

.ns-wiz-bar { display: flex; align-items: center; gap: 12px; min-height: 38px; }
.ns-wiz-bar-text { flex: 1 1 auto; min-width: 0; }
.ns-wiz-name {
  font-size: 14px; font-weight: 600; line-height: 1.35;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.ns-wiz-summary {
  display: flex; align-items: center; gap: 8px;
  font-size: 12px; line-height: 1.35; color: rgba(0, 0, 0, .58); font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.ns-wiz-again {
  display: inline-flex; align-items: center; gap: 3px;
  padding: 0 4px; margin: 0; border: 0; border-radius: 4px;
  background: transparent; color: inherit; font: inherit; cursor: pointer;
}
.ns-wiz-again:hover { color: rgb(var(--v-theme-primary)); background: rgba(0, 0, 0, .04); }

.ns-wiz-sorts { flex: 0 0 auto; }
.ns-wiz-sort { text-transform: none; letter-spacing: 0; font-size: 12px; min-width: 0 !important; padding: 0 10px !important; }

.ns-wiz-rows {
  border: 1px solid rgba(0, 0, 0, .1); border-radius: 8px; overflow: hidden;
  font-size: 12px;
}
.ns-wiz-rows :deep(th) {
  height: 28px !important; padding: 0 12px !important;
  font-size: 11px; font-weight: 600 !important; color: rgba(0, 0, 0, .55) !important;
  background: #f6f7f9 !important;
}
.ns-wiz-rows :deep(td) { height: 26px !important; padding: 0 12px !important; white-space: nowrap; }
.ns-num { text-align: right !important; font-variant-numeric: tabular-nums; }
.ns-shop-owner { max-width: 240px; overflow: hidden; text-overflow: ellipsis; }
.ns-shop-owner a { color: rgb(var(--v-theme-primary)); text-decoration: none; }
.ns-shop-owner a:hover { text-decoration: underline; }
.ns-shop-stock { color: rgba(0, 0, 0, .5); }

/* The cheapest shop is the reason you searched. */
.ns-wiz-best td { background: rgba(46, 125, 50, .07); }
.ns-wiz-best .ns-num:not(.ns-shop-stock) { color: #2e7d32; font-weight: 600; }

.ns-wiz-none { margin: 0; padding: 24px 0; text-align: center; font-size: 12px; color: rgba(0, 0, 0, .58); }

/* The other wizard's find: one quiet line that unfolds on request. */
.ns-wiz-other-head {
  display: flex; align-items: center; gap: 8px; width: 100%;
  padding: 8px 10px; margin: 0;
  border: 1px solid rgba(0, 0, 0, .1); border-radius: 8px;
  background: #f9fafb; color: rgba(0, 0, 0, .7); font: inherit; font-size: 12px;
  text-align: left; cursor: pointer;
}
.ns-wiz-other-head:hover { background: #f1f3f5; }
.ns-wiz-other-icon { opacity: .6; }
.ns-wiz-other-title { font-weight: 600; white-space: nowrap; }
.ns-wiz-other-meta {
  margin-left: auto; min-width: 0;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  color: rgba(0, 0, 0, .5); font-variant-numeric: tabular-nums;
}
</style>

<!-- The menu is attached to the shadow root rather than rendered inside this
     component, so its list chrome is reached by content class, not scoped
     attributes. Nothing here reaches the Neopets page. -->
<style>
.ns-wiz-menu .v-list { padding: 0 6px 6px !important; }
.ns-wiz-menu .ns-wiz-item { border-radius: 6px; }
</style>
