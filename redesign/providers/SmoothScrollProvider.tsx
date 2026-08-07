"use client";

import Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { LENIS_OPTIONS, MEDIA } from "@/lib/constants";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

interface SmoothScrollValue {
  /** Scrolls to an element, selector or offset with Lenis easing. */
  scrollTo: (target: string | number | HTMLElement, offset?: number) => void;
  /** Pauses/resumes scrolling — used by the preloader and the mobile menu. */
  setLocked: (locked: boolean) => void;
}

const SmoothScrollContext = createContext<SmoothScrollValue>({
  scrollTo: () => {},
  setLocked: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

/**
 * Owns the single Lenis instance for the app and marries it to GSAP.
 *
 * Lenis is driven by `gsap.ticker` rather than its own rAF loop, so the entire
 * page runs on exactly one requestAnimationFrame callback: scroll easing,
 * ScrollTrigger updates and every tween share a frame and stay in lockstep.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useIsomorphicLayoutEffect(() => {
    registerGsap();

    // Respect the OS setting: no inertia, no hijacking, native scroll only.
    if (window.matchMedia(MEDIA.reducedMotion).matches) return;

    const lenis = new Lenis({
      ...LENIS_OPTIONS,
      // Custom curve: fast pickup, long tail — the "weighted" premium feel.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: false,
    });
    lenisRef.current = lenis;

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    // gsap.ticker time is in seconds; Lenis expects milliseconds.
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    // Never "catch up" after a stall — that produces the jump users notice.
    gsap.ticker.lagSmoothing(0);

    document.documentElement.classList.add("lenis");

    return () => {
      gsap.ticker.remove(tick);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      lenisRef.current = null;
      document.documentElement.classList.remove("lenis");
    };
  }, []);

  const scrollTo = useCallback(
    (target: string | number | HTMLElement, offset = 0) => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(target, { offset, duration: 1.4 });
        return;
      }
      // Reduced-motion / pre-init fallback.
      if (typeof target === "number") {
        window.scrollTo({ top: target + offset });
        return;
      }
      const el =
        typeof target === "string" ? document.querySelector(target) : target;
      el?.scrollIntoView({ block: "start" });
    },
    [],
  );

  const setLocked = useCallback((locked: boolean) => {
    const lenis = lenisRef.current;
    if (!lenis) {
      document.documentElement.style.overflow = locked ? "hidden" : "";
      return;
    }
    if (locked) lenis.stop();
    else lenis.start();
  }, []);

  const value = useMemo<SmoothScrollValue>(
    () => ({ scrollTo, setLocked }),
    [scrollTo, setLocked],
  );

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
