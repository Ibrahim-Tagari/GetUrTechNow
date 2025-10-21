import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { CategoryGrid } from "@/components/category-grid"
import { UpgradeCards } from "@/components/upgrade-cards"
import { FeaturesSection } from "@/components/features-section"
import { AboutUsSection } from "@/components/about-us-section"
import { SiteFooter } from "@/components/site-footer"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <AboutUsSection />
        <CategoryGrid />
        <UpgradeCards />
        <FeaturesSection />
      </main>
      <SiteFooter />
    </div>
  )
}
