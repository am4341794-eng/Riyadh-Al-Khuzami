"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { HERO, COMPANY } from "@/lib/content";
import { useScene } from "@/hooks/useScene";
import { mergeRefs } from "@/lib/mergeRefs";
import { useChapterTrigger } from "@/hooks/useChapterTrigger";
import { useIsMobile, useReducedMotion } from "@/hooks/useMediaQuery";
import { createHeroTimeline } from "@/animations/heroTimeline";
import { MagneticButton } from "@/components/ui/MagneticButton";

/** WebGL is the heaviest chunk on the page — never in the initial bundle. */
const GlobeCanvas = dynamic(() => import("@/components/scenes/globe/GlobeCanvas"), {
  ssr: false,
  loading: () => null,
});

export function HeroSection() {
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const [canRender3D, setCanRender3D] = useState(false);
  const chapterRef = useChapterTrigger<HTMLElement>("hero");

  // Mount the canvas only after hydration settles and only where WebGL is
  // actually available — otherwise the static fallback stands in.
  useEffect(() => {
    if (reduced) return;
    const supported = (() => {
      try {
        const canvas = document.createElement("canvas");
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext("webgl2") || canvas.getContext("webgl"))
        );
      } catch {
        return false;
      }
    })();
    if (!supported) return;

    // Defer the WebGL boot past hydration so it never competes with first paint.
    const enable = () => setCanRender3D(true);
    const idleApi = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (idleApi.requestIdleCallback) {
      const handle = idleApi.requestIdleCallback(enable, { timeout: 900 });
      return () => idleApi.cancelIdleCallback?.(handle);
    }

    const timer = window.setTimeout(enable, 240);
    return () => window.clearTimeout(timer);
  }, [reduced]);

  const sceneRef = useScene<HTMLElement>(createHeroTimeline, [
    isMobile,
    canRender3D,
  ]);

  return (
    <section
      id="hero"
      ref={mergeRefs(chapterRef, sceneRef)}
      aria-label="مقدمة الشركة"
      className="section-shell h-[240svh]"
    >
      <div className="hero-stage sticky top-0 grid h-svh place-items-center overflow-hidden">
          {/* ---------------------------------------------------- backdrop */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_10%,#12141a_0%,#080910_45%,#050506_100%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.13] [background-image:linear-gradient(to_right,rgba(201,168,76,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(201,168,76,0.35)_1px,transparent_1px)] [background-size:88px_88px] [mask-image:radial-gradient(70%_60%_at_50%_45%,#000_10%,transparent_75%)]"
          />

          {/* ------------------------------------------------------- WebGL */}
          <div className="hero-canvas absolute inset-0" aria-hidden>
            {canRender3D ? (
              <GlobeCanvas quality={isMobile ? "low" : "high"} className="size-full" />
            ) : (
              <StaticGlobeFallback />
            )}
          </div>

          {/* Darkening pass that arrives as the camera pushes in. */}
          <div
            aria-hidden
            className="hero-vignette anim-hidden absolute inset-0 bg-[radial-gradient(75%_60%_at_50%_50%,transparent_0%,rgba(5,5,6,0.75)_70%,#050506_100%)]"
          />

          {/* ------------------------------------------------------- copy */}
          <div className="relative z-10 flex w-full max-w-[1600px] flex-col items-center px-[var(--spacing-gutter)] text-center">
            <p className="hero-eyebrow anim-hidden mb-6 text-xs font-bold tracking-[0.34em] text-gold sm:text-sm">
              {HERO.eyebrow}
            </p>

            <h1 className="hero-headline font-display text-[length:var(--text-display)] font-bold leading-[1.32] text-sand">
              {HERO.titleLines.map((line, index) => (
                <span key={line} className="block">
                  {index === HERO.accentWordIndex ? (
                    <span className="gold-gradient-text">{line}</span>
                  ) : (
                    line
                  )}
                </span>
              ))}
            </h1>

            <p className="hero-lede anim-hidden mt-8 max-w-xl text-balance-pretty text-base leading-relaxed text-mist sm:text-lg">
              {HERO.lede}
            </p>

            <div className="hero-actions anim-hidden mt-10 flex flex-wrap items-center justify-center gap-4">
              <MagneticButton href={COMPANY.whatsappHref} external>
                اطلب عرض سعر
              </MagneticButton>
              <MagneticButton href={COMPANY.profileHref} variant="outline" download>
                تحميل البروفايل
              </MagneticButton>
            </div>
          </div>

          {/* ------------------------------------------------------- meta */}
          <div
            className="hero-meta anim-hidden absolute bottom-28 right-[var(--spacing-gutter)] hidden text-right md:block"
            aria-hidden
          >
            <p className="font-mono text-[0.65rem] tracking-widest text-smoke">
              24°42′N 46°40′E
            </p>
            <p className="mt-1 text-xs text-mist">الرياض — المملكة العربية السعودية</p>
          </div>

          <div
            className="hero-meta anim-hidden absolute bottom-28 left-[var(--spacing-gutter)] hidden text-left md:block"
            aria-hidden
          >
            <p className="font-mono text-[0.65rem] tracking-widest text-smoke">
              EST. {COMPANY.foundedYear}
            </p>
            <p className="mt-1 text-xs text-mist">خبرة تمتد لأكثر من ٢٥ عاماً</p>
          </div>

          {/* --------------------------------------------------- marquee */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 inset-x-0 overflow-hidden border-t border-white/5 bg-void/40 py-3 backdrop-blur-sm"
          >
            <div className="hero-marquee-track flex w-max gap-12 whitespace-nowrap px-6 font-mono text-[0.6rem] tracking-[0.3em] text-smoke sm:text-xs">
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i}>{HERO.marquee}</span>
              ))}
            </div>
          </div>

          {/* ------------------------------------------------------- hint */}
          <div className="hero-hint anim-hidden absolute bottom-16 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
            <span className="text-[0.65rem] tracking-[0.3em] text-mist">
              {HERO.scrollHint}
            </span>
            <span aria-hidden className="relative h-10 w-px overflow-hidden bg-white/15">
              <span className="absolute inset-x-0 top-0 h-4 animate-[scrollHint_2.4s_var(--ease-soft)_infinite] bg-gold" />
            </span>
          </div>
        </div>
    </section>
  );
}

