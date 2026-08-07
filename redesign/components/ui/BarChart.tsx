"use client";

import type { CapacityBar } from "@/lib/content";
import { Counter } from "./Counter";

interface BarChartProps {
  data: CapacityBar[];
}

/**
 * Discipline coverage. Bars scale from the inline-start edge so they grow with
 * the reading direction in both LTR and RTL without any per-locale branching.
 */
export function BarChart({ data }: BarChartProps) {
  return (
    <ul className="w-full space-y-5">
      {data.map((bar) => (
        <li key={bar.id} data-bar-row>
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-sm text-sand">{bar.label}</span>
            <span className="font-mono text-xs text-gold">
              <Counter to={bar.value} suffix="٪" start="top 92%" end="top 60%" />
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/8">
            <span
              data-bar-fill
              data-value={bar.value}
              className="block h-full w-full origin-[right_center] rounded-full bg-linear-to-l from-gold-deep via-gold to-gold-light"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
