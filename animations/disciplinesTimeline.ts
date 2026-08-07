import { gsap } from "@/lib/gsap";
import { EASE } from "@/lib/easings";
import { forward, SCRUB } from "@/lib/constants";
import type { SceneApi } from "@/hooks/useScene";

/**
 * Disciplines chapter — a horizontal gallery driven by vertical scroll.
 *
 * The travel distance is measured from the DOM and re-measured on every
 * ScrollTrigger refresh, so the track always lands exactly on its last card
 * whatever the viewport, font metrics or card count.
 *
 * `forward()` keeps it direction-agnostic: in RTL the track sits to the left of
 * its container and must travel right; in LTR, the opposite.
 */
export function createDisciplinesTimeline(api: SceneApi) {
  const { root, one, select, reduced, viewport } = api;

  const track = one("[data-track]");
  const cards = select("[data-discipline]");
  const progress = one("[data-track-progress]");
  const heading = one("[data-track-heading]");

  if (!track) return;

  if (reduced) {
    // Without motion the gallery is a plain, horizontally scrollable list.
    gsap.set(track, { clearProps: "transform" });
    gsap.set([...cards, heading], { autoAlpha: 1, y: 0 });
    gsap.set(progress, { scaleX: 1 });
    return;
  }

  const distance = () => Math.max(0, track.scrollWidth - root.clientWidth);

  /**
   * The horizontal move is its own tween with a linear ease — that is a hard
   * requirement of `containerAnimation`, which cannot take a timeline. Each
   * card's own trigger is then expressed in horizontal terms against it.
   */
  const horizontal = gsap.to(track, {
    x: () => forward(-distance()),
    ease: "none",
    scrollTrigger: {
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      scrub: SCRUB,
      invalidateOnRefresh: true,
    },
  });

  /* --------------------------------------------------- chapter framing */

  if (heading) {
    gsap.fromTo(
      heading,
      { autoAlpha: 0, y: 44 },
      {
        autoAlpha: 1,
        y: 0,
        ease: EASE.entrance,
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "top 55%",
          scrub: SCRUB,
          invalidateOnRefresh: true,
        },
      },
    );
  }

  if (progress) {
    gsap.fromTo(
      progress,
      { scaleX: 0, transformOrigin: "right center" },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: SCRUB,
          invalidateOnRefresh: true,
        },
      },
    );
  }

  /* ------------------------------------------------- per-card response */

  // Deliberately *not* `containerAnimation`: that feature maps a card's
  // horizontal position assuming the track travels leftwards, which is only
  // true in LTR. This track moves the other way in RTL, so the triggers would
  // never resolve. Mapping each card to a slice of the same scroll range gives
  // the identical staggered effect and works in either direction.
  const reveals = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      scrub: SCRUB,
      invalidateOnRefresh: true,
    },
  });

  const count = Math.max(1, cards.length);
  cards.forEach((card, index) => {
    // Cards already on screen at the start resolve immediately; the rest
    // resolve as the track brings them into frame.
    const at = (index / count) * 0.72;

    reveals.fromTo(
      card,
      { autoAlpha: 0, y: viewport.isMobile ? 34 : 70, rotate: 1.5 },
      {
        autoAlpha: 1,
        y: 0,
        rotate: 0,
        ease: EASE.entrance,
        duration: 0.2,
      },
      at,
    );
  });

  // The tween is referenced so its ScrollTrigger is created eagerly and the
  // track is positioned before the first paint of the chapter.
  void horizontal;
}
