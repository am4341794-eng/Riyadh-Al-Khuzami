"use client";

import { useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { MEDIA } from "@/lib/constants";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

/**
 * A soft gold halo that trails the pointer, plus a crisp dot that tracks it
 * exactly. Two speeds read as depth. Pointer-devices only; the native cursor
 * is never hidden, so nothing is lost for users who rely on it.
 */
export function CursorHalo() {
  const haloRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const halo = haloRef.current;
    const dot = dotRef.current;
    if (!halo || !dot) return;
    if (window.matchMedia(MEDIA.touch).matches) return;
    if (window.matchMedia(MEDIA.reducedMotion).matches) return;

    registerGsap();

    gsap.set([halo, dot], { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    const haloX = gsap.quickTo(halo, "x", { duration: 0.8, ease: "power3.out" });
    const haloY = gsap.quickTo(halo, "y", { duration: 0.8, ease: "power3.out" });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" });

    let visible = false;
    const interactiveSelector = "a, button, [role='button'], input, select, textarea";

    const onMove = (event: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([halo, dot], { autoAlpha: 1, duration: 0.4 });
      }
      haloX(event.clientX);
      haloY(event.clientY);
      dotX(event.clientX);
      dotY(event.clientY);

      const overInteractive = (event.target as Element | null)?.closest?.(
        interactiveSelector,
      );
      gsap.to(halo, {
        scale: overInteractive ? 1.9 : 1,
        borderColor: overInteractive
          ? "rgba(201,168,76,0.85)"
          : "rgba(201,168,76,0.32)",
        duration: 0.45,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const onLeave = () => {
      visible = false;
      gsap.to([halo, dot], { autoAlpha: 0, duration: 0.3 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf([halo, dot]);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[150] hidden lg:block">
      <div
        ref={haloRef}
        className="anim-hidden absolute left-0 top-0 size-10 rounded-full border border-gold/30 mix-blend-screen"
      />
      <div
        ref={dotRef}
        className="anim-hidden absolute left-0 top-0 size-1.5 rounded-full bg-gold"
      />
    </div>
  );
}
