import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { PageHero } from "@/components/layout/page-hero";

export const metadata: Metadata = {
  title: "Book an appointment",
  description:
    "Choose your doctor, pick a day and time that suits you, and book online in under two minutes.",
  alternates: { canonical: "/book" },
};

export default function BookPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow="Book online"
        title="Book your appointment"
        description="Choose a doctor, pick a time and you are done. Most visits can be booked within the week."
        crumbs={[{ label: "Home", href: "/" }, { label: "Book an appointment" }]}
      />
      {/* The wizard reads ?doctor= and ?service= from the URL, so it sits behind Suspense. */}
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-5 py-14" aria-busy="true">
            <div className="h-72 animate-pulse rounded-card border bg-card" />
          </div>
        }
      >
        <BookingWizard />
      </Suspense>
    </main>
  );
}
