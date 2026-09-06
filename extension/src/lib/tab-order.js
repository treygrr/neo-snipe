// The order of the tabs in the panel and in the price popover.
//
// The stored order covers every tab the build knows about, not just the ones
// currently on screen. That matters because the SSW tab is hidden without
// Premium: reordering the three visible tabs must not lose where the fourth
// sat, or turning Premium back on would drop it somewhere arbitrary.

export const PANEL_TABS = ['favourites', 'dailies', 'foodclub'];
export const POPOVER_TABS = ['price', 'tp', 'wiz', 'shops'];

/**
 * A stored order, repaired against what this build actually has.
 *
 * Ids the build no longer knows are dropped, and a tab added by a later
 * version is inserted where it was declared rather than shoved to the end —
 * so a new tab appears in a sensible place for someone who reordered months
 * ago, instead of always last.
 */
export function fullOrder(saved, known) {
  const valid = new Set(known);
  const order = (Array.isArray(saved) ? saved : []).filter(
    (id, i, all) => valid.has(id) && all.indexOf(id) === i,
  );

  const present = new Set(order);
  known.forEach((id, i) => {
    if (present.has(id)) return;
    order.splice(Math.min(i, order.length), 0, id);
  });

  return order;
}

/** What to actually render: the stored order, minus anything hidden. */
export const visibleOrder = (order, available) => order.filter((id) => available.includes(id));

/**
 * Moves a tab from one visible slot to another, returning a new full order.
 *
 * The move is expressed against the visible list because that is what was
 * dragged, but applied to the full one, which keeps hidden tabs pinned
 * relative to their neighbours.
 */
export function moveInOrder(order, available, from, to) {
  const visible = visibleOrder(order, available);
  if (from === to) return null;
  if (from < 0 || to < 0 || from >= visible.length || to >= visible.length) return null;

  const moving = visible[from];
  const landOn = visible[to];

  const next = order.filter((id) => id !== moving);
  const at = next.indexOf(landOn);
  next.splice(from < to ? at + 1 : at, 0, moving);
  return next;
}
