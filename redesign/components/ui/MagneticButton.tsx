"use client";

import { useRef, type ReactNode } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { MEDIA } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  /** Pull radius in pixels beyond the element bounds. */
  radius?: number;
  /** How far the element travels toward the pointer, 0–1. */
  pull?: number;
  variant?: "solid" | "outline";
  download?: boolean;
  external?: boolean;
  ariaLabel?: string;
}

/**
 * A button that leans toward the cursor and eases back on exit.
 *
 * Motion is applied to an inner span, so the hit area never moves — the
 * pointer target stays exactly where it looks like it is, and keyboard focus
 * rings stay aligned. Pointer-only: on touch it renders as a plain control.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  className,
  radius = 90,
  pull = 0.32,
  variant = "solid",
  download = false,
  external = false,
  ariaLabel,
}: MagneticButtonProps) {
  const hitRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const hit = hitRef.current;
    const inner = innerRef.current;
    if (!hit || !inner) return;
    if (window.matchMedia(MEDIA.touch).matches) return;
    if (window.matchMedia(MEDIA.reducedMotion).matches) return;

    registerGsap();

    const toX = gsap.quickTo(inner, "x", { duration: 0.7, ease: "power3.out" });
    const toY = gsap.quickTo(inner, "y", { duration: 0.7, ease: "power3.out" });
    const toScale = gsap.quickTo(inner, "scale", {
      duration: 0.5,
      ease: "power3.out",
    });

    let bounds = hit.getBoundingClientRect();
    const measure = () => {
      bounds = hit.getBoundingClientRect();
    };

    const onMove = (event: PointerEvent) => {
      const cx = bounds.left + bounds.width / 2;
      const cy = bounds.top + bounds.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const distance = Math.hypot(dx, dy);
      const reach = Math.max(bounds.width, bounds.height) / 2 + radius;

      if (distance > reach) {
        toX(0);
        toY(0);
        toScale(1);
        return;
      }

      const falloff = 1 - distance / reach;
      toX(dx * pull * falloff);
      toY(dy * pull * falloff);
      toScale(1 + 0.05 * falloff);
    };

    const reset = () => {
      toX(0);
      toY(0);
      toScale(1);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      reset();
      gsap.killTweensOf(inner);
    };
  }, [radius, pull]);

  const shell = cn(
    "group relative inline-flex select-none items-center justify-center overflow-hidden rounded-full",
    "px-8 py-4 text-sm font-bold tracking-wide transition-colors duration-500 sm:px-10 sm:py-5 sm:text-base",
    variant === "solid"
      ? "bg-gold text-void hover:bg-gold-light"
      : "hairline bg-transparent text-gold hover:text-gold-light",
    className,
  );

  const content = (
    <>
      {/* Sheen sweep — pure transform/opacity, so it stays on the compositor. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-l from-transparent via-white/25 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-full"
      />
      <span ref={innerRef} className="relative z-10 inline-flex items-center gap-3">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        ref={hitRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        aria-label={ariaLabel}
        className={shell}
        {...(download ? { download: "" } : {})}
        {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={hitRef as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={shell}
    >
      {content}
    </button>
  );
}
