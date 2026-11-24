import type { BookingStatus } from "@/lib/booking/status";

export type RevenueBucket = {
  /** Monday of the week, "YYYY-MM-DD" */
  weekStart: string;
  label: string;
  /** Value of visits already completed, in cents */
  completed: number;
  /** Value of pending and confirmed visits still to come, in cents */
  upcoming: number;
  visits: number;
};

type RevenueInput = { start: string | Date; status: BookingStatus; priceCents: number };

const DAY_MS = 24 * 60 * 60_000;

/** UTC midnight of the Monday on or before this date. */
function mondayOf(date: Date): number {
  const sinceMonday = (date.getUTCDay() + 6) % 7;
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - sinceMonday);
}

/** Visit value per week for the last `weeks` weeks, ending with the week that contains `now`. */
export function weeklyRevenue(bookings: readonly RevenueInput[], weeks: number, now: Date): RevenueBucket[] {
  const lastMonday = mondayOf(now);
  const label = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "short", day: "numeric" });

  const buckets = Array.from({ length: weeks }, (_, index) => {
    const startMs = lastMonday - (weeks - 1 - index) * 7 * DAY_MS;
    return {
      startMs,
      bucket: {
        weekStart: new Date(startMs).toISOString().slice(0, 10),
        label: label.format(new Date(startMs)),
        completed: 0,
        upcoming: 0,
        visits: 0,
      } satisfies RevenueBucket,
    };
  });

  for (const booking of bookings) {
    if (booking.status === "cancelled") continue;
    const weekMs = mondayOf(new Date(booking.start));
    const target = buckets.find((entry) => entry.startMs === weekMs);
    if (!target) continue;
    target.bucket.visits += 1;
    if (booking.status === "completed") target.bucket.completed += booking.priceCents;
    else target.bucket.upcoming += booking.priceCents;
  }

  return buckets.map((entry) => entry.bucket);
}
