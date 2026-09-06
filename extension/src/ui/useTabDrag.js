import { ref } from 'vue';

/**
 * Drag-to-reorder for a tab strip, shared by the panel and the popover.
 *
 * HTML5 drag and drop rather than pointer events, to match how the favourites
 * lists already reorder — and because a tab is a button, so the browser's own
 * drag image is exactly the right thing to show.
 *
 * `move(from, to)` is called with visible indices. `enabled` is read on each
 * drag rather than captured, so turning the setting off takes effect at once.
 */
export function useTabDrag(move, enabled = () => true) {
  const dragging = ref(null);
  const over = ref(null);

  function onDragStart(event, index) {
    if (!enabled()) {
      event.preventDefault();
      return;
    }
    dragging.value = index;
    event.dataTransfer.effectAllowed = 'move';
    // Firefox refuses to start a drag without data set.
    event.dataTransfer.setData('text/plain', String(index));
  }

  function onDragOver(event, index) {
    if (dragging.value === null) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    over.value = index;
  }

  async function onDrop(index) {
    const from = dragging.value;
    onDragEnd();
    if (from !== null) await move(from, index);
  }

  function onDragEnd() {
    dragging.value = null;
    over.value = null;
  }

  return {
    dragging,
    over,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd,
    // A tab that was dragged then dropped fires a click; the caller uses this
    // to keep a reorder from also switching tabs.
    wasDragged: () => dragging.value !== null,
    isDragging: (i) => dragging.value === i,
    isOver: (i) => over.value === i && dragging.value !== i,
  };
}
