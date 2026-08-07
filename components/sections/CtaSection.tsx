"use client";

import { CTA, COMPANY } from "@/lib/content";
import { useScene } from "@/hooks/useScene";
import { useChapterTrigger } from "@/hooks/useChapterTrigger";
import { mergeRefs } from "@/lib/mergeRefs";
import { createCtaTimeline } from "@/animations/ctaTimeline";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { RevealBlock } from "@/components/ui/RevealBlock";
import { MagneticButton } from "@/components/ui/MagneticButton";

const RULES = Array.from({ length: 11 }, (_, i) => i);
const ORBS = [
  { x: "12%", y: "22%", size: 380, color: "var(--color-gold)" },
  { x: "78%", y: "16%", size: 300, color: "var(--color-spectrum-4)" },
  { x: "62%", y: "76%", size: 420, color: "var(--color-spectrum-5)" },
  { x: "24%", y: "70%", size: 260, color: "var(--color-spectrum-2)" },
];

export function CtaSection() {
  const sceneRef = useScene<HTMLElement>(createCtaTimeline);
  const chapterRef = useChapterTrigger<HTMLElement>("contact");

  return (
    <section
      id="contact"
      ref={mergeRefs(sceneRef, chapterRef)}
      aria-label="تواصل معنا"
      className="section-shell grain isolate flex min-h-svh items-center overflow-hidden bg-void py-32"
    >
      {/* ------------------------------------------------------ backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Colour orbs */}
        {ORBS.map((orb) => (
          <span
            key={`${orb.x}-${orb.y}`}
            data-cta-orb
            className="anim-hidden absolute block rounded-full blur-[90px]"
            style={{
              left: orb.x,
              top: orb.y,
              width: orb.size,
              height: orb.size,
              background: orb.color,
              opacity: 0.16,
            }}
          />
        ))}

        {/* Rule lattice */}
        <div className="absolute inset-0">
          {RULES.map((i) => (
            <span
              key={i}
              data-cta-rule
              className="anim-hidden absolute left-0 block h-px w-[140%] bg-linear-to-l from-transparent via-gold/35 to-transparent"
              style={{ top: `${6 + i * 8.6}%` }}
            />
          ))}
        </div>

        {/* Rotating hairline ring */}
        <span
          data-cta-ring
          className="absolute left-1/2 top-1/2 block size-[min(120vmin,900px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/12"
        />
        <span
          className="absolute left-1/2 top-1/2 block size-[min(86vmin,660px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/8"
        />

        {/* Pointer-tracking glow */}
        <span
          data-cta-glow
          className="absolute inset-0 block"
          style={{
            background:
              "radial-gradient(42vmax 42vmax at calc(var(--cta-x, 50) * 1%) calc(var(--cta-y, 45) * 1%), rgba(201,168,76,0.16), transparent 62%)",
          }}
        />
      </div>

      {/* ---------------------------------------------------------- copy */}
      <div
        data-cta-panel
        className="anim-hidden relative z-10 mx-auto w-full max-w-[1600px] px-[var(--spacing-gutter)] text-center"
      >
        <RevealBlock>
          <p className="text-xs font-bold tracking-[0.34em] text-gold">
            {CTA.eyebrow}
          </p>
        </RevealBlock>

        <SplitHeading
          as="h2"
          granularity="words"
          className="mx-auto mt-8 max-w-5xl font-display text-[length:var(--text-mega)] font-bold leading-[1.42] text-sand"
        >
          {CTA.titleLines[0]}{" "}
          <span className="gold-gradient-text">{CTA.titleLines[1]}</span>
        </SplitHeading>

        <RevealBlock delay={0.06}>
          <p className="mx-auto mt-10 max-w-xl text-balance-pretty text-base leading-relaxed text-mist sm:text-lg">
            {CTA.body}
          </p>
        </RevealBlock>

        <RevealBlock delay={0.1}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton href={CTA.primary.href} external radius={120} pull={0.4}>
              {CTA.primary.label}
              <span aria-hidden className="text-lg leading-none">←</span>
            </MagneticButton>
            <MagneticButton href={CTA.secondary.href} variant="outline" download>
              {CTA.secondary.label}
            </MagneticButton>
          </div>
        </RevealBlock>

        <RevealBlock delay={0.14} stagger={0.05}>
          <div className="mx-auto mt-16 flex max-w-3xl flex-wrap items-center justify-center gap-x-12 gap-y-4 border-t border-white/10 pt-10 text-sm">
            <a
              href={COMPANY.phoneHref}
              dir="ltr"
              className="font-mono text-mist transition-colors duration-300 hover:text-gold"
            >
              {COMPANY.phone}
            </a>
            <a
              href={`mailto:${COMPANY.email}`}
              className="text-mist transition-colors duration-300 hover:text-gold"
            >
              {COMPANY.email}
            </a>
            <span className="text-smoke">{COMPANY.address.street}، الرياض</span>
          </div>
        </RevealBlock>
      </div>
    </section>
  );
}
