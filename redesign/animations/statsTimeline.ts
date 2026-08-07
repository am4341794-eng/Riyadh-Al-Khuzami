import { gsap, DrawSVGPlugin } from "@/lib/gsap";
import { EASE } from "@/lib/easings";
import { SCRUB } from "@/lib/constants";
import type { SceneApi } from "@/hooks/useScene";

/**
 * Statistics chapter.
 *
 * Unpinned on purpose: after three pinned scenes the page needs to breathe and
 * scroll normally again. The reveals are still scrubbed, so the rhythm of the
 * story is unbroken — only the staging changes.
 */
export function createStatsTimeline(api: SceneApi) {
  const { root, one, select, reduced } = api;

  const cards = select("[data-stat-card]");
  const meters = select("[data-stat-meter]");
  const arcs = select("[data-donut-arc]");
  const bars = select("[data-bar-fill]");
  const rows = select("[data-bar-row]");
  const ghost = one("[data-figures-ghost]");
  const chartPanel = one("[data-chart-panel]");

  if (reduced) {
    gsap.set([...cards, ...rows], { autoAlpha: 1, y: 0 });
    gsap.set(meters, { scaleX: (i: number) =>
      Number(meters[i].getAttribute("data-progress") ?? 1) });
    gsap.set(bars, { scaleX: (i: number) =>
      Number(bars[i].getAttribute("data-value") ?? 100) / 100 });
    gsap.set(arcs, { drawSVG: "100%" });
    return;
  }

  /* ------------------------------------------------------------- cards */

  cards.forEach((card, index) => {
    gsap.fromTo(
      card,
      { autoAlpha: 0, y: 70, rotateX: -14, transformPerspective: 900 },
      {
        autoAlpha: 1,
        y: 0,
        rotateX: 0,
        ease: EASE.entrance,
        scrollTrigger: {
          trigger: card,
          start: "top 95%",
          end: "top 62%",
          scrub: SCRUB,
          invalidateOnRefresh: true,
        },
        delay: index * 0.02,
      },
    );

    const meter = card.querySelector<HTMLElement>("[data-stat-meter]");
    if (meter) {
      gsap.fromTo(
        meter,
        { scaleX: 0 },
        {
          scaleX: Number(meter.getAttribute("data-progress") ?? 1),
          ease: EASE.softOut,
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            end: "top 52%",
            scrub: SCRUB,
            invalidateOnRefresh: true,
          },
        },
      );
    }
  });

  /* ------------------------------------------------------------ charts */

  if (arcs.length) {
    gsap.fromTo(
      arcs,
      { drawSVG: "0%" },
      {
        drawSVG: "100%",
        ease: EASE.softOut,
        stagger: 0.12,
        scrollTrigger: {
          trigger: chartPanel ?? root,
          start: "top 82%",
          end: "top 30%",
          scrub: SCRUB,
          invalidateOnRefresh: true,
        },
      },
    );
  }

  bars.forEach((bar) => {
    gsap.fromTo(
      bar,
      { scaleX: 0 },
      {
        scaleX: Number(bar.getAttribute("data-value") ?? 100) / 100,
        ease: EASE.softOut,
        scrollTrigger: {
          trigger: bar,
          start: "top 96%",
          end: "top 66%",
          scrub: SCRUB,
          invalidateOnRefresh: true,
        },
      },
    );
  });

  /* ------------------------------------------------- oversized backdrop */

  if (ghost) {
    gsap.fromTo(
      ghost,
      { yPercent: 16, autoAlpha: 0.05 },
      {
        yPercent: -16,
        autoAlpha: 0.12,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: SCRUB,
          invalidateOnRefresh: true,
        },
      },
    );
  }

  // Keeps the plugin reference alive through tree shaking.
  void DrawSVGPlugin;
}
