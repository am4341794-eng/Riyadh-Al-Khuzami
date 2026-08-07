/**
 * Mutable bridge between GSAP timelines and the WebGL render loop.
 *
 * Scroll progress is written here by ScrollTrigger and read inside `useFrame`.
 * Passing it as React state instead would re-render the tree on every scroll
 * tick; a shared mutable object costs nothing and keeps the scrub at 60fps.
 */
export interface HeroSceneState {
  /** 0 → 1 across the hero's scroll range. */
  progress: number;
  /** 0 → 1 for the one-off entrance after the preloader lifts. */
  intro: number;
  /** Normalised pointer position, -1 → 1 on both axes. */
  pointerX: number;
  pointerY: number;
  /** Set by the canvas so timelines can request a frame on demand. */
  invalidate: (() => void) | null;
}

export const heroScene: HeroSceneState = {
  progress: 0,
  intro: 0,
  pointerX: 0,
  pointerY: 0,
  invalidate: null,
};

/** Requests a single WebGL frame. No-op before the canvas mounts. */
export function requestSceneFrame() {
  heroScene.invalidate?.();
}

export function resetHeroScene() {
  heroScene.progress = 0;
  heroScene.intro = 0;
  heroScene.pointerX = 0;
  heroScene.pointerY = 0;
}
