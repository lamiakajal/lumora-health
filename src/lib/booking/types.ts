import type { BookingStatus } from "./status";
import type { VisitType } from "./defaults";

/** What the browser is allowed to know about a booking. */
export type BookingSummary = {
  id: string;
  doctorSlug: string;
  doctorName: string;
  specialty: string;
  start: string; // ISO, UTC
  end: string; // ISO, UTC
  timezone: string; // IANA zone to show the time in
  status: BookingStatus;
  visitType: VisitType;
  reason: string;
  priceCents: number;
};

export type AvailabilityResponse = {
  timezone: string;
  timezoneLabel: string;
  durationMinutes: number;
  days: { date: string; slots: string[] }[];
};
