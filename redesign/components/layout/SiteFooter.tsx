"use client";

import { COMPANY, FOOTER_LINKS } from "@/lib/content";
import { RevealBlock } from "@/components/ui/RevealBlock";

const DISCIPLINE_LINKS = [
  "المقاولات العامة",
  "تجهيز المستشفيات",
  "الأنظمة الأمنية والتقنية",
  "الأنظمة الكهروميكانيكية",
];

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-white/8 bg-ink px-[var(--spacing-gutter)] py-16">
      <div className="mx-auto max-w-[1600px]">
        <RevealBlock stagger={0.06} className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-xl font-bold text-sand">
              {COMPANY.nameAr}
            </p>
            <p className="mt-1 text-[0.65rem] tracking-[0.3em] text-gold">
              RIYADH AL KHOZAMAH
            </p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-mist">
              {COMPANY.tagline}
            </p>
          </div>

          <nav aria-label="روابط سريعة">
            <p className="text-xs font-bold tracking-[0.28em] text-gold">
              روابط سريعة
            </p>
            <ul className="mt-5 space-y-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-mist transition-colors duration-300 hover:text-sand"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-xs font-bold tracking-[0.28em] text-gold">خدماتنا</p>
            <ul className="mt-5 space-y-3">
              {DISCIPLINE_LINKS.map((item) => (
                <li key={item} className="text-sm text-mist">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <address className="not-italic">
            <p className="text-xs font-bold tracking-[0.28em] text-gold">
              تواصل معنا
            </p>
            <ul className="mt-5 space-y-3 text-sm text-mist">
              <li>
                <a
                  href={COMPANY.phoneHref}
                  dir="ltr"
                  className="inline-block transition-colors duration-300 hover:text-sand"
                >
                  {COMPANY.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="transition-colors duration-300 hover:text-sand"
                >
                  {COMPANY.email}
                </a>
              </li>
              <li>{COMPANY.address.street}</li>
              <li>{COMPANY.address.poBox}</li>
              <li>{COMPANY.address.country}</li>
            </ul>
          </address>
        </RevealBlock>

        <div className="chapter-rule mt-14" />

        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-xs text-smoke sm:flex-row">
          <p>
            © {new Date().getFullYear()} جميع الحقوق محفوظة لـ{" "}
            <span className="text-mist">{COMPANY.nameAr}</span>
          </p>
          <a
            href={COMPANY.websiteHref}
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors duration-300 hover:text-gold"
          >
            {COMPANY.website}
          </a>
        </div>
      </div>
    </footer>
  );
}
