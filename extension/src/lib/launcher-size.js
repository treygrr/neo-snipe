// How big the bar's icons are. Sizes go in steps rather than pixels, so a synced
// or imported value can only ever be one of a few sizes that lay out properly:
// step 1 is 20px, and each step up to 5 adds 4px, to 36px. The horizontal and
// vertical bars each keep their own step.
export const ICON_STEPS = 5;
export const ICON_BASE_PX = 20;
export const ICON_STEP_PX = 4;

// The sizes each bar shipped with before they could be changed: the horizontal
// bar's 20px glyphs, and the vertical bar's bigger 32px ones.
export const DEFAULT_ICON_STEP = { horizontal: 1, vertical: 4 };

/** A step as a whole number from 1 to ICON_STEPS, or `fallback`. */
export const cleanIconStep = (value, fallback) => (
  Number.isInteger(value) && value >= 1 && value <= ICON_STEPS ? value : fallback
);

/** The glyph size a step draws, in px. */
export const iconPx = (step) => ICON_BASE_PX + ICON_STEP_PX * (step - 1);
