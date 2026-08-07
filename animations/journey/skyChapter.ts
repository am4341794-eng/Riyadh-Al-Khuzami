import type { SceneApi } from "@/hooks/useScene";
import { EASE } from "@/lib/easings";
import { forward } from "@/lib/constants";
import { JOURNEY } from "./timings";

/** Gradient stop colours for the flight: pre-dawn → mid-morning altitude. */
const SKY_STOPS = {
  from: ["#0f2140", "#2f6ea8", "#8fc4e8"],
  to: ["#1c4f86", "#6fb3e0", "#dff0fb"],
};

/**
 * Chapter 05 — the flight.
 *
 * Clouds are parallaxed by depth, the sky gradient is tweened stop-by-stop
 * rather than cross-faded (so the colour genuinely shifts instead of two skies
 * blending), and the aircraft holds a slow, weighted arc across frame.
 */
export function addSkyChapter(tl: gsap.core.Timeline, api: SceneApi) {
  const { one, select } = api;

  const skyAir = one('[data-sky="air"]');
  const skyAbstract = one('[data-sky="abstract"]');
  const cloudLayer = one("[data-cloud-layer]");
  const clouds = select("[data-cloud-wrap]");
  const stops = select('[data-sky-stop]');
  const vehicle = one("[data-vehicle]");
  const planeExtras = one("[data-plane-extras]");
  const haze = one("[data-haze]");

  const { start, end } = JOURNEY.flight;
  const span = end - start;

  /* --------------------------------------------------------- sky change */

  tl.to(skyAir, { opacity: 1, ease: EASE.softInOut, duration: span * 0.28 }, start)
    .to(
      skyAbstract,
      { opacity: 0, ease: EASE.softInOut, duration: span * 0.3 },
      start + span * 0.06,
    )
    .to(haze, { opacity: 0.05, ease: "none", duration: span * 0.4 }, start);

  // Tweening the gradient stops themselves keeps a single sky that changes,
  // which reads as the aircraft climbing into brighter air.
  stops.forEach((stop, index) => {
    const to = SKY_STOPS.to[index];
    if (!to) return;
    tl.to(
      stop,
      {
        attr: { "stop-color": to },
        ease: "none",
        duration: span * 0.85,
      },
      start + span * 0.1,
    );
  });

  /* ------------------------------------------------------------ clouds */

  tl.fromTo(
    cloudLayer,
    { opacity: 0 },
    { opacity: 1, ease: EASE.softOut, duration: span * 0.22 },
    start - 0.04,
  );

  clouds.forEach((cloud) => {
    const depth = Number(cloud.getAttribute("data-depth") ?? 0.5);
    // Near clouds travel much further — the parallax that sells speed and
    // altitude. The field is offset ahead of its rest position and ends behind
    // it, so clouds keep entering frame instead of all sweeping out at once.
    const distance = 320 + depth * 880;
    const rise = 30 + depth * 120;

    tl.fromTo(
      cloud,
      { x: forward(-distance * 0.6), y: rise * 0.5 },
      { x: forward(distance * 0.4), y: -rise, ease: "none", duration: span * 1.08 },
      start - 0.05,
    );
  });

  /* --------------------------------------------------- aircraft detail */

  // Mirrors the truck's extras: the silhouette resolves first, the detail
  // arrives after, so the morph itself stays clean.
  if (planeExtras) {
    tl.fromTo(
      planeExtras,
      { opacity: 0 },
      { opacity: 1, ease: EASE.softOut, duration: span * 0.16 },
      start - 0.02,
    );
  }

  /* ----------------------------------------------------------- flight */

  if (vehicle) {
    // Long, weighted arc: climb, level out, then bank away out of frame.
    tl.to(
      vehicle,
      {
        x: forward(200),
        y: -150,
        rotate: -2,
        ease: EASE.softInOut,
        duration: span * 0.34,
      },
      start,
    )
      .to(
        vehicle,
        {
          x: forward(280),
          y: -96,
          rotate: 1.2,
          ease: EASE.softInOut,
          duration: span * 0.34,
        },
        start + span * 0.34,
      )
      .to(
        vehicle,
        {
          x: forward(1500),
          y: -240,
          rotate: -4,
          scale: 0.82,
          ease: EASE.camera,
          duration: span * 0.34,
        },
        start + span * 0.66,
      );
  }
}
