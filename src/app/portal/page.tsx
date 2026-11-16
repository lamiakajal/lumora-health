import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { PageHero } from "@/components/layout/page-hero";
import { PageSkeleton } from "@/components/layout/page-skeleton";
import { ButtonLink } from "@/components/ui/button";
import { roleLabels } from "@/lib/auth/roles";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Patient portal",
  robots: { index: false, follow: false },
};

async function PortalContent() {
  const { user, role } = await requireUser("/portal");

  return (
    <main id="main">
      <PageHero
        eyebrow={roleLabels[role]}
        title={`Welcome, ${user.name}`}
        description="Your appointments, results and account in one place."
        crumbs={[{ label: "Home", href: "/" }, { label: "Patient portal" }]}
      >
        <ButtonLink href="/doctors" size="lg" arrow>
          Find a doctor
        </ButtonLink>
        <SignOutButton />
      </PageHero>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-14 md:grid-cols-2">
        <div className="rounded-card border bg-card p-7 shadow-soft">
          <h2 className="font-display text-xl font-bold">Upcoming appointments</h2>
          <p className="mt-2 text-muted-foreground">
            You have no appointments yet. Online booking opens in the next update.
          </p>
        </div>

        <div className="rounded-card border bg-card p-7 shadow-soft">
          <h2 className="font-display text-xl font-bold">Your account</h2>
          <dl className="mt-4 space-y-3 text-[15px]">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-semibold">{user.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-semibold">{user.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Role</dt>
              <dd className="font-semibold">{roleLabels[role]}</dd>
            </div>
          </dl>
          {role === "doctor" && (
            <Link href="/dashboard" className="mt-5 inline-flex text-sm font-bold text-primary-deep hover:underline">
              Open the doctor dashboard
            </Link>
          )}
          {role === "admin" && (
            <Link href="/admin" className="mt-5 inline-flex text-sm font-bold text-primary-deep hover:underline">
              Open the admin dashboard
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}

export default function PortalPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PortalContent />
    </Suspense>
  );
}
