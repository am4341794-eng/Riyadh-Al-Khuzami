"use client";

import { useRef, type RefObject } from "react";
import { ScrollTrigger, registerGsap } from "@/lib/gsap";
import type { SectionId } from "@/lib/constants";
import { useChapter } from "@/providers/ChapterProvider";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

/**
 * Reports a section as the active chapter while it occupies the viewport.
 * Returns a ref to spread onto the section element.
 */
export function useChapterTrigger<T extends HTMLElement = HTMLElement>(
  id: SectionId,
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const { setActive } = useChapter();

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    registerGsap();

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 55%",
      end: "bottom 45%",
      onToggle: (self) => {
        if (self.isActive) setActive(id);
      },
    });

    return () => trigger.kill();
  }, [id, setActive]);

  return ref;
}
