"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { SplitText } from "gsap/SplitText";
import { CUSTOM_EASES } from "./easings";

let isRegistered = false;

/**
 * Registers GSAP plugins, custom eases and global defaults exactly once.
 * Safe to call from any client component — subsequent calls are no-ops.
 */
export function registerGsap(): typeof gsap {
  if (isRegistered || typeof window === "undefined") return gsap;

  gsap.registerPlugin(
    ScrollTrigger,
    CustomEase,
    DrawSVGPlugin,
    MorphSVGPlugin,
    SplitText,
  );

  for (const [name, path] of Object.entries(CUSTOM_EASES)) {
    CustomEase.create(name, path);
  }

  gsap.defaults({ ease: "brand.entrance", duration: 0.9 });

  // Transforms are read/written through GSAP only, so caching is safe and
  // removes a large slice of layout reads during scrub.
  gsap.config({ force3D: true, nullTargetWarn: false });

  ScrollTrigger.config({
    // Mobile browsers fire resize on URL-bar show/hide; ignoring it prevents
    // pinned scenes from jumping while the user scrolls.
    ignoreMobileResize: true,
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  });

  // Never leave a pinned scene mid-flight when the tab regains focus.
  ScrollTrigger.clearScrollMemory("manual");

  isRegistered = true;
  return gsap;
}

export { gsap, ScrollTrigger, CustomEase, DrawSVGPlugin, MorphSVGPlugin, SplitText };
