import type { Metadata } from "next";
import { CtaBanner } from "@/components/home/cta-banner";
import { PageHero } from "@/components/layout/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { ServicesExplorer } from "@/components/services/services-explorer";
import { services } from "@/data/services";
import { breadcrumbJsonLd, graphJsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Our specialties",
  description:
    "From primary care to cardiology, neurology, mental health, pediatrics and more: every kind of care under one roof, in person or by video.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <main id="main">
      <JsonLd
        data={graphJsonLd([
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Specialties", path: "/services" },
          ]),
        ])}
      />
      <PageHero
        eyebrow="Our specialties"
        title="Every kind of care, under one roof"
        description={`Explore ${services.length} specialties across heart, brain, mind, children, women's health and more. Pick one to meet the doctors and book a visit.`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Specialties" }]}
      />
      <ServicesExplorer />
      <CtaBanner />
    </main>
  );
}
