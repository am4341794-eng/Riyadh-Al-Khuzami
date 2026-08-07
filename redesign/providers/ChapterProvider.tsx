"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SECTIONS, type SectionId } from "@/lib/constants";

interface ChapterValue {
  active: SectionId;
  activeIndex: number;
  setActive: (id: SectionId) => void;
}

const ChapterContext = createContext<ChapterValue>({
  active: "hero",
  activeIndex: 0,
  setActive: () => {},
});

export const useChapter = () => useContext(ChapterContext);

/**
 * Tracks which chapter of the story is on screen.
 * Sections report in through `useChapterTrigger`; the nav rail and the
 * progress indicator read from here instead of each running their own
 * ScrollTriggers over the same elements.
 */
export function ChapterProvider({ children }: { children: ReactNode }) {
  const [active, setActiveState] = useState<SectionId>("hero");

  const setActive = useCallback((id: SectionId) => {
    setActiveState((current) => (current === id ? current : id));
  }, []);

  const value = useMemo<ChapterValue>(
    () => ({
      active,
      activeIndex: Math.max(
        0,
        SECTIONS.findIndex((section) => section.id === active),
      ),
      setActive,
    }),
    [active, setActive],
  );

  return (
    <ChapterContext.Provider value={value}>{children}</ChapterContext.Provider>
  );
}
