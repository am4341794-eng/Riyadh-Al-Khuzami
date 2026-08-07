"use client";

import { CHAPTERS } from "@/lib/content";
import { useScene } from "@/hooks/useScene";
import { useChapterTrigger } from "@/hooks/useChapterTrigger";
import { mergeRefs } from "@/lib/mergeRefs";
import { createLogisticsTimeline } from "@/animations/logisticsTimeline";
import { WarehouseScene } from "@/components/scenes/warehouse/WarehouseScene";

const { logistics } = CHAPTERS;

export function LogisticsSection() {
  const sceneRef = useScene<HTMLElement>(createLogisticsTimeline);
  const chapterRef = useChapterTrigger<HTMLElement>("logistics");

  return (
    <section
      id="logistics"
      ref={mergeRefs(sceneRef, chapterRef)}
      aria-label={logistics.label}
      className="section-shell h-[340svh] bg-void"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* -------------------------------------------------------- scene */}
        <div data-camera className="absolute inset-0 origin-center will-change-transform">
          <WarehouseScene />
        </div>

        {/* Readability scrim behind the copy column */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_left,rgba(5,5,6,0.94)_0%,rgba(5,5,6,0.72)_34%,transparent_62%)]"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-void to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-void to-transparent"
        />

        {/* --------------------------------------------------------- copy */}
        <div className="pointer-events-none absolute inset-0 flex items-center">
          <div className="mx-auto flex w-full max-w-[1600px] px-[var(--spacing-gutter)]">
            <div data-copy className="anim-hidden max-w-lg">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs tracking-[0.3em] text-gold">
                  {logistics.index}
                </span>
                <span aria-hidden className="h-px w-10 bg-gold/50" />
                <span className="text-xs font-bold tracking-[0.32em] text-mist">
                  {logistics.label}
                </span>
              </div>

              <h2 className="mt-6 font-display text-[length:var(--text-heading)] font-bold leading-[1.32] text-sand">
                {logistics.title}{" "}
                <span className="gold-gradient-text">{logistics.titleAccent}</span>
              </h2>

              <p className="mt-6 max-w-md text-balance-pretty text-base leading-relaxed text-mist sm:text-lg">
                {logistics.body}
              </p>

              <dl className="mt-10 space-y-4 border-t border-white/10 pt-6">
                {logistics.notes.map((note) => (
                  <div
                    key={note.k}
                    data-note
                    className="anim-hidden flex items-baseline justify-between gap-6 border-b border-white/5 pb-3"
                  >
                    <dt className="text-sm text-mist">{note.k}</dt>
                    <dd className="text-sm font-bold text-sand">{note.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* Hand-off veil to the next chapter */}
        <div
          data-veil
          aria-hidden
          className="anim-hidden pointer-events-none absolute inset-0 bg-void"
        />
      </div>
    </section>
  );
}
