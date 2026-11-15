import type { Metadata } from "next";
import { AboutSection } from "@/components/home/about-section";
import { CtaBanner } from "@/components/home/cta-banner";
import { DoctorsSection } from "@/components/home/doctors-section";
import { FacilitiesSection } from "@/components/home/facilities-section";
import { FaqSection } from "@/components/home/faq-section";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { InsuranceStrip } from "@/components/home/insurance-strip";
import { PricingPreview } from "@/components/home/pricing-preview";
import { QuickActions } from "@/components/home/quick-actions";
import { ServicesGrid } from "@/components/home/services-grid";
import { StatsBand } from "@/components/home/stats-band";
import { Testimonials } from "@/components/home/testimonials";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { JsonLd } from "@/components/seo/json-ld";
import { featuredFaqs } from "@/data/faqs";
import { findPublicImage } from "@/lib/public-images";
import { homeJsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  // Add public/images/hero.jpg (or .webp/.png) and it is picked up automatically.
  const heroPhoto = findPublicImage("/images/hero");

  return (
    <main id="main">
      <JsonLd data={homeJsonLd(featuredFaqs)} />
      <Hero photo={heroPhoto} />
      <QuickActions />
      <HowItWorks />
      <AboutSection />
      <StatsBand />
      <ServicesGrid />
      <WhyChooseUs />
      <DoctorsSection />
      <FacilitiesSection />
      <PricingPreview />
      <InsuranceStrip />
      <Testimonials />
      <FaqSection />
      <CtaBanner />
    </main>
  );
}
