"use client";

import { useMemo, useState } from "react";
import { BookingRow } from "@/components/dashboard/provider-bookings";
import { filterBookings, paginate, type BookingFilters } from "@/lib/admin/bookings";
import { bookingStatuses } from "@/lib/booking/status";
import type { ProviderBooking } from "@/lib/booking/types";

const PAGE_SIZE = 12;
const control =
  "h-11 rounded-xl border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15";

type AdminBookingsProps = {
  bookings: ProviderBooking[];
  doctors: { slug: string; name: string }[];
};

export function AdminBookings({ bookings, doctors }: AdminBookingsProps) {
  const [filters, setFilters] = useState<BookingFilters>({ q: "", status: "all", doctor: "" });
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => filterBookings(bookings, filters), [bookings, filters]);
  const view = paginate(filtered, page, PAGE_SIZE);

  function update(next: Partial<BookingFilters>) {
    setFilters((current) => ({ ...current, ...next }));
    setPage(1);
  }

  return (
    <div>
      <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr]">
        <label className="sr-only" htmlFor="admin-search">
          Search bookings
        </label>
        <input
          id="admin-search"
          type="search"
          placeholder="Search patient, email or doctor"
          value={filters.q}
          onChange={(event) => update({ q: event.target.value })}
          className={control}
        />
        <label className="sr-only" htmlFor="admin-status">
          Status
        </label>
        <select
          id="admin-status"
          value={filters.status}
          onChange={(event) => update({ status: event.target.value as BookingFilters["status"] })}
          className={control}
        >
          <option value="all">Any status</option>
          {bookingStatuses.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor="admin-doctor">
          Doctor
        </label>
        <select
          id="admin-doctor"
          value={filters.doctor}
          onChange={(event) => update({ doctor: event.target.value })}
          className={control}
        >
          <option value="">Any doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.slug} value={doctor.slug}>
              {doctor.name}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "booking" : "bookings"}
        {bookings.length >= 300 ? " (showing the latest 300)" : ""}
      </p>

      {view.items.length === 0 ? (
        <p className="mt-6 rounded-xl border bg-background p-6 text-center text-muted-foreground">
          No bookings match those filters.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {view.items.map((booking) => (
            <BookingRow key={booking.id} booking={booking} showDoctor />
          ))}
        </ul>
      )}

      {view.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            disabled={view.page <= 1}
            onClick={() => setPage(view.page - 1)}
            className="rounded-full border px-5 py-2 text-sm font-semibold transition hover:border-primary disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {view.page} of {view.totalPages}
          </span>
          <button
            type="button"
            disabled={view.page >= view.totalPages}
            onClick={() => setPage(view.page + 1)}
            className="rounded-full border px-5 py-2 text-sm font-semibold transition hover:border-primary disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
