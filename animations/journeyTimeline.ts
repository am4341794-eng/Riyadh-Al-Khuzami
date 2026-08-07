import { gsap } from "@/lib/gsap";
import { EASE } from "@/lib/easings";
import type { SceneApi } from "@/hooks/useScene";
import { MORPH_PARTS } from "@/lib/shapes";
import { addTruckChapter } from "./journey/truckChapter";
import { addMorphChapter } from "./journey/morphChapter";
import { addSkyChapter } from "./journey/skyChapter";
import { JOURNEY } from "./journey/timings";

/**
 * Composes the three journey chapters onto one master timeline.
 *
 * They share a single ScrollTrigger deliberately: the truck is still settling
 * when the ribbons begin, and the ribbons are still resolving when the sky
 * starts to change. Separate triggers could never guarantee that overlap.
 */
export function createJourneyTimeline(api: SceneApi) {
  const { one, select, timeline, viewport, reduced } = api;

  const camera = one("[data-camera]");
  const copyBlocks = select("[data-journey-copy]");

  if (reduced) {
    // Freeze on the aircraft: the chapter's conclusion, fully legible.
    MORPH_PARTS.forEach((part) => {
      const target = one(`[data-morph="${part.id}"]`);
      if (target) {
        target.setAttribute("d", part.stages.plane);
        target.setAttribute("fill", part.fill.plane);
      }
    });
    gsap.set(one("[data-truck-extras]"), { opacity: 0 });
    gsap.set([one("[data-road-group]"), one("[data-desert]"), one("[data-sun]")], {
      opacity: 0,
    });
    gsap.set(one('[data-sky="air"]'), { opacity: 1 });
    gsap.set(one("[data-cloud-layer]"), { opacity: 1 });
    gsap.set(one("[data-vehicle]"), { y: -140 });
    gsap.set(copyBlocks, { autoAlpha: 1, y: 0 });
    return;
  }

  const tl = timeline();

  /* ------------------------------------------------------------- camera */

  // A slow push through the whole chapter, plus a wider framing while the
  // shapes are abstract so the ribbons have room to read.
  if (camera) {
    tl.fromTo(
      camera,
      { scale: viewport.isMobile ? 1.5 : 1.14, yPercent: 3 },
      { scale: viewport.isMobile ? 1.36 : 1.04, yPercent: 0, ease: EASE.camera },
      0,
    )
      .to(
        camera,
        {
          scale: viewport.isMobile ? 1.3 : 1.02,
          yPercent: -2,
          ease: EASE.camera,
          duration: 0.22,
        },
        JOURNEY.toRibbons.start,
      )
      .to(
        camera,
        {
          scale: viewport.isMobile ? 1.42 : 1.1,
          yPercent: 2,
          ease: EASE.camera,
          duration: 0.3,
        },
        JOURNEY.flight.start,
      );
  }

  addTruckChapter(tl, api);
  addMorphChapter(tl, api);
  addSkyChapter(tl, api);

  /* --------------------------------------------------------------- copy */

  // Each copy block owns a window of the chapter and hands over to the next.
  copyBlocks.forEach((block) => {
    const from = Number(block.getAttribute("data-from") ?? 0);
    const to = Number(block.getAttribute("data-to") ?? 1);

    tl.fromTo(
      block,
      { autoAlpha: 0, y: 44, filter: "blur(8px)" },
      {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        ease: EASE.entrance,
        duration: 0.08,
      },
      from,
    ).to(
      block,
      { autoAlpha: 0, y: -40, filter: "blur(8px)", ease: EASE.softInOut, duration: 0.07 },
      to,
    );
  });
}
