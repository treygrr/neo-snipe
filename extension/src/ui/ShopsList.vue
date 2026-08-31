<script setup>
import { computed } from 'vue';
import { mdiRefresh } from '@mdi/js';
import { state, retryShops } from './store.js';

// Results are reused rather than re-fetched, so say how old they are.
const searchedAgo = computed(() => {
  if (!state.ssw.at) return 'again';
  const mins = Math.floor((Date.now() - state.ssw.at) / 60000);
  return mins < 1 ? 'now' : `${mins}m`;
});

const props = defineProps({
  // The popover has more room than the tab, so it shows more rows.
  limit: { type: Number, default: 25 },
});

const shops = computed(() => (state.ssw.data?.listings || []).slice(0, props.limit));

// One line that can ellipsize, rather than chips that wrap in a 340px card.
const summary = computed(() => {
  const total = state.ssw.data?.rowCount ?? 0;
  const shown = total > shops.value.length ? ` (showing ${shops.value.length})` : '';
  const cheapest = shops.value.length ? ` · cheapest ${shops.value[0].priceText}` : '';
  return `${total.toLocaleString('en-US')} shops${shown}${cheapest}`;
});
</script>

<template>
  <div v-if="state.ssw.loading" class="ns-tp-loading">
    <v-progress-circular indeterminate size="22" width="2" />
    <span>Asking the Super Shop Wizard…</span>
  </div>

  <v-alert v-else-if="state.ssw.error" type="warning" variant="tonal" density="compact" class="ns-tp-error">
    <div>{{ state.ssw.error }}</div>
    <v-btn size="x-small" variant="text" class="mt-1" @click="retryShops">Retry</v-btn>
  </v-alert>

  <template v-else-if="state.ssw.data">
    <div class="ns-tp-stats">
      <span class="ns-stat-line">{{ summary }}</span>
      <button
        type="button"
        class="ns-research"
        :title="`Searched ${searchedAgo === 'now' ? 'just now' : searchedAgo + ' ago'} — search again`"
        @click="retryShops"
      ><v-icon :icon="mdiRefresh" size="12" /> {{ searchedAgo }}</button>
    </div>

    <v-table v-if="shops.length" density="compact" class="ns-rows">
      <tbody>
        <tr v-for="s in shops" :key="s.owner + s.price">
          <td class="ns-shop-owner">
            <a v-if="s.href" :href="s.href" target="_blank" rel="noopener">{{ s.owner }}</a>
            <span v-else>{{ s.owner }}</span>
          </td>
          <td class="ns-num">{{ s.priceText }}</td>
          <td class="ns-num ns-shop-stock">{{ s.amount ? `x${s.amount}` : '' }}</td>
        </tr>
      </tbody>
    </v-table>
    <p v-else class="ns-empty">No shops are stocking this right now.</p>
  </template>
</template>

<style scoped>
.ns-tp-loading {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 40px 0; font-size: 11px; opacity: .7;
}
.ns-tp-error { margin: 8px; font-size: 11px; }
.ns-tp-stats {
  /* The wizard rows keep to one line via .ns-stat-line below; wrapping is
     left on for the TP tab, whose three chips have no such line. */
  display: flex; flex-wrap: wrap; align-items: center; gap: 8px;
  font-size: 10px; opacity: .65; padding: 6px 8px 2px;
}
.ns-stat-line {
  flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.ns-research {
  flex: none; font: inherit; font-size: 10px; cursor: pointer; color: inherit;
  display: inline-flex; align-items: center; gap: 2px;
  background: none; border: 1px solid rgba(0, 0, 0, .2); border-radius: 4px; padding: 0 5px;
}
.ns-research:hover { background: rgba(0, 0, 0, .05); }
.ns-rows { font-size: 11px; }
.ns-rows :deep(td) { height: 24px !important; padding: 0 8px !important; white-space: nowrap; }
.ns-num { text-align: right; font-variant-numeric: tabular-nums; }
.ns-shop-owner { max-width: 150px; overflow: hidden; text-overflow: ellipsis; }
.ns-shop-owner a { color: inherit; }
.ns-shop-stock { opacity: .55; font-size: 10px; }
.ns-empty { font-size: 11px; opacity: .6; padding: 16px 8px; text-align: center; }
</style>
