import type { BookingStatus } from "@/lib/booking/status";
import type { ProviderBooking } from "@/lib/booking/types";

export type BookingFilters = {
  q: string;
  status: BookingStatus | "all";
  /** A doctor's slug, or "" for everyone */
  doctor: string;
};

export function filterBookings(bookings: readonly ProviderBooking[], filters: BookingFilters): ProviderBooking[] {
  const needle = filters.q.trim().toLowerCase();
  return bookings.filter((booking) => {
    if (filters.status !== "all" && booking.status !== filters.status) return false;
    if (filters.doctor && booking.doctorSlug !== filters.doctor) return false;
    if (needle) {
      const haystack = `${booking.patientName} ${booking.patientEmail} ${booking.doctorName}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });
}

export function paginate<T>(items: readonly T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(1, Math.floor(page) || 1), totalPages);
  return {
    items: items.slice((current - 1) * pageSize, current * pageSize),
    page: current,
    totalPages,
  };
}
