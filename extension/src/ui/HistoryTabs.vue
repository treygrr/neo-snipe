<script setup>
import { computed } from 'vue';
import { state, selectTab, retryTradingPost, retryWizard, isPremium } from './store.js';
import ShopsList from './ShopsList.vue';

const props = defineProps({ data: { type: Object, required: true } });

const np = (n) => (n === null || n === undefined ? '—' : `${n.toLocaleString('en-US')} NP`);
const priceHistory = computed(() => (props.data.history || []).filter((h) => h.date));
const lots = computed(() => state.tp.data?.lots || []);
const wizListings = computed(() => state.wiz.data?.listings || []);

// Results are reused rather than re-searched, so say how old they are.
const searchedAgo = computed(() => {
  if (!state.wiz.at) return '';
  const mins = Math.floor((Date.now() - state.wiz.at) / 60000);
  return mins < 1 ? 'just searched' : `searched ${mins}m ago`;
});
</script>

<template>
  <div class="ns-tabs-wrap">
    <!-- Three tabs at Vuetify's default width overflow a 340px card, which
         turns the strip into a scrolling slide-group with arrows. -->
    <v-tabs
      :model-value="state.tab"
      density="compact"
      height="30"
      class="ns-tabs"
      :show-arrows="false"
      @update:model-value="selectTab"
    >
      <v-tab value="price" class="ns-tab" title="Price history">Price</v-tab>
      <v-tab value="tp" class="ns-tab" title="Trading post history">TP</v-tab>
      <v-tab value="wiz" class="ns-tab" title="Shop Wizard — searches only when you open this tab">SW</v-tab>
      <v-tab v-if="isPremium()" value="shops" class="ns-tab"
             title="Super Shop Wizard (Premium)">SSW</v-tab>
    </v-tabs>

    <!-- Fixed height so the popover never jumps between tabs; content scrolls. -->
    <div class="ns-tab-window">
      <template v-if="state.tab === 'price'">
        <v-table v-if="priceHistory.length" density="compact" class="ns-rows">
          <tbody>
            <tr v-for="h in priceHistory" :key="h.date">
              <td>{{ h.date }}</td>
              <td class="ns-num">{{ np(h.price) }}</td>
              <td
                class="ns-num"
                :class="h.change > 0 ? 'ns-up' : h.change < 0 ? 'ns-down' : ''"
              >
                <template v-if="h.change">{{ h.change > 0 ? '+' : '' }}{{ h.change.toLocaleString('en-US') }}</template>
              </td>
            </tr>
          </tbody>
        </v-table>
        <p v-else class="ns-empty">No price history.</p>
      </template>

      <!-- Regular Shop Wizard. Searches are limited, so this only runs when
           the tab is opened, and the result is reused for a while after. -->
      <template v-else-if="state.tab === 'wiz'">
        <div v-if="state.wiz.loading" class="ns-tp-loading">
          <v-progress-circular indeterminate size="22" width="2" />
          <span>Asking the Shop Wizard…</span>
        </div>

        <v-alert v-else-if="state.wiz.error" type="warning" variant="tonal" density="compact" class="ns-tp-error">
          <div>{{ state.wiz.error }}</div>
          <v-btn size="x-small" variant="text" class="mt-1" @click="retryWizard">Search again</v-btn>
        </v-alert>

        <template v-else-if="state.wiz.data">
          <div class="ns-tp-stats">
            <span>{{ state.wiz.data.listings.length }} shops</span>
            <span v-if="wizListings.length">cheapest {{ wizListings[0].priceText }}</span>
            <span class="ns-wiz-age">{{ searchedAgo }}</span>
          </div>
          <v-table v-if="wizListings.length" density="compact" class="ns-rows">
            <tbody>
              <tr v-for="s in wizListings" :key="s.owner + s.price">
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

      <!-- Super Shop Wizard: the same list the Shops popover shows -->
      <ShopsList v-else-if="state.tab === 'shops'" :limit="25" />

      <template v-else>
        <div v-if="state.tp.loading" class="ns-tp-loading">
          <v-progress-circular indeterminate size="22" width="2" />
          <span>Loading trading post history…</span>
        </div>

        <v-alert v-else-if="state.tp.error" type="warning" variant="tonal" density="compact" class="ns-tp-error">
          <div>{{ state.tp.error.text }}</div>
          <v-btn size="x-small" variant="text" class="mt-1" @click="retryTradingPost">Retry</v-btn>
        </v-alert>

        <template v-else-if="state.tp.data">
          <div class="ns-tp-stats">
            <span v-if="state.tp.data.lastSeen">last seen {{ state.tp.data.lastSeen }}</span>
            <span v-if="state.tp.data.uniqueOwners90d">{{ state.tp.data.uniqueOwners90d.toLocaleString('en-US') }} owners/90d</span>
            <span v-if="state.tp.data.appearances90d">{{ state.tp.data.appearances90d.toLocaleString('en-US') }} lots/90d</span>
          </div>

          <p v-if="!lots.length && state.tp.data.unavailableReason" class="ns-empty">
            {{ state.tp.data.unavailableReason }}
          </p>
          <v-table v-else-if="lots.length" density="compact" class="ns-rows">
            <tbody>
              <tr v-for="lot in lots" :key="lot.lot">
                <td>
                  {{ lot.date }}
                  <span v-if="lot.items > 1" class="ns-bundle" :title="`lot of ${lot.items} items`">×{{ lot.items }}</span>
                </td>
                <td class="ns-num">
                  <template v-if="lot.price !== null">{{ np(lot.price) }}</template>
                  <!-- Multi-item lots price the bundle, not this item. -->
                  <em v-else class="ns-noprice">bundle</em>
                </td>
                <td class="ns-owner">{{ lot.owner }}</td>
              </tr>
            </tbody>
          </v-table>
          <p v-else class="ns-empty">No trading post lots recorded.</p>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
.ns-tabs { min-height: 30px; border-bottom: 1px solid rgba(0, 0, 0, .12); }
.ns-tab {
  font-size: 11px; letter-spacing: 0; text-transform: none;
  min-width: 0 !important; padding: 0 14px; flex: 0 1 auto;
}

.ns-tab-window {
  /* v-card is a flex column, so without flex:none this collapses to its
     content height and the popover jumps between tabs. */
  flex: 0 0 auto;
  height: 168px;
  min-height: 168px;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.ns-rows { font-size: 11px; }
.ns-rows :deep(td) { height: 24px !important; padding: 0 8px !important; white-space: nowrap; }
.ns-num { text-align: right; font-variant-numeric: tabular-nums; }
.ns-up { color: #2e7d32; }
.ns-down { color: #c62828; }
.ns-owner { text-align: right; opacity: .55; font-size: 10px; }
.ns-shop-owner { max-width: 150px; overflow: hidden; text-overflow: ellipsis; }
.ns-shop-owner a { color: inherit; }
.ns-shop-stock { opacity: .55; font-size: 10px; }
.ns-wiz-age { margin-left: auto; }
.ns-noprice { opacity: .5; font-size: 10px; }
.ns-bundle {
  font-size: 9px; opacity: .6; border: 1px solid currentColor;
  border-radius: 3px; padding: 0 2px; margin-left: 3px;
}

.ns-tp-stats {
  display: flex; flex-wrap: wrap; gap: 8px;
  font-size: 10px; opacity: .65; padding: 6px 8px 2px;
}
.ns-tp-loading {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 40px 0; font-size: 11px; opacity: .7;
}
.ns-tp-error { margin: 8px; font-size: 11px; }
.ns-empty { font-size: 11px; opacity: .6; padding: 16px 8px; text-align: center; }
</style>
