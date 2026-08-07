"use client";

import { STATS, SECTORS, CAPACITY, PROJECTS, CLIENTS } from "@/lib/content";
import { useScene } from "@/hooks/useScene";
import { useChapterTrigger } from "@/hooks/useChapterTrigger";
import { mergeRefs } from "@/lib/mergeRefs";
import { createStatsTimeline } from "@/animations/statsTimeline";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { RevealBlock } from "@/components/ui/RevealBlock";
import { Counter } from "@/components/ui/Counter";
import { DonutChart } from "@/components/ui/DonutChart";
import { BarChart } from "@/components/ui/BarChart";

export function StatsSection() {
  const sceneRef = useScene<HTMLElement>(createStatsTimeline);
  const chapterRef = useChapterTrigger<HTMLElement>("figures");

  return (
    <section
      id="figures"
      ref={mergeRefs(sceneRef, chapterRef)}
      aria-label="الأرقام والإنجازات"
      className="section-shell overflow-hidden bg-ink py-28 sm:py-36"
    >
      {/* Oversized ghost numeral drifting behind the content */}
      <span
        data-figures-ghost
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 select-none text-center font-display text-[28vw] font-bold leading-none text-gold opacity-[0.06]"
      >
        25+
      </span>

      <div className="relative mx-auto max-w-[1600px] px-[var(--spacing-gutter)]">
        <SectionIntro
          index="٠٧"
          label="الأرقام"
          title="سجل يُقاس"
          titleAccent="بالإنجاز"
          body="خمسة وعشرون عاماً من التنفيذ في السوق السعودي، موثّقة بمشاريع مسلّمة وعملاء يعودون إلينا."
          align="center"
        />

        {/* ------------------------------------------------------- cards */}
        <ul className="mt-20 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {STATS.map((stat) => (
            <li
              key={stat.id}
              data-stat-card
              className="anim-hidden hairline group relative overflow-hidden rounded-2xl bg-carbon/70 p-8 backdrop-blur-sm"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-gold/10 blur-2xl transition-opacity duration-700 group-hover:opacity-160"
              />
              <p className="font-display text-[clamp(2.75rem,5vw,4rem)] font-bold leading-none text-sand">
                <Counter to={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-4 text-sm font-bold text-gold">{stat.label}</p>
              <p className="mt-2 text-xs leading-relaxed text-mist">{stat.caption}</p>

              <span className="mt-7 block h-px w-full overflow-hidden bg-white/10">
                <span
                  data-stat-meter
                  data-progress={stat.progress}
                  className="block h-full w-full origin-[right_center] bg-gold"
                  style={{ transform: "scaleX(0)" }}
                />
              </span>
            </li>
          ))}
        </ul>

        {/* ------------------------------------------------------ charts */}
        <div
          data-chart-panel
          className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
        >
          <RevealBlock className="hairline flex flex-col items-center justify-center rounded-2xl bg-carbon/70 p-8">
            <DonutChart data={SECTORS} />
            <ul className="mt-8 w-full space-y-3">
              {SECTORS.map((sector) => (
                <li
                  key={sector.id}
                  className="flex items-center justify-between gap-4 text-sm"
                >
                  <span className="flex items-center gap-3 text-mist">
                    <span
                      aria-hidden
                      className="block size-2.5 rounded-full"
                      style={{ background: sector.color }}
                    />
                    {sector.label}
                  </span>
                  <span className="font-mono text-xs text-sand">{sector.value}٪</span>
                </li>
              ))}
            </ul>
          </RevealBlock>

          <RevealBlock className="hairline rounded-2xl bg-carbon/70 p-8">
            <div className="mb-8 flex items-baseline justify-between gap-4">
              <h3 className="font-display text-2xl font-bold text-sand">
                تغطية التخصصات
              </h3>
              <span className="text-xs tracking-[0.24em] text-mist">
                CAPABILITY COVERAGE
              </span>
            </div>
            <BarChart data={CAPACITY} />
          </RevealBlock>
        </div>

        {/* ---------------------------------------------------- projects */}
        <RevealBlock
          stagger={0.05}
          className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {PROJECTS.map((project) => (
            <article
              key={project.title}
              className="hairline group rounded-2xl bg-carbon/70 p-7 transition-colors duration-500 hover:bg-graphite/70"
            >
              <span className="inline-block rounded-full bg-gold/12 px-3 py-1 text-[0.65rem] font-bold tracking-wider text-gold">
                {project.tag}
              </span>
              <h3 className="mt-5 font-display text-lg font-bold leading-snug text-sand">
                {project.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-mist">{project.detail}</p>
              <p className="mt-5 flex items-center gap-2 text-[0.7rem] text-smoke">
                <span aria-hidden className="block size-1 rounded-full bg-gold" />
                {project.place}
              </p>
            </article>
          ))}
        </RevealBlock>

        {/* ----------------------------------------------------- clients */}
        <RevealBlock className="mt-20">
          <p className="text-center text-xs font-bold tracking-[0.32em] text-gold">
            عملاء نعتز بثقتهم
          </p>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {CLIENTS.map((client) => (
              <li
                key={client}
                className="text-sm text-mist transition-colors duration-500 hover:text-sand"
              >
                {client}
              </li>
            ))}
          </ul>
        </RevealBlock>
      </div>
    </section>
  );
}
