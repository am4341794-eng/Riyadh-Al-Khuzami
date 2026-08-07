/**
 * Global, framework-agnostic constants.
 * Keeping these in one place means a scene's timing can be re-tuned without
 * hunting through timeline files.
 */

/** Document writing direction. Every horizontal animation is authored against
 *  `DIRECTION_SIGN` so the whole site can be flipped to LTR by changing this. */
export const DIRECTION = "rtl" as const;
export const DIRECTION_SIGN = DIRECTION === "rtl" ? -1 : 1;

/** Multiply any "forward travel" value by this to move with the reading flow. */
export const forward = (value: number) => value * DIRECTION_SIGN;

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
  desktop: 1280,
} as const;

export const MEDIA = {
  mobile: `(max-width: ${BREAKPOINTS.mobile - 1}px)`,
  tablet: `(min-width: ${BREAKPOINTS.mobile}px) and (max-width: ${BREAKPOINTS.tablet - 1}px)`,
  desktop: `(min-width: ${BREAKPOINTS.tablet}px)`,
  touch: "(hover: none) and (pointer: coarse)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
} as const;

/** Lenis tuning. Duration/easing chosen to feel like weighted inertia rather
 *  than a lazy glide — long enough to smooth ScrollTrigger scrubs, short
 *  enough that motion visibly halts the moment the wheel stops. */
export const LENIS_OPTIONS = {
  duration: 1.05,
  lerp: 0.1,
  wheelMultiplier: 1,
  touchMultiplier: 1.6,
  smoothWheel: true,
  syncTouch: false,
} as const;

/**
 * Scrub value shared by every scene.
 * `true` binds playhead 1:1 to scroll, which is what the brief asks for —
 * animation halts the instant scrolling halts. The buttery feel comes from
 * Lenis easing the scroll position itself, not from scrub lag.
 */
export const SCRUB = true;

/** Slight scrub lag reserved for soft, non-mechanical accents (glow, blur). */
export const SCRUB_SOFT = 0.6;

export const SECTIONS = [
  { id: "hero", label: "البداية", index: "01" },
  { id: "logistics", label: "التجهيز", index: "02" },
  { id: "transport", label: "النقل", index: "03" },
  { id: "horizon", label: "التحوّل", index: "04" },
  { id: "sky", label: "الآفاق", index: "05" },
  { id: "figures", label: "الأرقام", index: "06" },
  { id: "contact", label: "التواصل", index: "07" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

/** Canonical viewBox for every scene SVG so morph targets share a coordinate
 *  space and layers can be parallaxed with comparable magnitudes. */
export const SCENE_VIEWBOX = { width: 1600, height: 900 } as const;
