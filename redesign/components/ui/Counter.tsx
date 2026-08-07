"use client";

import { useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { MEDIA, SCRUB } from "@/lib/constants";
import { formatNumber, cn } from "@/lib/utils";
import { EASE } from "@/lib/easings";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

interface CounterProps {
  to: number;
  from?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
  /** Scroll window over which the number climbs. */
  start?: string;
  end?: string;
}

/**
 * Number that counts up as it is scrolled through.
 *
 * Writes to `textContent` on a single node rather than through React state, so
 * a 60fps scrub costs zero re-renders. The final value is present in the DOM
 * for screen readers and non-JS crawlers via `aria-label`.
 */
export function Counter({
  to,
  from = 0,
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
  start = "top 85%",
  end = "top 45%",
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    registerGsap();

    if (window.matchMedia(MEDIA.reducedMotion).matches) {
      el.textContent = formatNumber(to, decimals);
      return;
    }

    const state = { value: from };
    el.textContent = formatNumber(from, decimals);

    const tween = gsap.to(state, {
      value: to,
      ease: EASE.linear,
      onUpdate: () => {
        el.textContent = formatNumber(state.value, decimals);
      },
      scrollTrigger: {
        trigger: el,
        start,
        end,
        scrub: SCRUB,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [to, from, decimals, start, end]);

  return (
    <span
      dir="ltr"
      className={cn("inline-block tabular-nums", className)}
      aria-label={`${prefix}${formatNumber(to, decimals)}${suffix}`}
    >
      {prefix}
      <span ref={ref} aria-hidden>
        {formatNumber(from, decimals)}
      </span>
      {suffix}
    </span>
  );
}