/**
 * Pure-SVG stand-in used when WebGL is unavailable or motion is reduced.
 * Same silhouette and palette, so the composition never collapses.
 */
function StaticGlobeFallback() {
  const rings = [0.32, 0.52, 0.72, 0.9];
  return (
    <div className="grid size-full place-items-center">
      <svg
        viewBox="0 0 400 400"
        className="h-[min(70vmin,520px)] w-[min(70vmin,520px)] opacity-80"
        role="presentation"
      >
        <defs>
          <radialGradient id="hero-fallback-glow" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="#c9a84c" stopOpacity="0" />
            <stop offset="100%" stopColor="#c9a84c" stopOpacity="0.35" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="150" fill="#07080b" />
        <circle cx="200" cy="200" r="168" fill="url(#hero-fallback-glow)" />
        <circle
          cx="200"
          cy="200"
          r="150"
          fill="none"
          stroke="#c9a84c"
          strokeOpacity="0.35"
        />
        {rings.map((r) => (
          <ellipse
            key={r}
            cx="200"
            cy="200"
            rx="150"
            ry={150 * r}
            fill="none"
            stroke="#c9a84c"
            strokeOpacity="0.14"
          />
        ))}
        {[0, 30, 60, 90, 120, 150].map((angle) => (
          <ellipse
            key={angle}
            cx="200"
            cy="200"
            rx={150 * 0.42}
            ry="150"
            fill="none"
            stroke="#c9a84c"
            strokeOpacity="0.12"
            transform={`rotate(${angle} 200 200)`}
          />
        ))}
      </svg>
    </div>
  );
}
