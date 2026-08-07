import { gsap } from "@/lib/gsap";
import { EASE } from "@/lib/easings";
import type { SceneApi } from "@/hooks/useScene";

/* -------------------------------------------------------------------------- */
/* Scene geometry — every number the choreography depends on lives here so the  */
/* illustration and the motion can never drift apart.                          */
/* -------------------------------------------------------------------------- */

const FLOOR_Y = 700;
/** Forklift resting position, off the right edge of the viewBox. */
const FORKLIFT_START_X = 1900;
/** Where the forks slide under the pallet. */
const FORKLIFT_PICK_X = 528;
/** Off the left edge, carrying the load. */
const FORKLIFT_EXIT_X = -460;
const CARGO_START_X = 300;
/** Vertical travel of the fork carriage. */
const LIFT_HEIGHT = 196;

const FRONT_WHEEL_RADIUS = 40;
const REAR_WHEEL_RADIUS = 32;

/** Degrees of wheel rotation for a given travel distance — real rolling, not
 *  an arbitrary spin. Travelling left (negative Δx) rolls counter-clockwise. */
const rollDegrees = (distance: number, radius: number) =>
  (distance / (2 * Math.PI * radius)) * 360;

const APPROACH_DISTANCE = FORKLIFT_PICK_X - FORKLIFT_START_X; // negative
const CARRY_DISTANCE = FORKLIFT_EXIT_X - FORKLIFT_PICK_X; // negative

/**
 * Logistics chapter: the load leaves the warehouse.
 *
 * The whole sequence is one scrubbed timeline. Because the cargo and the fork
 * carriage share identical tween windows and easings, the pallet stays locked
 * to the forks at any playhead position — including when the visitor scrolls
 * backwards through the pick-up.
 */
