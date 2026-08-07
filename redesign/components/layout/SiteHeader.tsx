"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { SECTIONS } from "@/lib/constants";
import { COMPANY } from "@/lib/content";
import { cn } from "@/lib/utils";
import { useSmoothScroll } from "@/providers/SmoothScrollProvider";
import { useChapter } from "@/providers/ChapterProvider";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

const NAV_ITEMS = SECTIONS.filter((section) => section.id !== "horizon");

/**
 * Fixed header that condenses on scroll and hides while scrolling down.
 * The show/hide is driven by ScrollTrigger's direction so it never fights
 * Lenis' inertia the way a scroll-listener implementation would.
 */
export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollTo, setLocked } = useSmoothScroll();
  const { active } = useChapter();

  useIsomorphicLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    registerGsap();

    const ctx = gsap.context(() => {
      const condense = gsap.timeline({ paused: true }).to(header, {
        backgroundColor: "rgba(10, 11, 13, 0.82)",
        backdropFilter: "blur(18px)",
        borderColor: "rgba(201, 168, 76, 0.16)",
        paddingTop: 12,
        paddingBottom: 12,
        duration: 0.5,
        ease: "power2.out",
      });

      const show = gsap.quickTo(header, "yPercent", {
        duration: 0.55,
        ease: "power3.out",
      });

      const trigger = ScrollTrigger.create({
        start: 80,
        end: "max",
        onUpdate: (self) => {
          if (self.direction === 1 && self.scroll() > 600) show(-100);
          else show(0);
        },
        onToggle: (self) => (self.isActive ? condense.play() : condense.reverse()),
      });

      return () => trigger.kill();
    }, header);

    return () => ctx.revert();
  }, []);

  const go = useCallback(
    (id: string) => {
      setMenuOpen(false);
      setLocked(false);
      scrollTo(`#${id}`, 0);
    },
    [scrollTo, setLocked],
  );

  const toggleMenu = useCallback(() => {
    setMenuOpen((open) => {
      setLocked(!open);
      return !open;
    });
  }, [setLocked]);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50 border-b border-transparent px-[var(--spacing-gutter)] py-6 will-change-transform"
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              go("hero");
            }}
            className="group flex items-center gap-3"
            aria-label={COMPANY.nameAr}
          >
            <span className="relative block size-10 overflow-hidden rounded-full ring-1 ring-gold/40 transition-transform duration-500 group-hover:scale-105">
              <Image
                src="/brand/logo.jpeg"
                alt=""
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg font-bold text-sand">
                {COMPANY.nameAr.replace(" المحدودة", "")}
              </span>
              <span className="mt-1 text-[0.6rem] tracking-[0.28em] text-gold">
                RIYADH AL KHOZAMAH
              </span>
            </span>
          </a>

          <nav aria-label="أقسام الصفحة" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(item.id);
                    }}
                    aria-current={active === item.id ? "true" : undefined}
                    className={cn(
                      "relative text-sm font-medium transition-colors duration-300",
                      active === item.id
                        ? "text-gold"
                        : "text-mist hover:text-sand",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute -bottom-2 right-0 h-px bg-gold transition-all duration-500",
                        active === item.id ? "w-full" : "w-0",
                      )}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={COMPANY.whatsappHref}
              target="_blank"
              rel="noreferrer noopener"
              className="hidden rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-void transition-colors duration-300 hover:bg-gold-light sm:inline-block"
            >
              تواصل سريع
            </a>

            <button
              type="button"
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              className="hairline flex size-11 items-center justify-center rounded-full text-gold lg:hidden"
            >
              <span className="relative block h-3 w-5">
                <span
                  className={cn(
                    "absolute inset-x-0 top-0 h-px bg-current transition-transform duration-400",
                    menuOpen && "translate-y-[6px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-400",
                    menuOpen && "-translate-y-[6px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="fixed inset-0 z-40 flex flex-col justify-center gap-2 bg-ink/97 px-[var(--spacing-gutter)] backdrop-blur-xl lg:hidden"
      >
        {NAV_ITEMS.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => go(item.id)}
            className="group flex items-baseline gap-4 border-b border-white/5 py-4 text-right"
            style={{ transitionDelay: `${i * 40}ms` }}
          >
            <span className="font-mono text-xs text-gold">{item.index}</span>
            <span className="font-display text-3xl font-bold text-sand transition-colors group-hover:text-gold">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
