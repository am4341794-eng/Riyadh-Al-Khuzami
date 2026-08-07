"use client";

import { useRef } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { SECTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useChapter } from "@/providers/ChapterProvider";
import { useSmoothScroll } from "@/providers/SmoothScrollProvider";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

/**
 * Vertical chapter rail with a live page-progress fill.
 * The fill is scaled via a scrubbed tween rather than re-rendered React state,
 * so scrolling never touches the reconciler.
 */
export function ChapterRail() {
  const railRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const { active } = useChapter();
  const { scrollTo } = useSmoothScroll();

  useIsomorphicLayoutEffect(() => {
    const fill = fillRef.current;
    const rail = railRef.current;
    if (!fill || !rail) return;

    registerGsap();

    const ctx = gsap.context(() => {
      gsap.set(fill, { transformOrigin: "top center", scaleY: 0 });

      const tween = gsap.to(fill, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          start: 0,
          end: "max",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // The rail is decorative until the visitor leaves the hero.
      const reveal = gsap.fromTo(
        rail,
        { autoAlpha: 0, x: 12 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { start: 300, end: 400, toggleActions: "play none none reverse" },
        },
      );

      return () => {
        tween.scrollTrigger?.kill();
        reveal.scrollTrigger?.kill();
      };
    }, rail);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <div
      ref={railRef}
      aria-hidden
      className="anim-hidden pointer-events-none fixed left-[max(1.5rem,3vw)] top-1/2 z-40 hidden -translate-y-1/2 xl:block"
    >
      <div className="relative flex flex-col gap-5 ps-6">
        <span className="absolute inset-y-0 left-0 w-px bg-white/10" />
        <span
          ref={fillRef}
          className="absolute inset-y-0 left-0 w-px origin-top bg-gold"
        />
        {SECTIONS.map((section) => {
          const isActive = active === section.id;
          return (
            <button
              key={section.id}
              type="button"
              tabIndex={-1}
              onClick={() => scrollTo(`#${section.id}`)}
              className="pointer-events-auto flex items-center gap-3 text-left"
            >
              <span
                className={cn(
                  "font-mono text-[0.65rem] tabular-nums transition-colors duration-500",
                  isActive ? "text-gold" : "text-smoke",
                )}
              >
                {section.index}
              </span>
              <span
                className={cn(
                  "text-xs tracking-wider transition-all duration-500",
                  isActive
                    ? "translate-x-0 text-sand opacity-100"
                    : "-translate-x-1 text-smoke opacity-0",
                )}
              >
                {section.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
