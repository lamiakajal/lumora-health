import type { Metadata } from "next";
import { Suspense } from "react";
import { DoctorsExplorer } from "@/components/doctors/doctors-explorer";
import { CtaBanner } from "@/components/home/cta-banner";
import { PageHero } from "@/components/layout/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { doctors } from "@/data/doctors";
import { getDoctorPhotos } from "@/lib/doctor-photos";
import { breadcrumbJsonLd, graphJsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Find a doctor",
  description:
    "Search our physicians and specialists by name, specialty or language. See who is available soonest and book online, in person or by video.",
  alternates: { canonical: "/doctors" },
};

export default function DoctorsPage() {
  const photos = getDoctorPhotos(doctors);

  return (
    <main id="main">
      <JsonLd
        data={graphJsonLd([
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Doctors", path: "/doctors" },
          ]),
        ])}
      />
      <PageHero
        eyebrow="Our doctors"
        title="Find the right doctor for you"
        description={`${doctors.length} physicians and specialists. Filter by department or language, see who is free soonest and book in a few clicks.`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Doctors" }]}
      />
      {/* useSearchParams needs a Suspense boundary so the page shell can still be prerendered. */}
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-5 py-14" aria-busy="true">
            <div className="h-48 animate-pulse rounded-card border bg-card" />
          </div>
        }
      >
        <DoctorsExplorer photos={photos} />
      </Suspense>
      <CtaBanner />
    </main>
  );
}
