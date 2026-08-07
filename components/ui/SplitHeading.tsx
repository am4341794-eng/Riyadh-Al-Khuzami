"use client";

import {
  useRef,
  type ComponentType,
  type ElementType,
  type ReactNode,
  type Ref,
} from "react";
import { gsap, registerGsap, SplitText } from "@/lib/gsap";
import { EASE } from "@/lib/easings";
import { MEDIA, SCRUB } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

interface SplitHeadingProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Stagger between lines, in timeline seconds. */
  stagger?: number;
  /** Where the reveal starts / finishes relative to the viewport. */
  start?: string;
  end?: string;
  /** Bind the reveal to scroll position (default) or play it once on enter. */
  scrub?: boolean;
  /** Split granularity. Arabic is never split by character — that would break
   *  glyph shaping and ligatures. */
  granularity?: "lines" | "words";
  delay?: number;
}

/**
 * Masked, line-by-line heading reveal.
 *
 * Uses GSAP SplitText with `autoSplit`, so the text re-splits cleanly on
 * resize and after web fonts settle — no stale line boxes, no layout shift.
 */
export function SplitHeading({
  children,
  as: Tag = "h2",
  className,
  stagger = 0.12,
  start = "top 88%",
  end = "top 42%",
  scrub = true,
  granularity = "lines",
  delay = 0,
}: SplitHeadingProps) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    registerGsap();

    if (window.matchMedia(MEDIA.reducedMotion).matches) {
      gsap.set(el, { autoAlpha: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const split = SplitText.create(el, {
        type: granularity === "words" ? "lines,words" : "lines",
        mask: "lines",
        autoSplit: true,
        linesClass: "split-line",
        onSplit: (self) => {
          const targets =
            granularity === "words" && self.words.length ? self.words : self.lines;

          gsap.set(el, { autoAlpha: 1 });

          return gsap.from(targets, {
            yPercent: 118,
            rotate: granularity === "words" ? 3 : 1.5,
            opacity: 0,
            duration: 1,
            delay,
            ease: EASE.entrance,
            stagger,
            scrollTrigger: {
              trigger: el,
              start,
              end,
              scrub: scrub ? SCRUB : false,
              toggleActions: scrub ? undefined : "play none none reverse",
              invalidateOnRefresh: true,
            },
          });
        },
      });

      return () => split.revert();
    }, el);

    return () => ctx.revert();
  }, [stagger, start, end, scrub, granularity, delay]);

  // `as` widens to every intrinsic element; narrow it to the props we pass so
  // the ref stays typed without an `any` escape hatch.
  const Component = Tag as ComponentType<{
    ref?: Ref<HTMLElement>;
    className?: string;
    children?: ReactNode;
  }>;

  return (
    <Component ref={ref} className={cn("anim-hidden", className)}>
      {children}
    </Component>
  );
}
