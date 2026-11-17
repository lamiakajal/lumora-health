import type { Doctor } from "@/data/doctors";
import type { AvailabilityConfig, WeeklyRule } from "./slots";

export const SLOT_MINUTES = 30;
/** Patients cannot book a visit that starts sooner than this. */
export const MIN_NOTICE_MINUTES = 120;
/** How far ahead the calendar reaches. */
export const MAX_DAYS_AHEAD = 30;

const CANADIAN_CREDENTIALS = /\b(CCFP|FRCPC|FRCSC|CPsych)\b/;

/** Doctors with Canadian credentials work Eastern time, the rest Pacific (placeholder data). */
export function timezoneFor(doctor: Doctor): string {
  return CANADIAN_CREDENTIALS.test(doctor.credentials) ? "America/Toronto" : "America/Los_Angeles";
}

/**
 * Hours used until a doctor's own schedule is saved in the database:
 * Monday to Friday 9-12 and 1-5, plus Saturday mornings for primary care.
 */
export function defaultAvailability(doctor: Doctor): AvailabilityConfig {
  const weekly: WeeklyRule[] = [1, 2, 3, 4, 5].flatMap((day) => [
    { dayOfWeek: day, start: "09:00", end: "12:00" },
    { dayOfWeek: day, start: "13:00", end: "17:00" },
  ]);
  if (doctor.category === "primary") {
    weekly.push({ dayOfWeek: 6, start: "09:00", end: "13:00" });
  }

  return {
    timezone: timezoneFor(doctor),
    weekly,
    slotMinutes: SLOT_MINUTES,
    bufferMinutes: 0,
    timeOff: [],
  };
}

export type VisitType = "in-person" | "video";

/** Placeholder prices in US cents; they match the pricing section on the home page. */
export function priceCentsFor(doctor: Doctor, visitType: VisitType): number {
  if (visitType === "video") return 7900;
  return doctor.category === "primary" ? 12900 : 18900;
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}
