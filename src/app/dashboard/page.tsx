import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/layout/page-hero";
import { PageSkeleton } from "@/components/layout/page-skeleton";
import { requireRole } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Doctor dashboard",
  robots: { index: false, follow: false },
};

async function DashboardContent() {
  // Only "doctor" accounts get in. Everyone else sees a 404, so this page is not advertised.
  await requireRole(["doctor"], "/dashboard");

  return (
    <main id="main">
      <PageHero
        eyebrow="Staff area"
        title="Doctor dashboard"
        description="Your schedule, availability and patients will appear here."
        crumbs={[{ label: "Home", href: "/" }, { label: "Doctor dashboard" }]}
      />
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
