"use client";

import { useSyncExternalStore } from "react";
import { MEDIA } from "@/lib/constants";

function subscribe(query: string) {
  return (onChange: () => void) => {
    const list = window.matchMedia(query);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  };
}

/**
 * SSR-safe media query subscription.
 * Server snapshot is always `false`, so components must render a layout that is
 * valid before the query resolves — this keeps hydration free of layout shift.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    subscribe(query),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useReducedMotion = () => useMediaQuery(MEDIA.reducedMotion);
export const useIsMobile = () => useMediaQuery(MEDIA.mobile);
export const useIsTouch = () => useMediaQuery(MEDIA.touch);
export const useIsDesktop = () => useMediaQuery(MEDIA.desktop);
