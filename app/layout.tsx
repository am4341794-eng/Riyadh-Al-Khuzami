import type { Metadata, Viewport } from "next";
import { Tajawal, Amiri } from "next/font/google";
import { COMPANY } from "@/lib/content";
import { SmoothScrollProvider } from "@/providers/SmoothScrollProvider";
import { ChapterProvider } from "@/providers/ChapterProvider";
import "@/styles/globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
  preload: true,
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(COMPANY.websiteHref),
  title: {
    default: `${COMPANY.nameAr} | مقاولات وتجهيز مستشفيات`,
    template: `%s | ${COMPANY.nameAr}`,
  },
  description: COMPANY.tagline,
  applicationName: COMPANY.nameEn,
  keywords: [
    "مقاولات",
    "تجهيز مستشفيات",
    "أعمال مدنية",
    "بنية تحتية",
    "الرياض",
    "السعودية",
    "Riyadh Al Khozamah",
  ],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: COMPANY.nameAr,
    title: `${COMPANY.nameAr} — نبني المستقبل بمعايير ذهبية`,
    description: COMPANY.tagline,
  },
  robots: { index: true, follow: true },
  icons: { icon: "/brand/logo.jpeg" },
};

export const viewport: Viewport = {
  themeColor: "#050506",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${amiri.variable}`}>
      <body className="bg-void text-sand antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[999] focus:rounded-full focus:bg-gold focus:px-6 focus:py-3 focus:text-void"
        >
          تخطَّ إلى المحتوى
        </a>
        <ChapterProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </ChapterProvider>
      </body>
    </html>
  );
}
