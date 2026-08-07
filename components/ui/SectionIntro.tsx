"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SplitHeading } from "./SplitHeading";
import { RevealBlock } from "./RevealBlock";

interface SectionIntroProps {
  index: string;
  label: string;
  title: string;
  titleAccent?: string;
  body?: string;
  align?: "start" | "center";
  className?: string;
  children?: ReactNode;
  tone?: "light" | "dark";
}

/**
 * The recurring chapter header: index, rule, label, two-tone title and lede.
 * Every chapter uses it, which is what keeps the typographic rhythm identical
 * from section to section.
 */
export function SectionIntro({
  index,
  label,
  title,
  titleAccent,
  body,
  align = "start",
  className,
  children,
  tone = "light",
}: SectionIntroProps) {
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        "relative z-10 max-w-2xl",
        isCenter && "mx-auto text-center",
        className,
      )}
    >
      <RevealBlock>
        <div
          className={cn(
            "flex items-center gap-4",
            isCenter && "justify-center",
          )}
        >
          <span
            className={cn(
              "font-mono text-xs tracking-[0.3em]",
              tone === "light" ? "text-gold" : "text-void/70",
            )}
          >
            {index}
          </span>
          <span
            aria-hidden
            className={cn(
              "h-px w-10",
              tone === "light" ? "bg-gold/50" : "bg-void/30",
            )}
          />
          <span
            className={cn(
              "text-xs font-bold tracking-[0.32em]",
              tone === "light" ? "text-mist" : "text-void/70",
            )}
          >
            {label}
          </span>
        </div>
      </RevealBlock>

      <SplitHeading
        as="h2"
        className={cn(
          "mt-6 font-display leading-[1.32] text-[length:var(--text-heading)] font-bold",
          tone === "light" ? "text-sand" : "text-void",
        )}
      >
        {title}
        {titleAccent ? (
          <>
            {" "}
            <span
              className={cn(
                tone === "light" ? "gold-gradient-text" : "text-gold-deep",
              )}
            >
              {titleAccent}
            </span>
          </>
        ) : null}
      </SplitHeading>

      {body ? (
        <RevealBlock delay={0.08}>
          <p
            className={cn(
              "mt-6 max-w-xl text-balance-pretty text-base leading-relaxed sm:text-lg",
              isCenter && "mx-auto",
              tone === "light" ? "text-mist" : "text-void/75",
            )}
          >
            {body}
          </p>
        </RevealBlock>
      ) : null}

      {children}
    </div>
  );
}
