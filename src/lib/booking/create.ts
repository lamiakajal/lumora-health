import { MAX_DAYS_AHEAD, type VisitType } from "./defaults";
import { generateSlotsForDate, type AvailabilityConfig, type Interval } from "./slots";
import { addDays, localDateOf } from "./time";

export class SlotUnavailableError extends Error {
  constructor(message = "That time is no longer available.") {
    super(message);
    this.name = "SlotUnavailableError";
  }
}

/** MongoDB reports a violated unique index with error code 11000. */
export function isDuplicateKeyError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && (error as { code: unknown }).code === 11000;
}

export type NewBooking = {
  patientId: string;
  providerSlug: string;
  serviceSlug: string;
  start: Date;
  end: Date;
  visitType: VisitType;
  reason: string;
  priceCents: number;
  timezone: string;
};

/** The two things placeBooking needs from the database (easy to fake in tests). */
export type BookingRepo = {
  findBusy: (from: Date, to: Date) => Promise<Interval[]>;
  insert: (booking: NewBooking) => Promise<{ id: string }>;
};

type PlaceBookingArgs = {
  repo: BookingRepo;
  config: AvailabilityConfig;
  booking: Omit<NewBooking, "end" | "timezone">;
  now: Date;
  durationMinutes: number;
  minNoticeMinutes: number;
};

/**
 * Books a slot safely:
 * 1. Work out the real open slots again on the server (the browser is never trusted).
 * 2. Check the requested start is one of them.
 * 3. Insert. If two patients race for the same slot, the database's unique index
 *    rejects the second insert and we turn that into SlotUnavailableError.
 */
export async function placeBooking({
  repo,
  config,
  booking,
  now,
  durationMinutes,
  minNoticeMinutes,
}: PlaceBookingArgs): Promise<{ id: string; start: Date; end: Date }> {
  const date = localDateOf(booking.start, config.timezone);
  const lastAllowedDate = addDays(localDateOf(now, config.timezone), MAX_DAYS_AHEAD);
  if (date > lastAllowedDate) throw new SlotUnavailableError("That date is too far ahead to book.");

  const dayBefore = new Date(booking.start.getTime() - 24 * 60 * 60_000);
  const dayAfter = new Date(booking.start.getTime() + 24 * 60 * 60_000);
  const busy = await repo.findBusy(dayBefore, dayAfter);

  const openSlots = generateSlotsForDate(date, config, { now, minNoticeMinutes, durationMinutes, busy });
  const slot = openSlots.find((candidate) => candidate.start.getTime() === booking.start.getTime());
  if (!slot) throw new SlotUnavailableError();

  try {
    const { id } = await repo.insert({ ...booking, end: slot.end, timezone: config.timezone });
    return { id, start: slot.start, end: slot.end };
  } catch (error) {
    if (isDuplicateKeyError(error)) throw new SlotUnavailableError();
    throw error;
  }
}
