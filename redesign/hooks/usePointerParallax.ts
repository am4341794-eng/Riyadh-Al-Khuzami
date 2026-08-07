"use client";

import { useRef, type RefObject } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { MEDIA } from "@/lib/constants";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

interface PointerParallaxOptions {
  /** Selector for the layers, relative to the container. */
  selector?: string;
  /** Max travel in pixels for a layer with depth 1. */
  strength?: number;
  /** Read per-layer depth from this data attribute (defaults to 1). */
  depthAttribute?: string;
  /** Follow smoothing — higher is lazier. */
  smoothing?: number;
}

/**
 * Adds a subtle pointer-driven depth response to a group of layers.
 *
 * Deliberately additive: it writes only to `--px`/`--py` custom properties, so
 * it can never fight a scroll-driven transform on the same element. Disabled on
 * touch and reduced-motion.
 */
export function usePointerParallax<T extends HTMLElement = HTMLDivElement>({
  selector = "[data-parallax]",
  strength = 26,
  depthAttribute = "data-depth",
  smoothing = 0.9,
}: PointerParallaxOptions = {}): RefObject<T | null> {
  const ref = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia(MEDIA.touch).matches) return;
    if (window.matchMedia(MEDIA.reducedMotion).matches) return;

    registerGsap();

    const layers = Array.from(root.querySelectorAll<HTMLElement>(selector));
    if (!layers.length) return;

    const setters = layers.map((layer) => {
      const depth = Number(layer.getAttribute(depthAttribute) ?? 1);
      return {
        x: gsap.quickTo(layer, "--px", {
          duration: smoothing,
          ease: "power3.out",
        }),
        y: gsap.quickTo(layer, "--py", {
          duration: smoothing,
          ease: "power3.out",
        }),
        depth,
      };
    });

    const onMove = (event: PointerEvent) => {
      const nx = (event.clientX / window.innerWidth) * 2 - 1;
      const ny = (event.clientY / window.innerHeight) * 2 - 1;
      for (const setter of setters) {
        setter.x(-nx * strength * setter.depth);
        setter.y(-ny * strength * setter.depth);
      }
    };

    const onLeave = () => {
      for (const setter of setters) {
        setter.x(0);
        setter.y(0);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      for (const layer of layers) {
        gsap.killTweensOf(layer);
      }
    };
  }, [selector, strength, depthAttribute, smoothing]);

  return ref;
}
