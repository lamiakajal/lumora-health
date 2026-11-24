import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { AvailabilityEditor } from "@/components/dashboard/availability-editor";
import { ProviderBookings } from "@/components/dashboard/provider-bookings";
import { PageHero } from "@/components/layout/page-hero";
import { PageSkeleton } from "@/components/layout/page-skeleton";
import { requireRole } from "@/lib/auth/session";
import {
  getEditorAvailability,
  getProviderForUser,
  listProviderBookings,
} from "@/lib/booking/provider-service";
import { localDateOf } from "@/lib/booking/time";

export const metadata: Metadata = {
  title: "Doctor dashboard",
  robots: { index: false, follow: false },
};

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-card border bg-card p-6 shadow-soft">
      <p className="font-display text-4xl font-bold text-primary-deep">{value}</p>
      <p className="mt-1 text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}

async function DashboardContent() {
  // Only "doctor" accounts get in. Everyone else sees a 404, so this page is not advertised.
  const { user } = await requireRole(["doctor"], "/dashboard");
  await connection(); // this page is personal and always rendered fresh
  const provider = await getProviderForUser(user.id);

  if (!provider) {
    return (
      <main id="main">
        <PageHero
          eyebrow="Staff area"
          title="Doctor dashboard"
          description="Your account is not linked to a doctor profile yet. Please ask an administrator to link it."
          crumbs={[{ label: "Home", href: "/" }, { label: "Doctor dashboard" }]}
        />
      </main>
    );
  }

  const [bookings, availability] = await Promise.all([
    listProviderBookings(provider._id),
    getEditorAvailability(provider),
  ]);

  const now = new Date();
  const today = localDateOf(now, provider.timezone);
  const pending = bookings.filter((booking) => booking.status === "pending").length;
  const todays = bookings.filter(
    (booking) => booking.status === "confirmed" && localDateOf(new Date(booking.start), provider.timezone) === today,
  ).length;
  const upcoming = bookings.filter(
    (booking) => booking.status === "confirmed" && new Date(booking.end) >= now,
  ).length;

  return (
    <main id="main">
      <PageHero
        eyebrow="Staff area"
        title="Doctor dashboard"
        description={`Welcome, ${provider.name}. Confirm visits, keep your hours up to date and plan time off.`}
        crumbs={[{ label: "Home", href: "/" }, { label: "Doctor dashboard" }]}
      />

      <section className="mx-auto grid max-w-7xl gap-5 px-5 pt-10 sm:grid-cols-3">
        <Stat label="Waiting for your confirmation" value={pending} />
        <Stat label="Confirmed visits today" value={todays} />
        <Stat label="Upcoming confirmed visits" value={upcoming} />
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-card border bg-card p-7 shadow-soft">
          <h2 className="font-display text-2xl font-bold">Appointments</h2>
          <div className="mt-6">
            <ProviderBookings bookings={bookings} now={now} />
          </div>
        </div>

        <div className="rounded-card border bg-card p-7 shadow-soft lg:self-start">
          <h2 className="font-display text-2xl font-bold">Your hours</h2>
          <div className="mt-6">
            <AvailabilityEditor initial={availability} />
          </div>
        </div>
      </section>
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