export function createLogisticsTimeline(api: SceneApi) {
  const { one, select, timeline, viewport, reduced } = api;

  const camera = one("[data-camera]");
  const forklift = one("[data-forklift]");
  const carriage = one("[data-carriage]");
  const cargo = one("[data-cargo]");
  const cargoShadow = one("[data-cargo-shadow]");
  const forkliftShadow = one("[data-forklift-shadow]");
  const frontWheel = one("[data-wheel-front]");
  const rearWheel = one("[data-wheel-rear]");
  const trolley = one("[data-trolley]");
  const beacon = one("[data-beacon]");
  const beaconGlow = one("[data-beacon-glow]");

  const shafts = select("[data-shaft]");
  const motes = select("[data-mote]");
  const rackPallets = select("[data-rack-pallet]");
  const floorLines = select("[data-floor-line]");
  const windows = select("[data-window]");
  const farLayer = one('[data-layer="far"]');
  const rackLayer = one('[data-layer="rack"]');
  const nearLayer = one('[data-layer="near"]');
  const copy = one("[data-copy]");
  const notes = select("[data-note]");
  const veil = one("[data-veil]");

  if (!forklift || !cargo) return;

  /* ------------------------------------------------------ resting state */

  gsap.set(forklift, { x: FORKLIFT_START_X, y: FLOOR_Y });
  gsap.set(cargo, { x: CARGO_START_X, y: FLOOR_Y });
  gsap.set(carriage, { y: 0 });
  gsap.set([frontWheel, rearWheel], { transformOrigin: "50% 50%", rotate: 0 });
  gsap.set(shafts, { opacity: 0 });
  gsap.set(trolley, { x: 260 });

  if (reduced) {
    // Show the finished tableau: load on the forks, mid-floor.
    gsap.set(forklift, { x: 620 });
    gsap.set(cargo, { x: 392, y: FLOOR_Y - LIFT_HEIGHT });
    gsap.set(carriage, { y: -LIFT_HEIGHT });
    gsap.set(shafts, { opacity: 1 });
    gsap.set([copy, ...notes], { autoAlpha: 1, y: 0 });
    return;
  }

  const tl = timeline();

  /* ------------------------------------------------------------- camera */

  tl.fromTo(
    camera,
    { scale: viewport.isMobile ? 1.18 : 1.2, yPercent: 4, xPercent: 0 },
    { scale: viewport.isMobile ? 1.08 : 1.06, yPercent: 0, xPercent: 0, ease: EASE.camera },
    0,
  ).to(
    camera,
    { scale: viewport.isMobile ? 1.16 : 1.16, yPercent: -4, ease: EASE.camera },
    0.68,
  );

  /* ---------------------------------------------------- environment in */

  tl.to(shafts, { opacity: 1, stagger: 0.03, ease: EASE.softOut, duration: 0.25 }, 0.02)
    .fromTo(
      windows,
      { opacity: 0.05 },
      { opacity: 0.3, stagger: 0.02, ease: "none", duration: 0.3 },
      0.02,
    )
    .fromTo(
      rackPallets,
      { autoAlpha: 0, y: -26 },
      { autoAlpha: 1, y: 0, stagger: 0.04, ease: EASE.entrance, duration: 0.3 },
      0.04,
    );

  // Depth: layers travel at different rates across the whole chapter.
  tl.fromTo(farLayer, { x: 60 }, { x: -60, ease: "none" }, 0)
    .fromTo(rackLayer, { x: 190 }, { x: -230, ease: "none" }, 0)
    .fromTo(nearLayer, { x: -60 }, { x: 70, ease: "none" }, 0)
    .fromTo(
      floorLines,
      { x: 240 },
      { x: -320, ease: "none", stagger: { each: 0.01, from: "start" } },
      0,
    );

  // Dust drifts with the scroll — motion only ever while scrolling.
  motes.forEach((mote, index) => {
    const drift = 40 + ((index * 37) % 120);
    tl.fromTo(
      mote,
      { x: drift * 0.6, y: drift * 0.2, opacity: 0.08 },
      { x: -drift, y: -drift * 0.75, opacity: 0.34, ease: "none" },
      0,
    );
  });

  /* ------------------------------------------------------------- copy */

  if (copy) {
    tl.fromTo(
      copy,
      { autoAlpha: 0, y: 46 },
      { autoAlpha: 1, y: 0, ease: EASE.entrance, duration: 0.16 },
      0.04,
    )
      .fromTo(
        notes,
        { autoAlpha: 0, x: 30 },
        { autoAlpha: 1, x: 0, stagger: 0.03, ease: EASE.entrance, duration: 0.14 },
        0.1,
      )
      .to(copy, { autoAlpha: 0, y: -50, ease: EASE.softInOut, duration: 0.16 }, 0.8);
  }

  /* -------------------------------------------------- forklift approach */

  tl.to(
    forklift,
    { x: FORKLIFT_PICK_X, ease: EASE.drive, duration: 0.3 },
    0.06,
  )
    .to(
      [frontWheel, rearWheel],
      {
        rotate: (i: number) =>
          rollDegrees(
            APPROACH_DISTANCE,
            i === 0 ? FRONT_WHEEL_RADIUS : REAR_WHEEL_RADIUS,
          ),
        ease: EASE.drive,
        duration: 0.3,
      },
      0.06,
    )
    // Suspension settle as it comes to a stop.
    .to(forklift, { y: FLOOR_Y + 5, duration: 0.03, ease: "power2.out" }, 0.33)
    .to(forklift, { y: FLOOR_Y, duration: 0.05, ease: "power2.inOut" }, 0.36);

  /* -------------------------------------------------------------- lift */

  const liftStart = 0.42;
  const liftDuration = 0.14;

  tl.to(
    carriage,
    { y: -LIFT_HEIGHT, ease: EASE.drive, duration: liftDuration },
    liftStart,
  )
    .to(
      cargo,
      { y: FLOOR_Y - LIFT_HEIGHT, ease: EASE.drive, duration: liftDuration },
      liftStart,
    )
    // Load shadow shrinks and softens as the pallet leaves the ground.
    .to(
      cargoShadow,
      { scaleX: 0.62, opacity: 0.22, transformOrigin: "50% 50%", duration: liftDuration, ease: EASE.drive },
      liftStart,
    )
    // Chassis squats under the load.
    .to(forklift, { y: FLOOR_Y + 4, duration: 0.04, ease: "power2.out" }, liftStart)
    .to(forklift, { y: FLOOR_Y, duration: 0.06, ease: "power2.inOut" }, liftStart + 0.06);

  /* ------------------------------------------------------------- carry */

  const carryStart = 0.58;
  const carryDuration = 0.26;

  tl.to(
    forklift,
    { x: FORKLIFT_EXIT_X, ease: EASE.drive, duration: carryDuration },
    carryStart,
  )
    .to(
      cargo,
      { x: CARGO_START_X + CARRY_DISTANCE, ease: EASE.drive, duration: carryDuration },
      carryStart,
    )
    .to(
      [frontWheel, rearWheel],
      {
        rotate: (i: number) =>
          rollDegrees(
            APPROACH_DISTANCE + CARRY_DISTANCE,
            i === 0 ? FRONT_WHEEL_RADIUS : REAR_WHEEL_RADIUS,
          ),
        ease: EASE.drive,
        duration: carryDuration,
      },
      carryStart,
    )
    .to(
      [cargoShadow, forkliftShadow],
      { opacity: 0.1, duration: carryDuration, ease: "none" },
      carryStart,
    );

  /* --------------------------------------------------- ambient machinery */

  tl.to(trolley, { x: 1340, ease: EASE.softInOut }, 0.1);

  if (beacon && beaconGlow) {
    // Beacon pulse is driven by scroll distance, not a clock.
    tl.to(
      [beacon, beaconGlow],
      { opacity: 0.15, duration: 0.05, repeat: 11, yoyo: true, ease: "none" },
      0.06,
    );
  }

  /* --------------------------------------------------------- hand-off */

  if (veil) {
    tl.fromTo(veil, { autoAlpha: 0 }, { autoAlpha: 1, ease: EASE.softInOut, duration: 0.12 }, 0.88);
  }
}
