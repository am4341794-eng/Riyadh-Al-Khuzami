"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { COMPANY } from "@/lib/content";
import { ScrollTrigger } from "@/lib/gsap";
import { useSmoothScroll } from "@/providers/SmoothScrollProvider";
import { useReducedMotion } from "@/hooks/useMediaQuery";

/** Fired once the curtain is clear so the hero can start its intro. */
export const PRELOADER_DONE_EVENT = "rak:preloader-done";

let curtainCleared = false;

/**
 * Whether the curtain has already lifted.
 *
 * A scene rebuilt after the event fired (a breakpoint change, a lazily mounted
 * canvas) would otherwise wait forever for an event that already happened.
 */
export const isPreloaderDone = () => curtainCleared;

/**
 * Entry curtain: holds the page still until fonts and first paint are ready,
 * then lifts. Uses Framer Motion — this is a plain UI transition, not part of
 * the scroll narrative, so it does not belong on a ScrollTrigger.
 */
export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const { setLocked } = useSmoothScroll();
  const startedAt = useRef(0);
  // Deliberately our own hook, not Framer's: this one is backed by
  // useSyncExternalStore with a server snapshot of `false`, so the first client
  // render matches the server HTML exactly. Framer's resolves in an effect and
  // makes the curtain disappear mid-hydration, which React reports as a
  // hydration mismatch.
  const prefersReduced = useReducedMotion();

  // Reduced motion skips the curtain entirely — derived, never set in an
  // effect, so there is no cascading render on mount.
  const done = dismissed || !!prefersReduced;

  useEffect(() => {
    if (prefersReduced) return;

    startedAt.current = performance.now();
    setLocked(true);

    let frame = 0;
    let assetsReady = false;

    const ready = Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise<void>((resolve) => {
        if (document.readyState === "complete") resolve();
        else window.addEventListener("load", () => resolve(), { once: true });
      }),
    ]);

    ready.then(() => {
      assetsReady = true;
    });

    // Progress eases toward 90% while loading, then completes once ready —
    // never a fake linear bar, never a stall at 100%.
    const tick = () => {
      setProgress((current) => {
        const ceiling = assetsReady ? 100 : 92;
        const next = current + (ceiling - current) * 0.06 + 0.4;
        return Math.min(ceiling, next);
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [prefersReduced, setLocked]);

  useEffect(() => {
    if (prefersReduced || progress < 99.5 || done) return;
    const elapsed = performance.now() - startedAt.current;
    const wait = Math.max(0, 900 - elapsed);
    const timer = window.setTimeout(() => setDismissed(true), wait);
    return () => window.clearTimeout(timer);
  }, [progress, done, prefersReduced]);

  useEffect(() => {
    if (!done) return;
    curtainCleared = true;
    setLocked(false);
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
    window.dispatchEvent(new CustomEvent(PRELOADER_DONE_EVENT));
  }, [done, setLocked]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-void"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
          aria-live="polite"
          aria-busy="true"
        >
          <motion.div
            className="flex flex-col items-center gap-8"
            exit={{ y: -28, opacity: 0, transition: { duration: 0.5, ease: [0.83, 0, 0.17, 1] } }}
          >
            <span className="font-display text-2xl font-bold tracking-wide text-sand sm:text-3xl">
              {COMPANY.nameAr}
            </span>
            <span className="text-[0.65rem] tracking-[0.4em] text-gold">
              RIYADH AL KHOZAMAH
            </span>

            <div className="relative h-px w-56 overflow-hidden bg-white/10 sm:w-72">
              <motion.span
                className="absolute inset-y-0 right-0 block bg-gold"
                style={{ width: `${progress}%` }}
              />
            </div>

            <span className="font-mono text-sm tabular-nums text-mist">
              {Math.round(progress)}%
            </span>
          </motion.div>

          {/* Curtain panels part on exit for a physical reveal. */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-1/2 origin-top bg-void"
            exit={{ scaleY: 0, transition: { duration: 0.9, ease: [0.83, 0, 0.17, 1] } }}
          />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 origin-bottom bg-void"
            exit={{ scaleY: 0, transition: { duration: 0.9, ease: [0.83, 0, 0.17, 1] } }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
