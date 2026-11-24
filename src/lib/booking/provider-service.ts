import { isValidObjectId, type Types } from "mongoose";
import { AvailabilityModel, BookingModel, ProviderModel } from "@/lib/db/models";
import { connectToDatabase } from "@/lib/db/mongoose";
import type { BookingEmailData } from "@/lib/email/templates";
import { getDoctorBySlug } from "@/lib/services";
import {
  intervalsToTimeOff,
  timeOffToIntervals,
  type TimeOffEntry,
} from "./availability-rules";
import { defaultAvailability, SLOT_MINUTES, timezoneFor } from "./defaults";
import {
  toEmailData,
  toProviderBooking,
  type BookingRow,
} from "./service";
import type { WeeklyRule } from "./slots";
import { actionTarget, decideStatusChange, type BookingStatus, type StatusAction } from "./status";
import type { EditorAvailability, ProviderBooking } from "./types";

export type ProviderProfile = {
  _id: Types.ObjectId;
  slug: string;
  name: string;
  timezone: string;
};

/** The doctor profile linked to a signed-in account (set with scripts/link-doctor.mjs). */
export async function getProviderForUser(userId: string): Promise<ProviderProfile | null> {
  await connectToDatabase();
  const provider = await ProviderModel.findOne({ userId }).lean();
  if (!provider) return null;
  return { _id: provider._id, slug: provider.slug, name: provider.name, timezone: provider.timezone };
}

export async function listProviderBookings(providerId: Types.ObjectId): Promise<ProviderBooking[]> {
  await connectToDatabase();
  const rows = await BookingModel.find({ providerId }).sort({ start: 1 }).lean();
  return rows.map((row) => toProviderBooking(row as unknown as BookingRow));
}

type ChangeArgs = {
  bookingId: string;
  action: StatusAction;
  /** Doctors are limited to their own bookings; admins pass null to act on any. */
  providerId: Types.ObjectId | null;
  now: Date;
};

export type ChangeResult =
  | { ok: true; booking: BookingEmailData; status: BookingStatus }
  | { ok: false; reason: "not-found" | "invalid" | "too-early" };

/** Confirms, completes or cancels a booking, following the status rules. */
export async function changeBookingStatus({ bookingId, action, providerId, now }: ChangeArgs): Promise<ChangeResult> {
  if (!isValidObjectId(bookingId)) return { ok: false, reason: "not-found" };
  await connectToDatabase();

  const current = await BookingModel.findOne({
    _id: bookingId,
    ...(providerId ? { providerId } : {}),
  }).lean();
  if (!current) return { ok: false, reason: "not-found" };

  const decision = decideStatusChange(current.status as BookingStatus, action, current.start, now);
  if (decision !== "ok") return { ok: false, reason: decision };

  const target = actionTarget[action];
  const updated = await BookingModel.findOneAndUpdate(
    // Matching on the old status means two doctors clicking at once cannot both win.
    { _id: bookingId, status: current.status },
    {
      $set: {
        status: target,
        ...(action === "cancel" ? { cancelledAt: now, cancelReason: "Cancelled by the clinic" } : {}),
      },
    },
    { new: true },
  ).lean();

  if (!updated) return { ok: false, reason: "invalid" };
  return { ok: true, booking: toEmailData(updated as unknown as BookingRow), status: target };
}

/** What the hours editor starts from: saved hours, or the defaults. */
export async function getEditorAvailability(provider: ProviderProfile): Promise<EditorAvailability> {
  await connectToDatabase();
  const saved = await AvailabilityModel.findOne({ providerId: provider._id }).lean();
  const doctor = getDoctorBySlug(provider.slug);

  if (!saved) {
    const fallback = doctor
      ? defaultAvailability(doctor)
      : { timezone: provider.timezone, weekly: [], slotMinutes: SLOT_MINUTES, bufferMinutes: 0 };
    return {
      timezone: provider.timezone,
      weekly: fallback.weekly,
      slotMinutes: fallback.slotMinutes,
      bufferMinutes: fallback.bufferMinutes,
      timeOff: [],
    };
  }

  return {
    timezone: provider.timezone,
    weekly: saved.weekly.map((rule) => ({ dayOfWeek: rule.dayOfWeek, start: rule.start, end: rule.end })),
    slotMinutes: saved.slotMinutes,
    bufferMinutes: saved.bufferMinutes,
    timeOff: intervalsToTimeOff(saved.timeOff, provider.timezone),
  };
}

type SaveArgs = {
  provider: ProviderProfile;
  weekly: WeeklyRule[];
  slotMinutes: number;
  bufferMinutes: number;
  timeOff: TimeOffEntry[];
};

export async function saveAvailability({ provider, weekly, slotMinutes, bufferMinutes, timeOff }: SaveArgs) {
  await connectToDatabase();
  await AvailabilityModel.findOneAndUpdate(
    { providerId: provider._id },
    {
      $set: {
        weekly,
        slotMinutes,
        bufferMinutes,
        timeOff: timeOffToIntervals(timeOff, provider.timezone),
      },
    },
    { upsert: true, new: true },
  );
}

/** The time zone to use for a doctor who has no saved profile yet. */
export function providerTimezone(slug: string): string {
  const doctor = getDoctorBySlug(slug);
  return doctor ? timezoneFor(doctor) : "America/Los_Angeles";
}

/**
 * Confirmed bookings starting within the next `withinHours` hours that have not had a
 * reminder yet. Used by the daily reminder job.
 */
export async function findBookingsNeedingReminder(now: Date, withinHours: number) {
  await connectToDatabase();
  const until = new Date(now.getTime() + withinHours * 60 * 60_000);
  const rows = await BookingModel.find({
    status: "confirmed",
    reminderSentAt: { $exists: false },
    start: { $gt: now, $lte: until },
  }).lean();
  return rows.map((row) => ({ id: String(row._id), email: toEmailData(row as unknown as BookingRow) }));
}

/** Marks the reminder as sent. Returns false if another run already did (so it is not sent twice). */
export async function markReminderSent(bookingId: string, now: Date): Promise<boolean> {
  const updated = await BookingModel.findOneAndUpdate(
    { _id: bookingId, reminderSentAt: { $exists: false } },
    { $set: { reminderSentAt: now } },
  );
  return Boolean(updated);
}

/** Puts a booking back in the "needs reminder" list after a failed send. */
export async function unmarkReminder(bookingId: string): Promise<void> {
  await BookingModel.updateOne({ _id: bookingId }, { $unset: { reminderSentAt: 1 } });
}
