<script setup>
// A second popover, opened from the item popover's Super Wiz button. It shares
// state.ssw with the Shops tab, so opening one after the other costs no extra
// request.
import { computed } from 'vue';
import { mdiClose } from '@mdi/js';
import { state, closeShops } from './store.js';
import ShopsList from './ShopsList.vue';

defineProps({ attach: { type: [Object, String, Boolean], default: false } });

const open = computed({
  get: () => state.shops.open,
  set: (v) => { if (!v) closeShops(); },
});
</script>

<template>
  <v-menu
    v-model="open"
    :target="state.shops.anchor"
    :attach="attach"
    :close-on-content-click="false"
    location="bottom end"
    offset="6"
    max-width="360"
    :min-width="0"
  >
    <v-card class="ns-shops-card" elevation="10" width="360">
      <div class="ns-shops-head">
        <span class="ns-shops-title">Super Shop Wizard</span>
        <span v-if="state.data?.name" class="ns-shops-item">{{ state.data.name }}</span>
        <v-spacer />
        <v-btn :icon="mdiClose" size="x-small" variant="text" aria-label="Close" @click="closeShops" />
      </div>
      <div class="ns-shops-body">
        <ShopsList :limit="40" />
      </div>
    </v-card>
  </v-menu>
</template>

<style scoped>
.ns-shops-card { display: flex; flex-direction: column; }
.ns-shops-head {
  display: flex; align-items: baseline; gap: 6px;
  padding: 7px 6px 7px 12px; border-bottom: 1px solid rgba(0, 0, 0, .12);
}
.ns-shops-title { font-weight: 600; font-size: 12px; }
.ns-shops-item { font-size: 10.5px; opacity: .6; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
/* Fixed height so it does not jump between loading, error and results. */
.ns-shops-body { flex: 0 0 auto; height: 300px; overflow-y: auto; overscroll-behavior: contain; }
</style>
