import type { SceneApi } from "@/hooks/useScene";
import { EASE } from "@/lib/easings";
import { JOURNEY } from "./timings";

/** Radius of the wheel silhouettes, from `lib/shapes`. */
const WHEEL_RADIUS = 62;
/** Distance the truck covers on screen, in viewBox units. */
const TRUCK_ENTRY_X = 1500;

/**
 * Rounds a raw rotation to a whole number of turns.
 * Landing on an exact multiple of 360° means the wheel transform can be reset
 * to zero before the morph without a single frame of visible snap-back.
 */
function wholeTurns(distance: number, radius: number): number {
  const raw = (distance / (2 * Math.PI * radius)) * 360;
  return Math.round(raw / 360) * 360;
}

/**
 * Chapter 03 — the drive.
 *
 * The truck covers ground for the first third, then holds centre frame while
 * the world keeps moving past it, so the vehicle is already parked in the
 * middle of the canvas when the morph takes over.
 */
export function addTruckChapter(tl: gsap.core.Timeline, api: SceneApi) {
  const { one } = api;

  const vehicle = one("[data-vehicle]");
  const shadow = one("[data-vehicle-shadow]");
  const headlight = one("[data-headlight]");
  const extras = one("[data-truck-extras]");
  const sun = one("[data-sun]");
  const haze = one("[data-haze]");
  const roadGroup = one("[data-road-group]");
  const dashes = one("[data-road-dashes]");
  const dashesNear = one("[data-road-dashes-near]");
  const pylons = one("[data-pylons]");
  const duneFar = one('[data-dune="far"]');
  const duneNear = one('[data-dune="near"]');
  const desert = one("[data-desert]");

  const frontWheel = one('[data-morph="front-rotor"]');
  const rearWheel = one('[data-morph="rear-rotor"]');
  const wheels = [frontWheel, rearWheel].filter(Boolean) as Element[];

  const { start, end } = JOURNEY.truck;
  const driveDuration = (end - start) * 0.78;

  /* ------------------------------------------------------------- approach */

  tl.fromTo(
    vehicle,
    { x: TRUCK_ENTRY_X, y: 0 },
    { x: 0, ease: EASE.drive, duration: driveDuration },
    start,
  );

  // Wheels roll the real distance, rounded to whole turns.
  tl.fromTo(
    wheels,
    { rotate: 0, transformOrigin: "50% 50%" },
    {
      rotate: -wholeTurns(TRUCK_ENTRY_X, WHEEL_RADIUS),
      ease: EASE.drive,
      duration: driveDuration,
      transformOrigin: "50% 50%",
    },
    start,
  );

  // They keep turning while the truck holds centre and the world slides by.
  tl.to(
    wheels,
    {
      rotate: `-=${wholeTurns(1100, WHEEL_RADIUS)}`,
      ease: "none",
      duration: end - start - driveDuration,
      transformOrigin: "50% 50%",
    },
    start + driveDuration,
  );

  // Suspension: three short settles rather than a loop, so it is pure scroll.
  tl.to(vehicle, { y: -6, duration: 0.05, ease: "sine.inOut" }, start + 0.08)
    .to(vehicle, { y: 0, duration: 0.05, ease: "sine.inOut" }, start + 0.13)
    .to(vehicle, { y: -4, duration: 0.04, ease: "sine.inOut" }, start + 0.2)
    .to(vehicle, { y: 0, duration: 0.04, ease: "sine.inOut" }, start + 0.24);

  /* ------------------------------------------------- world moving past */

  const world = end - start;

  tl.fromTo(dashes, { x: 240 }, { x: -1680, ease: "none", duration: world }, start)
    .fromTo(dashesNear, { x: 400 }, { x: -2600, ease: "none", duration: world }, start)
    .fromTo(pylons, { x: 320 }, { x: -1180, ease: "none", duration: world }, start)
    .fromTo(duneNear, { x: 120 }, { x: -430, ease: "none", duration: world }, start)
    .fromTo(duneFar, { x: 60 }, { x: -190, ease: "none", duration: world }, start);

  /* ------------------------------------------------- light and shadow */

  // The sun sinks across the chapter: shadow stretches, colour warms, the
  // headlight wash comes up as the ambient falls away.
  if (sun) {
    tl.fromTo(
      sun,
      { y: -70, scale: 1.06, transformOrigin: "50% 50%", opacity: 0.8 },
      { y: 46, scale: 0.9, opacity: 1, ease: "none", duration: world },
      start,
    );
  }

  if (shadow) {
    tl.fromTo(
      shadow,
      { scaleX: 0.86, scaleY: 1, opacity: 0.62, transformOrigin: "50% 50%" },
      { scaleX: 1.32, scaleY: 0.72, opacity: 0.34, ease: "none", duration: world },
      start,
    );
  }

  if (headlight) {
    tl.fromTo(
      headlight,
      { opacity: 0, scaleX: 0.7, transformOrigin: "100% 50%" },
      { opacity: 0.5, scaleX: 1, ease: EASE.softOut, duration: world * 0.7 },
      start + world * 0.25,
    );
  }

  if (haze) {
    tl.fromTo(
      haze,
      { opacity: 0.04 },
      { opacity: 0.17, ease: "none", duration: world },
      start,
    );
  }

  /* -------------------------------------------- dissolve before the morph */

  // Details go first, so the silhouette that morphs is clean and readable.
  tl.to(
    extras,
    { opacity: 0, ease: EASE.softInOut, duration: 0.09 },
    JOURNEY.toRibbons.start - 0.02,
  )
    .to(
      [shadow, headlight],
      { opacity: 0, ease: EASE.softInOut, duration: 0.08 },
      JOURNEY.toRibbons.start + 0.02,
    )
    .to(
      [roadGroup, desert],
      { opacity: 0, y: 70, ease: EASE.softInOut, duration: 0.13 },
      JOURNEY.toRibbons.start + 0.01,
    );

  // Wheels stop turning exactly when the shape starts changing.
  tl.set(wheels, { rotate: 0, transformOrigin: "50% 50%" }, JOURNEY.toRibbons.start);
}
