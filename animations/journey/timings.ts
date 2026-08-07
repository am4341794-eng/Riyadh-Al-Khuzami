/**
 * The journey is a single timeline shared by three chapters. Their boundaries
 * live here so the hand-offs always overlap — a chapter starts fading in while
 * the previous one is still moving, which is what removes the cut.
 *
 * Values are positions on a 0 → 1 master timeline.
 */
export const JOURNEY = {
  truck: { start: 0, end: 0.36 },
  /** Truck silhouette dissolving into ribbons. */
  toRibbons: { start: 0.32, end: 0.5 },
  /** Ribbons resolving into the aircraft. */
  toPlane: { start: 0.5, end: 0.66 },
  flight: { start: 0.62, end: 1 },
} as const;

/** Per-element stagger used by both morph passes, in timeline units. */
export const MORPH_STAGGER = 0.014;
