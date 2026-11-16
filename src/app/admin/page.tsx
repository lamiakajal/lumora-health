import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/layout/page-hero";
import { PageSkeleton } from "@/components/layout/page-skeleton";
import { requireRole } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Admin dashboard",
  robots: { index: false, follow: false },
};

async function AdminContent() {
  // Only "admin" accounts get in. Everyone else sees a 404, so this page is not advertised.
  await requireRole(["admin"], "/admin");

  return (
    <main id="main">
      <PageHero
        eyebrow="Staff area"
        title="Admin dashboard"
        description="Bookings, revenue and doctor management will appear here."
        crumbs={[{ label: "Home", href: "/" }, { label: "Admin dashboard" }]}
      />
    </main>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AdminContent />
    </Suspense>
  );
}
