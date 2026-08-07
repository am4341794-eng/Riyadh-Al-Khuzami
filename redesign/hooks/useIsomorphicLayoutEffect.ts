"use client";

import { useEffect, useLayoutEffect } from "react";

/**
 * `useLayoutEffect` that degrades to `useEffect` during SSR so GSAP setup
 * never triggers React's server-rendering warning.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
