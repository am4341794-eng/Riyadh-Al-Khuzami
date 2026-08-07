import { gsap } from "@/lib/gsap";
import { EASE } from "@/lib/easings";
import { forward } from "@/lib/constants";
import { heroScene, requestSceneFrame } from "@/lib/sceneState";
import type { SceneApi } from "@/hooks/useScene";
import {
  PRELOADER_DONE_EVENT,
  isPreloaderDone,
} from "@/components/layout/Preloader";

/**
 * Hero chapter.
 *
 * Two distinct pieces of motion live here:
 *  1. A one-off entrance, triggered when the preloader curtain clears.
 *  2. The scroll-scrubbed departure — headline lifts away while the WebGL
 *     camera dollies into the globe.
 *
 * Only the second is bound to scroll; the entrance is a page-load event and
 * would feel broken if it required a scroll to begin.
 */
export function createHeroTimeline(api: SceneApi) {
  const { root, one, select, timeline, reduced, viewport, onCleanup } = api;

  const stage = one(".hero-stage");
  const headline = one(".hero-headline");
  const eyebrow = one(".hero-eyebrow");
  const lede = one(".hero-lede");
  const actions = one(".hero-actions");
  const hint = one(".hero-hint");
  const vignette = one(".hero-vignette");
  const marquee = one(".hero-marquee-track");
  const meta = select(".hero-meta");
  const canvasWrap = one(".hero-canvas");

  if (!stage) return;

  /* ------------------------------------------------------------- entrance */

  if (reduced) {
    heroScene.intro = 1;
    requestSceneFrame();
    gsap.set([headline, eyebrow, lede, actions, hint, ...meta], { autoAlpha: 1 });
  } else {
    gsap.set([eyebrow, lede, actions, hint, ...meta], { autoAlpha: 0 });

    const intro = gsap.timeline({ paused: true, defaults: { ease: EASE.entrance } });

    intro
      .to(heroScene, {
        intro: 1,
        duration: 2.2,
        ease: EASE.camera,
        onUpdate: requestSceneFrame,
      })
      .fromTo(
        canvasWrap,
        { autoAlpha: 0, scale: 1.12 },
        { autoAlpha: 1, scale: 1, duration: 2.2, ease: EASE.camera },
        0,
      )
      .fromTo(
        eyebrow,
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 1 },
        0.35,
      )
      .fromTo(
        lede,
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 1.1 },
        0.75,
      )
      .fromTo(
        actions,
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 1.1 },
        0.9,
      )
      .fromTo(
        meta,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 },
        1,
      )
      .fromTo(
        hint,
        { autoAlpha: 0, y: -10 },
        { autoAlpha: 1, y: 0, duration: 0.9 },
        1.2,
      );

    const start = () => intro.play();
    let fallback = 0;

    if (isPreloaderDone()) {
      // The curtain already lifted — this scene was rebuilt after the fact.
      intro.progress(1).pause();
    } else {
      window.addEventListener(PRELOADER_DONE_EVENT, start, { once: true });
      // Safety net: never leave the hero invisible if the curtain never reports.
      fallback = window.setTimeout(start, 4000);
    }

    onCleanup(() => {
      window.removeEventListener(PRELOADER_DONE_EVENT, start);
      window.clearTimeout(fallback);
      intro.kill();
    });
  }

  /* --------------------------------------------------------------- scroll */

  const tl = timeline();

  // Drive the WebGL scene. `requestSceneFrame` is what makes the on-demand
  // render loop tick, so the canvas is only redrawn while scrolling.
  tl.to(
    heroScene,
    { progress: 1, ease: "none", onUpdate: requestSceneFrame },
    0,
  );

  tl.to(
    headline,
    {
      yPercent: -34,
      scale: viewport.isMobile ? 1.05 : 1.14,
      autoAlpha: 0,
      filter: "blur(12px)",
      ease: EASE.camera,
    },
    0,
  )
    .to(
      [eyebrow, lede, actions],
      { yPercent: -70, autoAlpha: 0, ease: EASE.softInOut, stagger: 0.04 },
      0,
    )
    .to(hint, { autoAlpha: 0, y: 30, ease: "none", duration: 0.15 }, 0)
    .to(meta, { autoAlpha: 0, y: 24, ease: "none", stagger: 0.03 }, 0)
    .to(vignette, { autoAlpha: 1, ease: EASE.softInOut }, 0);

  if (marquee) {
    tl.to(marquee, { xPercent: forward(-38), ease: "none" }, 0);
  }

  /* ------------------------------------------------------------- pointer */

  if (!reduced && !viewport.isTouch) {
    const setX = gsap.quickSetter(heroScene, "pointerX") as (v: number) => void;
    const setY = gsap.quickSetter(heroScene, "pointerY") as (v: number) => void;
    const smoothed = { x: 0, y: 0 };

    const onMove = (event: PointerEvent) => {
      gsap.to(smoothed, {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
        duration: 0.9,
        ease: "power3.out",
        overwrite: true,
        onUpdate: () => {
          setX(smoothed.x);
          setY(smoothed.y);
          requestSceneFrame();
        },
      });
    };

    root.ownerDocument.addEventListener("pointermove", onMove, { passive: true });
    onCleanup(() => {
      root.ownerDocument.removeEventListener("pointermove", onMove);
      gsap.killTweensOf(smoothed);
    });
  }
}
