import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense, type ReactNode } from "react";
import { AdminBookings } from "@/components/admin/admin-bookings";
import { DoctorManager } from "@/components/admin/doctor-manager";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { PageHero } from "@/components/layout/page-hero";
import { PageSkeleton } from "@/components/layout/page-skeleton";
import { getAdminOverview } from "@/lib/admin/service";
import { requireRole } from "@/lib/auth/session";
import { formatPrice } from "@/lib/booking/defaults";

export const metadata: Metadata = {
  title: "Admin dashboard",
  robots: { index: false, follow: false },
};

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-card border bg-card p-6 shadow-soft">
      <p className="font-display text-3xl font-bold text-primary-deep">{value}</p>
      <p className="mt-1 text-sm font-medium text-muted-foreground">{label}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Panel({ id, title, description, children }: { id: string; title: string; description?: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="rounded-card border bg-card p-7 shadow-soft">
      <h2 id={id} className="font-display text-2xl font-bold">
        {title}
      </h2>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

async function AdminContent() {
  // Only "admin" accounts get in. Everyone else sees a 404, so this page is not advertised.
  await requireRole(["admin"], "/admin");
  await connection(); // always fresh, never cached
  const overview = await getAdminOverview(new Date());
  const { totals } = overview;

  const total = Object.values(totals).reduce((sum, item) => sum + item.count, 0);
  const upcomingValue = totals.pending.valueCents + totals.confirmed.valueCents;

  return (
    <main id="main">
      <PageHero
        eyebrow="Staff area"
        title="Admin dashboard"
        description="Every booking, the numbers that matter and your doctors, in one place."
        crumbs={[{ label: "Home", href: "/" }, { label: "Admin dashboard" }]}
      />

      <div className="mx-auto max-w-7xl space-y-8 px-5 py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <Stat label="Total bookings" value={String(total)} />
          <Stat label="Waiting for confirmation" value={String(totals.pending.count)} />
          <Stat label="Confirmed" value={String(totals.confirmed.count)} />
          <Stat label="Completed visits" value={String(totals.completed.count)} hint={formatPrice(totals.completed.valueCents)} />
          <Stat label="Upcoming value" value={formatPrice(upcomingValue)} hint="Pending and confirmed" />
        </div>

        <Panel
          id="revenue-title"
          title="Visit value by week"
          description="The listed price of each visit. Payments will replace this with real revenue."
        >
          <RevenueChart data={overview.revenue} />
        </Panel>

        <Panel id="bookings-title" title="All bookings" description="Confirm, complete or cancel any booking.">
          <AdminBookings
            bookings={overview.bookings}
            doctors={overview.doctors.map((doctor) => ({ slug: doctor.slug, name: doctor.name }))}
          />
        </Panel>

        <Panel
          id="doctors-title"
          title="Doctors"
          description="Link a doctor's account, or switch a doctor off for new bookings. Existing appointments stay as they are."
        >
          <DoctorManager doctors={overview.doctors} />
        </Panel>
      </div>
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
