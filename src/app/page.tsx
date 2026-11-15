import { AboutSection } from "@/components/home/about-section";
import { DoctorsSection } from "@/components/home/doctors-section";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { PricingPreview } from "@/components/home/pricing-preview";
import { QuickActions } from "@/components/home/quick-actions";
import { ServicesGrid } from "@/components/home/services-grid";
import { StatsBand } from "@/components/home/stats-band";
import { Testimonials } from "@/components/home/testimonials";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { findPublicImage } from "@/lib/public-images";

export default function Home() {
  // Add public/images/hero.jpg (or .webp/.png) and it is picked up automatically.
  const heroPhoto = findPublicImage("/images/hero");

  return (
    <main id="main">
      <Hero photo={heroPhoto} />
      <QuickActions />
      <HowItWorks />
      <AboutSection />
      <StatsBand />
      <ServicesGrid />
      <WhyChooseUs />
      <DoctorsSection />
      <PricingPreview />
      <Testimonials />
    </main>
  );
}
