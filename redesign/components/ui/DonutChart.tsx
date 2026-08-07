"use client";

import { useMemo } from "react";
import type { SectorSlice } from "@/lib/content";
import { describeArc } from "@/lib/utils";

interface Arc {
  id: string;
  label: string;
  value: number;
  color: string;
  d: string;
}

interface DonutChartProps {
  data: SectorSlice[];
  size?: number;
  thickness?: number;
  gap?: number;
}

/**
 * Sector split as a ring of arcs.
 *
 * Each arc is a stroked path, so the timeline can reveal it with DrawSVG —
 * the stroke grows along its own length instead of the whole ring fading in,
 * which is what makes the chart look drawn rather than dropped in.
 */
export function DonutChart({
  data,
  size = 320,
  thickness = 26,
  gap = 3,
}: DonutChartProps) {
  const center = size / 2;
  const radius = center - thickness / 2 - 4;

  const arcs = useMemo(() => {
    const total = data.reduce((sum, slice) => sum + slice.value, 0) || 1;

    // Running offset carried through the reduce rather than a mutated local,
    // so the memo stays a pure function of its inputs.
    return data.reduce<{ arcs: Arc[]; angle: number }>(
      (acc, slice) => {
        const sweep = (slice.value / total) * 360;
        acc.arcs.push({
          id: slice.id,
          label: slice.label,
          value: slice.value,
          color: slice.color,
          d: describeArc(
            center,
            center,
            radius,
            acc.angle + gap / 2,
            acc.angle + sweep - gap / 2,
          ),
        });
        return { arcs: acc.arcs, angle: acc.angle + sweep };
      },
      { arcs: [], angle: 0 },
    ).arcs;
  }, [data, center, radius, gap]);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-auto w-full max-w-[320px]"
      role="img"
      aria-label="توزيع المشاريع حسب القطاع"
    >
      {/* Track */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={thickness}
        className="text-white/5"
      />

      {arcs.map((arc) => (
        <path
          key={arc.id}
          data-donut-arc
          data-arc-id={arc.id}
          d={arc.d}
          fill="none"
          stroke={arc.color}
          strokeWidth={thickness}
          strokeLinecap="butt"
        />
      ))}

      {/* Centre readout — the total is written by the timeline. */}
      <text
        data-donut-total
        x={center}
        y={center - 4}
        textAnchor="middle"
        className="fill-sand font-display text-[2.5rem] font-bold"
      >
        100%
      </text>
      <text
        x={center}
        y={center + 26}
        textAnchor="middle"
        className="fill-mist text-[0.7rem] tracking-[0.2em]"
      >
        محفظة المشاريع
      </text>
    </svg>
  );
}
