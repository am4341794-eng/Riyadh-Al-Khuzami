/**
 * Named easing curves.
 *
 * Custom curves are registered once (see `registerGsap`) and referenced by
 * name everywhere else, so the motion language stays consistent across scenes.
 */

export const CUSTOM_EASES: Record<string, string> = {
  /** Long, confident settle — the house curve for entrances. */
  "brand.entrance": "M0,0 C0.16,1 0.3,1 1,1",
  /** Symmetric, weighty — used for camera moves and scene hand-offs. */
  "brand.camera": "M0,0 C0.83,0 0.17,1 1,1",
  /** Mechanical ramp with a touch of lead-in — vehicles, forks, wheels. */
  "brand.drive": "M0,0 C0.42,0 0.28,1 1,1",
  /** Slow start, quick finish — for reveals that should feel "snapped" home. */
  "brand.snap": "M0,0 C0.6,0 0.2,1 1,1",
  /** Barely-there float used by ambient particles and clouds. */
  "brand.float": "M0,0 C0.37,0 0.63,1 1,1",
};

export const EASE = {
  entrance: "brand.entrance",
  camera: "brand.camera",
  drive: "brand.drive",
  snap: "brand.snap",
  float: "brand.float",
  /** Built-ins that already read well; aliased for a single import surface. */
  linear: "none",
  softOut: "power2.out",
  softInOut: "power2.inOut",
  strongOut: "power3.out",
  expoOut: "expo.out",
} as const;

export type EaseName = (typeof EASE)[keyof typeof EASE];
