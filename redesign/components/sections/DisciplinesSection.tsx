"use client";

import { DISCIPLINES } from "@/lib/content";
import { useScene } from "@/hooks/useScene";
import { useChapterTrigger } from "@/hooks/useChapterTrigger";
import { mergeRefs } from "@/lib/mergeRefs";
import { createDisciplinesTimeline } from "@/animations/disciplinesTimeline";

export function DisciplinesSection() {
  const sceneRef = useScene<HTMLElement>(createDisciplinesTimeline);
  const chapterRef = useChapterTrigger<HTMLElement>("disciplines");

  return (
    <section
      id="disciplines"
      ref={mergeRefs(sceneRef, chapterRef)}
      data-scroll-section
      aria-label="مجالات التخصص"
      className="section-shell h-[400svh] bg-void"
    >
      <div
        data-scroll-stage
        className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden"
      >
        {/* Ambient field so the chapter is not a flat panel */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(90%_70%_at_80%_20%,rgba(201,168,76,0.09),transparent_60%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.1] [background-image:linear-gradient(to_left,rgba(201,168,76,0.4)_1px,transparent_1px)] [background-size:120px_100%] [mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_70%,transparent)]"
        />

        {/* ------------------------------------------------------ heading */}
        <div
          data-track-heading
          className="anim-hidden relative z-10 mx-auto w-full max-w-[1600px] px-[var(--spacing-gutter)]"
        >
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs tracking-[0.3em] text-gold">٠٦</span>
            <span aria-hidden className="h-px w-10 bg-gold/50" />
            <span className="text-xs font-bold tracking-[0.32em] text-mist">
              مجالات التخصص
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-[length:var(--text-heading)] font-bold leading-[1.32] text-sand">
              خدماتنا الهندسية{" "}
              <span className="gold-gradient-text">المتكاملة</span>
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-mist">
              من التصميم وحتى التسليم، ستة تخصصات تُنفَّذ تحت عقد واحد وإدارة
              مشروع واحدة.
            </p>
          </div>
        </div>

        {/* -------------------------------------------------------- track */}
        <div className="relative z-10 mt-12 w-full overflow-hidden">
          <ul
            data-track
            className="flex w-max gap-5 px-[var(--spacing-gutter)] will-change-transform"
          >
            {DISCIPLINES.map((discipline) => (
              <li
                key={discipline.id}
                data-discipline
                className="anim-hidden hairline group relative flex w-[78vw] shrink-0 flex-col justify-between overflow-hidden rounded-2xl bg-carbon/70 p-8 backdrop-blur-sm sm:w-[46vw] lg:w-[30vw] xl:w-[26rem]"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -left-20 -top-20 size-48 rounded-full bg-gold/8 blur-3xl transition-opacity duration-700 group-hover:bg-gold/16"
                />

                <div className="relative">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-display text-4xl font-bold text-gold/35">
                      {discipline.id}
                    </span>
                    <span className="font-mono text-[0.6rem] tracking-[0.28em] text-smoke">
                      {discipline.en.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-2xl font-bold leading-snug text-sand">
                    {discipline.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-mist">
                    {discipline.summary}
                  </p>
                </div>

                <ul className="relative mt-8 space-y-3 border-t border-white/10 pt-6">
                  {discipline.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-mist"
                    >
                      <span
                        aria-hidden
                        className="mt-2 block size-1.5 shrink-0 rounded-full bg-gold"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        {/* ----------------------------------------------------- progress */}
        <div className="relative z-10 mx-auto mt-12 w-full max-w-[1600px] px-[var(--spacing-gutter)]">
          <div className="h-px w-full overflow-hidden bg-white/10">
            <span
              data-track-progress
              className="block h-full w-full origin-[right_center] bg-gold"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
