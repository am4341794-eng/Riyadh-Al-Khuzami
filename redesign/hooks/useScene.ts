"use client";

import { useRef, type DependencyList, type RefObject } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { MEDIA, SCRUB } from "@/lib/constants";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

/** Everything a scene timeline needs, handed to the builder as one object. */
export interface SceneApi {
  /** The scene root element. */
  root: HTMLElement;
  /** Scoped multi-select. Always returns an array (never null). */
  select: <E extends Element = HTMLElement>(selector: string) => E[];
  /** Scoped single select. */
  one: <E extends Element = HTMLElement>(selector: string) => E | null;
  /**
   * Creates a timeline that is scrubbed by scroll over the scene by default.
   * Pass `scrollTrigger` overrides to change the pin, range or scrub feel.
   */
  timeline: (vars?: gsap.TimelineVars) => gsap.core.Timeline;
  /**
   * Registers a teardown callback, run when the breakpoint stops matching or
   * the component unmounts. Use it for anything GSAP cannot revert on its own:
   * DOM listeners, timers, paused timelines.
   */
  onCleanup: (fn: () => void) => void;
  viewport: {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isTouch: boolean;
  };
  /** True when the visitor asked for reduced motion. */
  reduced: boolean;
  /** GSAP context — use `context.add()` for event-driven tweens. */
  context: gsap.Context;
}

export type SceneBuilder = (api: SceneApi) => void;

interface SceneOptions {
  /** Skip building entirely (e.g. while an asset is still loading). */
  enabled?: boolean;
  /** Refresh ScrollTrigger once the scene is built — needed after late layout. */
  refreshOnBuild?: boolean;
}

/**
 * The single entry point every section uses to attach scroll-driven motion.
 *
 * Wraps `gsap.matchMedia` so each breakpoint (and the reduced-motion case) gets
 * its own timeline, automatically reverted when the query stops matching or the
 * component unmounts. Builders receive scoped selectors, so no scene can ever
 * reach into another scene's DOM.
 */
export function useScene<T extends HTMLElement = HTMLDivElement>(
  builder: SceneBuilder,
  deps: DependencyList = [],
  { enabled = true, refreshOnBuild = false }: SceneOptions = {},
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    if (!root || !enabled) return;

    registerGsap();

    const mm = gsap.matchMedia();

    mm.add(
      {
        isMobile: MEDIA.mobile,
        isTablet: MEDIA.tablet,
        isDesktop: MEDIA.desktop,
        isTouch: MEDIA.touch,
        reduced: MEDIA.reducedMotion,
      },
      (context) => {
        const c = context.conditions as Record<string, boolean>;
        const scoped = gsap.utils.selector(root);
        const cleanups: Array<() => void> = [];

        const api: SceneApi = {
          root,
          select: <E extends Element = HTMLElement>(selector: string) =>
            scoped(selector) as unknown as E[],
          one: <E extends Element = HTMLElement>(selector: string) =>
            (root.querySelector(selector) as E | null) ?? null,
          timeline: (vars: gsap.TimelineVars = {}) => {
            const { scrollTrigger, ...rest } = vars;
            return gsap.timeline({
              ...rest,
              scrollTrigger: {
                trigger: root,
                start: "top top",
                end: "bottom bottom",
                scrub: SCRUB,
                invalidateOnRefresh: true,
                ...(typeof scrollTrigger === "object" ? scrollTrigger : {}),
              },
            });
          },
          onCleanup: (fn) => {
            cleanups.push(fn);
          },
          viewport: {
            isMobile: !!c.isMobile,
            isTablet: !!c.isTablet,
            isDesktop: !!c.isDesktop,
            isTouch: !!c.isTouch,
          },
          reduced: !!c.reduced,
          context,
        };

        builder(api);

        if (refreshOnBuild) {
          // One frame later the scene's images/canvases have laid out.
          const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
          cleanups.push(() => cancelAnimationFrame(raf));
        }

        // Returning a function from a matchMedia callback registers it as the
        // teardown for this breakpoint — GSAP reverts its own tweens, this
        // handles everything else.
        return () => {
          for (const fn of cleanups) fn();
        };
      },
    );

    return () => mm.revert();
  }, [enabled, refreshOnBuild, ...deps]);

  return ref;
}
