"use client";

import { useRef, type ReactNode } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { MEDIA, SCRUB } from "@/lib/constants";
import { EASE } from "@/lib/easings";
import { cn } from "@/lib/utils";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

interface RevealBlockProps {
  children: ReactNode;
  className?: string;
  /** Travel distance in pixels. */
  y?: number;
  delay?: number;
  start?: string;
  end?: string;
  /** Stagger direct children instead of moving the block as one. */
  stagger?: number;
  blur?: boolean;
}

/**
 * Generic scroll-scrubbed reveal for anything that is not a heading.
 * Keeps every non-hero element on the same entrance curve and distance so the
 * page reads as one coherent motion system.
 */
export function RevealBlock({
  children,
  className,
  y = 34,
  delay = 0,
  start = "top 90%",
  end = "top 55%",
  stagger,
  blur = false,
}: RevealBlockProps) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    registerGsap();

    if (window.matchMedia(MEDIA.reducedMotion).matches) {
      gsap.set(el, { autoAlpha: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const targets =
        stagger !== undefined ? Array.from(el.children) : [el as Element];

      gsap.set(el, { autoAlpha: 1 });

      gsap.from(targets, {
        y,
        autoAlpha: 0,
        filter: blur ? "blur(10px)" : "blur(0px)",
        duration: 1,
        delay,
        ease: EASE.entrance,
        stagger: stagger ?? 0,
        scrollTrigger: {
          trigger: el,
          start,
          end,
          scrub: SCRUB,
          invalidateOnRefresh: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [y, delay, start, end, stagger, blur]);

  return (
    <div ref={ref} className={cn("anim-hidden", className)}>
      {children}
    </div>
  );
}
