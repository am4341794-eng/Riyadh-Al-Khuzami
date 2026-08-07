import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ChapterRail } from "@/components/layout/ChapterRail";
import { CursorHalo } from "@/components/layout/CursorHalo";
import { Preloader } from "@/components/layout/Preloader";
import { HeroSection } from "@/components/sections/HeroSection";
import { LogisticsSection } from "@/components/sections/LogisticsSection";
import { JourneySection } from "@/components/sections/JourneySection";
import { DisciplinesSection } from "@/components/sections/DisciplinesSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { CtaSection } from "@/components/sections/CtaSection";

export default function Page() {
  return (
    <>
      <Preloader />
      <CursorHalo />
      <SiteHeader />
      <ChapterRail />

      <main id="main" className="relative">
        <HeroSection />
        <LogisticsSection />
        <JourneySection />
        <DisciplinesSection />
        <StatsSection />
        <CtaSection />
      </main>

      <SiteFooter />
    </>
  );
}
