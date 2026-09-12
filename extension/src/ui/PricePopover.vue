<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { mdiRefresh, mdiDragHorizontalVariant } from '@mdi/js';
import { state, retry, close, setPopoverPos } from './store.js';
import { startDrag, clamp } from '../lib/positions.js';
import PriceCard from './PriceCard.vue';
import HistoryTabs from './HistoryTabs.vue';

defineProps({ attach: { type: [Object, String, Boolean], default: false } });

// Bound to the v-menu as well, so the drag maths below cannot drift from it.
const OFFSET = 6;
// Vuetify's connected location strategy keeps overlays this far inside the
// window itself. Clamping to the same figure means our idea of where the card
// has landed matches where it actually lands.
const VIEWPORT_MARGIN = 12;

const open = computed({
  get: () => state.open,
  set: (v) => { if (!v) close(); },
});

const card = ref(null);
const cardEl = () => card.value?.$el ?? card.value;
const dragging = ref(false);

// v-menu takes either the badge element or a bare [x, y] point. Dragging
// switches to the point, after which the card stops tracking the badge.
const target = computed(() => (
  state.popoverPos ? [state.popoverPos.x, state.popoverPos.y] : state.anchor
));

/**
 * The target point that puts the card's top-left corner at `topLeft`.
 *
 * Given a bare point rather than an element, Vuetify drops the card's left
 * edge on it and its top an offset below — whatever the location prop says,
 * since a point has no sides to align `end` against. The e2e drag check
 * asserts the resulting movement exactly, so a Vuetify upgrade that changed
 * this would fail rather than quietly send the card somewhere else.
 *
 * Placing it this way also settles the one case the maths cannot see: a card
 * Vuetify had flipped above its badge is described here by where it actually
 * is, and stays there, because we only ever ask for positions that fit.
 */
const pointFor = (topLeft) => ({ x: topLeft.x, y: topLeft.y - OFFSET });

function onGripPointerDown(event) {
  if (event.button !== 0) return;
  const el = cardEl();
  if (!el) return;

  const rect = el.getBoundingClientRect();
  const size = { width: rect.width, height: rect.height };

  startDrag(event, {
    origin: { x: rect.left, y: rect.top },
    onMove: (topLeft) => {
      dragging.value = true;
      setPopoverPos(pointFor(clamp(topLeft, size, VIEWPORT_MARGIN)));
    },
    onEnd: () => { dragging.value = false; },
  });
}

/**
 * A popover opens while it is still just a spinner, so there is room for it
 * below a badge near the foot of the page; by the time the price and the tabs
 * have rendered there is not, and on a page too short to scroll the overflow
 * is simply unreachable. Re-clamping whenever the card changes size keeps it
 * on screen without moving one that already fits.
 */
function keepOnScreen() {
  if (dragging.value || !state.open) return;
  const el = cardEl();
  if (!el) return;

  const rect = el.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  const size = { width: rect.width, height: rect.height };
  const fitted = clamp({ x: rect.left, y: rect.top }, size, VIEWPORT_MARGIN);
  if (Math.abs(fitted.x - rect.left) < 1 && Math.abs(fitted.y - rect.top) < 1) return;

  setPopoverPos(pointFor(fitted));
}

// Watching the size rather than the individual slices catches every way the
// card can grow: the lookup landing, a tab switching, a tab's own fetch
// arriving. Re-clamping changes position, never size, so this cannot loop.
let observer = null;
watch(() => state.open, (isOpen) => {
  observer?.disconnect();
  observer = null;
  if (!isOpen) return;
  nextTick(() => {
    const el = cardEl();
    if (!el) return;
    observer = new ResizeObserver(keepOnScreen);
    observer.observe(el);
  });
});

onMounted(() => window.addEventListener('resize', keepOnScreen));
onBeforeUnmount(() => {
  observer?.disconnect();
  window.removeEventListener('resize', keepOnScreen);
});
</script>

<template>
  <div>
    <v-menu
      v-model="open"
      :target="target"
      :attach="attach"
      :close-on-content-click="false"
      location="bottom end"
      :offset="OFFSET"
      max-width="340"
      :min-width="0"
    >
      <v-card ref="card" class="ns-popover" elevation="8" width="340">
        <!-- The popover has no title bar, so this slim strip is the handle.
             It stays put while the rest of a tall card scrolls under it. -->
        <div
          class="ns-grip"
          :class="{ 'ns-grip--dragging': dragging }"
          title="Drag to move"
          @pointerdown="onGripPointerDown"
        >
          <v-icon :icon="mdiDragHorizontalVariant" size="16" />
        </div>

        <v-card-text class="ns-body">
          <div v-if="state.loading" class="ns-center">
            <v-progress-circular indeterminate size="28" width="3" />
            <div class="ns-loading-label">
              {{ state.refreshing ? 'Refreshing' : 'Looking up' }} {{ state.item?.name }}…
            </div>
          </div>

          <v-alert v-else-if="state.error" type="warning" variant="tonal" density="compact">
            <div>{{ state.error.text }}</div>
            <div v-if="state.error.detail" class="ns-detail">{{ state.error.detail }}</div>
          </v-alert>

          <PriceCard v-else-if="state.data" :data="state.data" />
        </v-card-text>

        <HistoryTabs v-if="state.data && !state.loading" :data="state.data" />
        <!-- The title links to Jelly Neo and the heart sits beside it, so the
             only action left here is retrying a failure. -->
        <v-card-actions v-if="state.error && !state.loading" class="ns-actions">
          <v-btn size="small" variant="text" :prepend-icon="mdiRefresh" @click="retry">Retry</v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<style scoped>
/* Never taller than the window: past that, clamping alone cannot keep the
   whole card reachable, so the overflow has to scroll instead. */
.ns-popover { max-height: calc(100vh - 24px); overflow-y: auto; }

.ns-grip {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 16px;
  cursor: grab;
  opacity: .35;
  background: rgb(var(--v-theme-surface));
  touch-action: none;
}
.ns-grip:hover { opacity: .7; }
.ns-grip--dragging { cursor: grabbing; opacity: .7; }

.ns-body { padding: 4px 14px 4px; }
.ns-center { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 14px 0; }
.ns-loading-label { font-size: 12px; opacity: .7; text-align: center; }
.ns-detail { font-size: 11px; opacity: .75; margin-top: 4px; word-break: break-word; }
.ns-actions { padding: 0 8px 6px; min-height: 0; }

</style>
