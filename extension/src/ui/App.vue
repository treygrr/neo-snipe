<script setup>
// One shadow-root app holding both surfaces: the price popover anchored to a
// badge, and the bottom-right panel.
import PricePopover from './PricePopover.vue';
import ShopsPopover from './ShopsPopover.vue';
import Panel from './Panel.vue';

defineProps({ attach: { type: [Object, String, Boolean], default: false } });
</script>

<template>
  <v-app>
    <Panel />
    <PricePopover :attach="attach" />
    <ShopsPopover :attach="attach" />
  </v-app>
</template>
