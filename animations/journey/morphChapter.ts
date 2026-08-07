import { gsap } from "@/lib/gsap";
import type { SceneApi } from "@/hooks/useScene";
import { EASE } from "@/lib/easings";
import { MORPH_PARTS } from "@/lib/shapes";
import { JOURNEY, MORPH_STAGGER } from "./timings";

/** MorphSVGPlugin extends TweenVars at runtime; declare the slice we use. */
type MorphVars = gsap.TweenVars & {
  morphSVG?: { shape: string; shapeIndex?: number | "auto" };
};

/**
 * Chapter 04 — the transformation.
 *
 * Not a cross-fade: the same six `<path>` elements are re-shaped twice, truck →
 * ribbon → aircraft, with their fills tweened on the identical window. At any
 * scroll position the screen shows one set of shapes mid-interpolation, so
 * there is never a frame where two illustrations coexist.
 */
export function addMorphChapter(tl: gsap.core.Timeline, api: SceneApi) {
  const { one, select } = api;

  const skyAbstract = one('[data-sky="abstract"]');
  const skyDesert = one('[data-sky="desert"]');
  const bloomGroup = one("[data-ribbon-bloom]");
  const streakGroup = one("[data-streaks]");
  const streaks = select("[data-streak]");
  const vehicle = one("[data-vehicle]");
  const sun = one("[data-sun]");

  const toRibbons = JOURNEY.toRibbons;
  const toPlane = JOURNEY.toPlane;
  const ribbonSpan = toRibbons.end - toRibbons.start;
  const planeSpan = toPlane.end - toPlane.start;

  /* ------------------------------------------------------ backdrop swap */

  tl.to(
    skyAbstract,
    { opacity: 1, ease: EASE.softInOut, duration: ribbonSpan * 0.9 },
    toRibbons.start,
  )
    .to(
      skyDesert,
      { opacity: 0, ease: EASE.softInOut, duration: ribbonSpan * 0.9 },
      toRibbons.start + 0.02,
    )
    .to(sun, { opacity: 0, ease: "none", duration: 0.1 }, toRibbons.start);

  /* --------------------------------------------------- motion streaks */

  tl.to(
    streakGroup,
    { opacity: 1, ease: EASE.softOut, duration: 0.08 },
    toRibbons.start,
  ).to(
    streakGroup,
    { opacity: 0, ease: EASE.softInOut, duration: 0.1 },
    toPlane.end - 0.08,
  );

  streaks.forEach((streak, index) => {
    const speed = 900 + ((index * 173) % 1500);
    tl.fromTo(
      streak,
      { x: speed * 0.55, scaleX: 0.4, transformOrigin: "50% 50%" },
      { x: -speed, scaleX: 1.9, ease: "none", duration: toPlane.end - toRibbons.start },
      toRibbons.start,
    );
  });

  /* ------------------------------------------------ truck → ribbons */

  MORPH_PARTS.forEach((part, index) => {
    const target = one(`[data-morph="${part.id}"]`);
    if (!target) return;

    const at = toRibbons.start + index * MORPH_STAGGER;
    const duration = ribbonSpan - MORPH_STAGGER * (MORPH_PARTS.length - 1);

    tl.to(
      target,
      {
        morphSVG: { shape: part.stages.ribbon, shapeIndex: "auto" },
        fill: part.fill.ribbon,
        opacity: part.opacity.ribbon,
        ease: EASE.camera,
        duration,
      } as MorphVars,
      at,
    );
  });

  /* ------------------------------------------------ ribbons → aircraft */

  MORPH_PARTS.forEach((part, index) => {
    const target = one(`[data-morph="${part.id}"]`);
    if (!target) return;

    // Reverse the stagger order so the aircraft assembles nose-first.
    const reverseIndex = MORPH_PARTS.length - 1 - index;
    const at = toPlane.start + reverseIndex * MORPH_STAGGER;
    const duration = planeSpan - MORPH_STAGGER * (MORPH_PARTS.length - 1);

    tl.to(
      target,
      {
        morphSVG: { shape: part.stages.plane, shapeIndex: "auto" },
        fill: part.fill.plane,
        opacity: part.opacity.plane,
        ease: EASE.camera,
        duration,
      } as MorphVars,
      at,
    );
  });

  /* ------------------------------------------------------ ribbon bloom */

  // A blurred copy of the ribbon shapes swells while the forms are abstract,
  // then retreats — this is what makes the middle of the morph feel like light
  // rather than like geometry.
  if (bloomGroup) {
    tl.fromTo(
      bloomGroup,
      { opacity: 0, scale: 0.94, transformOrigin: "50% 50%" },
      { opacity: 0.85, scale: 1.04, ease: EASE.softOut, duration: ribbonSpan * 0.8 },
      toRibbons.start + 0.02,
    ).to(
      bloomGroup,
      { opacity: 0, scale: 1.12, ease: EASE.softInOut, duration: planeSpan * 0.8 },
      toPlane.start,
    );

    MORPH_PARTS.forEach((part, index) => {
      const bloom = one(`[data-bloom="${part.id}"]`);
      if (!bloom) return;
      tl.to(
        bloom,
        {
          morphSVG: { shape: part.stages.plane, shapeIndex: "auto" },
          fill: part.fill.plane,
          ease: EASE.camera,
          duration: planeSpan,
        } as MorphVars,
        toPlane.start + index * MORPH_STAGGER * 0.5,
      );
    });
  }

  /* ------------------------------------------------------- take-off arc */

  // The group lifts and banks as the aircraft resolves — the reason the plane
  // never appears to "pop" into a new position.
  if (vehicle) {
    tl.to(
      vehicle,
      {
        y: -110,
        scale: 0.94,
        rotate: -3.5,
        transformOrigin: "50% 60%",
        ease: EASE.camera,
        duration: toPlane.end - toRibbons.start,
      },
      toRibbons.start,
    );
  }

  // Keep a hard reference so tree-shaking never drops the plugin import.
  void gsap;
}
