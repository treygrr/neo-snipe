<script setup>
import { computed } from 'vue';

const props = defineProps({ data: { type: Object, required: true } });

const np = (n) => (n === null || n === undefined ? '—' : `${n.toLocaleString('en-US')} NP`);
const rarityColor = computed(() => {
  const r = props.data.rarity;
  if (r === null || r === undefined) return 'grey';
  if (r >= 180) return 'deep-purple';
  if (r >= 100) return 'red';
  if (r >= 90) return 'orange';
  if (r >= 80) return 'blue';
  return 'grey';
});
</script>

<template>
  <div class="ns-card">
    <div class="ns-head">
      <img v-if="data.imageUrl" :src="data.imageUrl" :alt="data.name" class="ns-img">
      <div class="ns-head-text">
        <div class="ns-name">{{ data.name }}</div>
        <div class="ns-chips">
          <v-chip v-if="data.rarity !== null" size="x-small" :color="rarityColor" variant="flat">
            r{{ data.rarity }}<span v-if="data.rarityLabel">&nbsp;{{ data.rarityLabel }}</span>
          </v-chip>
          <v-chip v-if="data.category" size="x-small" variant="tonal">{{ data.category }}</v-chip>
        </div>
      </div>
    </div>

    <div class="ns-price">
      <div class="ns-price-value">{{ data.priceText || np(data.estimatedPrice) }}</div>
      <div class="ns-price-date">
        <template v-if="data.priceAsOf">as of {{ data.priceAsOf }}</template>
        <template v-else>no dated price</template>
      </div>
    </div>

    <p v-if="data.description" class="ns-desc">{{ data.description }}</p>

    <div class="ns-meta">
      <span v-if="data.neopetsEstValue">NP est. value {{ np(data.neopetsEstValue) }}</span>
      <span v-if="data.cached" class="ns-cached">cached</span>
    </div>
  </div>
</template>

<style scoped>
.ns-head { display: flex; gap: 10px; align-items: center; }
.ns-img { width: 48px; height: 48px; object-fit: contain; flex: 0 0 auto; }
.ns-head-text { min-width: 0; }
.ns-name { font-weight: 600; font-size: 14px; line-height: 1.25; }
.ns-chips { display: flex; gap: 4px; margin-top: 4px; flex-wrap: wrap; }
.ns-price { margin: 10px 0 6px; }
.ns-price-value { font-size: 20px; font-weight: 700; line-height: 1.1; }
.ns-price-date { font-size: 11px; opacity: .65; }
.ns-desc { font-size: 11.5px; opacity: .8; margin: 0 0 8px; font-style: italic; }
.ns-meta {
  display: flex; justify-content: space-between; gap: 8px;
  font-size: 10.5px; opacity: .6; margin-top: 8px;
}
.ns-cached { font-style: italic; }
</style>
