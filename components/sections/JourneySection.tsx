"use client";

import { CHAPTERS } from "@/lib/content";
import { useScene } from "@/hooks/useScene";
import { useChapterTrigger } from "@/hooks/useChapterTrigger";
import { createJourneyTimeline } from "@/animations/journeyTimeline";
import { JOURNEY } from "@/animations/journey/timings";
import { JourneyScene } from "@/components/scenes/journey/JourneyScene";

const { transport, horizon, sky } = CHAPTERS;

/**
 * Chapters 03 – 05 share one section, and therefore one sticky stage and one
 * timeline. Splitting them into three sections would mean three stages and an
 * unavoidable seam at each boundary; the brief asks for the opposite.
 *
 * Navigation and the chapter rail still see three destinations, via the zero
 * height anchors positioned at each chapter's scroll offset.
 */
export function JourneySection() {
  const sceneRef = useScene<HTMLElement>(createJourneyTimeline);
  const transportRef = useChapterTrigger<HTMLDivElement>("transport");
  const horizonRef = useChapterTrigger<HTMLDivElement>("horizon");
  const skyRef = useChapterTrigger<HTMLDivElement>("sky");

  return (
    <section
      ref={sceneRef}
      aria-label="من الطريق إلى الأجواء"
      className="section-shell h-[620svh] bg-void"
    >
      {/* Anchors: they give each chapter a nav target and a chapter-rail
          trigger without breaking the single continuous stage. */}
      <div
        id="transport"
        ref={transportRef}
        className="pointer-events-none absolute inset-x-0 top-0 h-[36%]"
        aria-hidden
      />
      <div
        id="horizon"
        ref={horizonRef}
        className="pointer-events-none absolute inset-x-0 top-[36%] h-[26%]"
        aria-hidden
      />
      <div
        id="sky"
        ref={skyRef}
        className="pointer-events-none absolute inset-x-0 top-[62%] h-[38%]"
        aria-hidden
      />

      <div className="sticky top-0 h-svh overflow-hidden">
        <div data-camera className="absolute inset-0 origin-center will-change-transform">
          <JourneyScene />
        </div>

        {/* Vignette keeps type legible over the brightest sky frames */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_50%,transparent_35%,rgba(5,5,6,0.55)_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[56%] bg-[linear-gradient(to_bottom,rgba(5,5,6,0.86)_0%,rgba(5,5,6,0.48)_46%,transparent_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-44 bg-linear-to-t from-void/85 to-transparent"
        />

        {/* ------------------------------------------------------- copy */}
        <div className="pointer-events-none absolute inset-0">
          <div className="mx-auto flex h-full max-w-[1600px] items-start px-[var(--spacing-gutter)] pt-[16svh]">
            <div className="relative w-full">
              <CopyBlock
                from={JOURNEY.truck.start + 0.03}
                to={JOURNEY.toRibbons.start - 0.04}
                index={transport.index}
                label={transport.label}
                title={transport.title}
                accent={transport.titleAccent}
                body={transport.body}
                stats={transport.stats}
              />

              <CopyBlock
                from={JOURNEY.toRibbons.start + 0.06}
                to={JOURNEY.toPlane.end - 0.04}
                index={horizon.index}
                label={horizon.label}
                title={horizon.title}
                accent={horizon.titleAccent}
                body={horizon.body}
                align="center"
              />

              <CopyBlock
                from={JOURNEY.flight.start + 0.08}
                to={0.94}
                index={sky.index}
                label={sky.label}
                title={sky.title}
                accent={sky.titleAccent}
                body={sky.body}
                highlights={sky.highlights}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface CopyBlockProps {
  from: number;
  to: number;
  index: string;
  label: string;
  title: string;
  accent: string;
  body: string;
  align?: "start" | "center";
  stats?: ReadonlyArray<{ k: string; v: string }>;
  highlights?: ReadonlyArray<string>;
}

/**
 * A caption that owns a slice of the journey. `data-from` / `data-to` are read
 * by the timeline, so re-timing a block is a markup change, not a code change.
 */
function CopyBlock({
  from,
  to,
  index,
  label,
  title,
  accent,
  body,
  align = "start",
  stats,
  highlights,
}: CopyBlockProps) {
  const isCenter = align === "center";

  return (
    <div
      data-journey-copy
      data-from={from}
      data-to={to}
      className={
        isCenter
          ? "anim-hidden absolute inset-x-0 top-0 mx-auto max-w-2xl text-center"
          : "anim-hidden absolute top-0 max-w-lg"
      }
    >
      <div
        className={`flex items-center gap-4 ${isCenter ? "justify-center" : ""}`}
      >
        <span className="font-mono text-xs tracking-[0.3em] text-gold">{index}</span>
        <span aria-hidden className="h-px w-10 bg-gold/50" />
        <span className="text-xs font-bold tracking-[0.32em] text-mist">{label}</span>
      </div>

      <h2 className="mt-6 font-display text-[length:var(--text-heading)] font-bold leading-[1.32] text-sand">
        {title} <span className="gold-gradient-text">{accent}</span>
      </h2>

      <p
        className={`mt-6 max-w-md text-balance-pretty text-base leading-relaxed text-mist sm:text-lg ${
          isCenter ? "mx-auto" : ""
        }`}
      >
        {body}
      </p>

      {stats ? (
        <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/10 pt-6">
          {stats.map((stat) => (
            <div key={stat.v}>
              <dt className="font-display text-2xl font-bold text-gold">{stat.k}</dt>
              <dd className="mt-1 text-xs text-mist">{stat.v}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {highlights ? (
        <ul className="mt-8 space-y-3 border-t border-white/10 pt-6">
          {highlights.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-mist">
              <span aria-hidden className="mt-2 block size-1.5 shrink-0 rounded-full bg-gold" />
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
