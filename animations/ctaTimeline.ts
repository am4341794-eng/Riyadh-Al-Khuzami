import { gsap } from "@/lib/gsap";
import { EASE } from "@/lib/easings";
import { forward } from "@/lib/constants";
import type { SceneApi } from "@/hooks/useScene";

/**
 * Closing chapter.
 *
 * The background field is a lattice of thin rules and orbs; scroll drives them
 * apart while the headline assembles, so the section resolves into stillness
 * exactly as the visitor reaches the call to action.
 */
export function createCtaTimeline(api: SceneApi) {
  const { root, one, select, reduced, onCleanup, viewport } = api;

  const rules = select("[data-cta-rule]");
  const orbs = select("[data-cta-orb]");
  const glow = one("[data-cta-glow]");
  const panel = one("[data-cta-panel]");
  const ring = one("[data-cta-ring]");

  if (reduced) {
    gsap.set([...rules, ...orbs], { autoAlpha: 1 });
    return;
  }

  const tl = api.timeline({
    scrollTrigger: {
      trigger: root,
      start: "top bottom",
      end: "bottom bottom",
    },
  });

  /* ------------------------------------------------------- background */

  rules.forEach((rule, index) => {
    const depth = (index % 5) + 1;
    tl.fromTo(
      rule,
      { xPercent: forward(-14 * depth), autoAlpha: 0 },
      {
        xPercent: forward(10 * depth),
        autoAlpha: 0.5,
        ease: "none",
      },
      0,
    );
  });

  orbs.forEach((orb, index) => {
    const drift = 60 + index * 34;
    tl.fromTo(
      orb,
      { y: drift, x: forward(-drift * 0.5), autoAlpha: 0, scale: 0.85 },
      { y: -drift, x: forward(drift * 0.4), autoAlpha: 1, scale: 1, ease: "none" },
      0,
    );
  });

  if (glow) {
    tl.fromTo(
      glow,
      { scale: 0.7, autoAlpha: 0.25 },
      { scale: 1.05, autoAlpha: 0.75, ease: EASE.camera },
      0,
    );
  }

  if (ring) {
    tl.fromTo(ring, { rotate: -28, scale: 0.9 }, { rotate: 12, scale: 1.02, ease: "none" }, 0);
  }

  if (panel) {
    tl.fromTo(
      panel,
      { y: 60, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, ease: EASE.entrance, duration: 0.6 },
      0.15,
    );
  }

  /* --------------------------------------------------- pointer response */

  // A light that follows the cursor across the panel. Pointer-only, and it
  // writes to custom properties so it never collides with scroll transforms.
  if (!viewport.isTouch && glow) {
    const setX = gsap.quickTo(glow, "--cta-x", { duration: 0.9, ease: "power3.out" });
    const setY = gsap.quickTo(glow, "--cta-y", { duration: 0.9, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const bounds = root.getBoundingClientRect();
      setX(((event.clientX - bounds.left) / bounds.width) * 100);
      setY(((event.clientY - bounds.top) / bounds.height) * 100);
    };

    root.addEventListener("pointermove", onMove, { passive: true });
    onCleanup(() => {
      root.removeEventListener("pointermove", onMove);
      gsap.killTweensOf(glow);
    });
  }
}
