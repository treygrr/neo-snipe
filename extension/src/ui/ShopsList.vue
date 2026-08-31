<script setup>
import { computed } from 'vue';
import { mdiRefresh } from '@mdi/js';
import { state, retryShops } from './store.js';

// Results are reused rather than re-fetched, so say how old they are.
const searchedAgo = computed(() => {
  if (!state.ssw.at) return '';
  const mins = Math.floor((Date.now() - state.ssw.at) / 60000);
  return mins < 1 ? 'just now' : `${mins}m ago`;
});

const props = defineProps({
  // The popover has more room than the tab, so it shows more rows.
  limit: { type: Number, default: 25 },
});

const shops = computed(() => (state.ssw.data?.listings || []).slice(0, props.limit));
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
      <span>{{ state.ssw.data.rowCount.toLocaleString('en-US') }} shops</span>
      <span v-if="shops.length">cheapest {{ shops[0].priceText }}</span>
      <span v-if="state.ssw.data.rowCount > shops.length">showing {{ shops.length }}</span>
      <span class="ns-more">{{ searchedAgo }}</span>
      <button type="button" class="ns-research" title="Search again" @click="retryShops">
        <v-icon :icon="mdiRefresh" size="12" /> again
      </button>
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
  display: flex; flex-wrap: wrap; gap: 8px;
  font-size: 10px; opacity: .65; padding: 6px 8px 2px;
}
.ns-more { margin-left: auto; }
.ns-research {
  font: inherit; font-size: 10px; cursor: pointer; color: inherit;
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
