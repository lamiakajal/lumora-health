import type { BookingStatus } from "./status";
import type { TimeOffEntry } from "./availability-rules";
import type { VisitType } from "./defaults";
import type { WeeklyRule } from "./slots";

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

/** A booking as the doctor or an admin sees it (includes who the patient is). */
export type ProviderBooking = BookingSummary & {
  patientName: string;
  patientEmail: string;
};

/** The hours editor's starting point (also what the doctor dashboard loads). */
export type EditorAvailability = {
  timezone: string;
  weekly: WeeklyRule[];
  slotMinutes: number;
  bufferMinutes: number;
  timeOff: TimeOffEntry[];
};
