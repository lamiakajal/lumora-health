import { isValidObjectId, type Types } from "mongoose";
import type { Doctor } from "@/data/doctors";
import { AvailabilityModel, BookingModel, ProviderModel } from "@/lib/db/models";
import { connectToDatabase } from "@/lib/db/mongoose";
import { getDoctorBySlug } from "@/lib/services";
import { placeBooking, isDuplicateKeyError, type BookingRepo } from "./create";
import {
  defaultAvailability,
  MIN_NOTICE_MINUTES,
  priceCentsFor,
  SLOT_MINUTES,
  type VisitType,
} from "./defaults";
import { generateSlots, type AvailabilityConfig, type DaySlots, type Interval } from "./slots";
import { activeStatuses, type BookingStatus } from "./status";
import type { BookingEmailData } from "@/lib/email/templates";
import type { BookingSummary, ProviderBooking } from "./types";
import { addDays, localDateOf, zonedTimeToUtc } from "./time";

const DAY_MS = 24 * 60 * 60_000;

/** The doctor's saved schedule, or sensible default hours until one is saved. */
export async function loadAvailability(doctor: Doctor): Promise<AvailabilityConfig> {
  await connectToDatabase();
  const provider = await ProviderModel.findOne({ slug: doctor.slug }).lean();
  if (!provider) return defaultAvailability(doctor);

  const saved = await AvailabilityModel.findOne({ providerId: provider._id }).lean();
  if (!saved) return { ...defaultAvailability(doctor), timezone: provider.timezone };

  return {
    timezone: provider.timezone,
    weekly: saved.weekly.map((rule) => ({ dayOfWeek: rule.dayOfWeek, start: rule.start, end: rule.end })),
    slotMinutes: saved.slotMinutes,
    bufferMinutes: saved.bufferMinutes,
    timeOff: saved.timeOff.map((off) => ({ start: off.start, end: off.end })),
  };
}

async function findBusy(providerId: Types.ObjectId, from: Date, to: Date): Promise<Interval[]> {
  const rows = await BookingModel.find({
    providerId,
    status: { $in: [...activeStatuses] },
    start: { $lt: to },
    end: { $gt: from },
  })
    .select({ start: 1, end: 1 })
    .lean();
  return rows.map((row) => ({ start: row.start, end: row.end }));
}

async function findBusyBySlug(slug: string, from: Date, to: Date): Promise<Interval[]> {
  const provider = await ProviderModel.findOne({ slug }).select({ _id: 1 }).lean();
  return provider ? findBusy(provider._id, from, to) : [];
}

/** Open slots for the next `days` local days, with already booked times removed. */
export async function getDoctorSlots(
  doctor: Doctor,
  days: number,
  now: Date,
): Promise<{ config: AvailabilityConfig; days: DaySlots[] }> {
  const config = await loadAvailability(doctor);
  const today = localDateOf(now, config.timezone);
  const rangeEnd = zonedTimeToUtc(addDays(today, days + 1), "00:00", config.timezone);
  const busy = await findBusyBySlug(doctor.slug, new Date(now.getTime() - DAY_MS), rangeEnd);

  return {
    config,
    days: generateSlots(today, days, config, { now, minNoticeMinutes: MIN_NOTICE_MINUTES, busy }),
  };
}

async function ensureProvider(doctor: Doctor, timezone: string) {
  const find = () =>
    ProviderModel.findOneAndUpdate(
      { slug: doctor.slug },
      {
        $setOnInsert: {
          slug: doctor.slug,
          name: doctor.name,
          serviceSlugs: [doctor.serviceSlug],
          timezone,
          active: true,
        },
      },
      { upsert: true, new: true },
    );
  try {
    return await find();
  } catch (error) {
    // Two first-ever bookings at once can both try to create the provider. Just read it.
    if (isDuplicateKeyError(error)) return find();
    throw error;
  }
}

type CreateArgs = {
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctor: Doctor;
  start: Date;
  visitType: VisitType;
  reason: string;
};

export async function createBookingForPatient({
  patientId,
  patientName,
  patientEmail,
  doctor,
  start,
  visitType,
  reason,
}: CreateArgs) {
  const config = await loadAvailability(doctor);
  const provider = await ensureProvider(doctor, config.timezone);

  const repo: BookingRepo = {
    findBusy: (from, to) => findBusy(provider._id, from, to),
    async insert(booking) {
      const created = await BookingModel.create({
        ...booking,
        providerId: provider._id,
        status: "pending",
      });
      return { id: String(created._id) };
    },
  };

  const result = await placeBooking({
    repo,
    config,
    booking: {
      patientId,
      patientName,
      patientEmail,
      providerSlug: doctor.slug,
      serviceSlug: doctor.serviceSlug,
      start,
      visitType,
      reason,
      priceCents: priceCentsFor(doctor, visitType),
    },
    now: new Date(),
    durationMinutes: SLOT_MINUTES,
    minNoticeMinutes: MIN_NOTICE_MINUTES,
  });

  return { ...result, timezone: config.timezone };
}

export type BookingRow = {
  _id: Types.ObjectId;
  patientName?: string | null;
  patientEmail?: string | null;
  providerSlug: string;
  start: Date;
  end: Date;
  timezone: string;
  status: string;
  visitType: string;
  reason?: string | null;
  priceCents: number;
};

function toSummary(row: BookingRow): BookingSummary {
  const doctor = getDoctorBySlug(row.providerSlug);
  return {
    id: String(row._id),
    doctorSlug: row.providerSlug,
    doctorName: doctor?.name ?? "Your doctor",
    specialty: doctor?.specialty ?? "",
    start: row.start.toISOString(),
    end: row.end.toISOString(),
    timezone: row.timezone,
    status: row.status as BookingStatus,
    visitType: row.visitType === "video" ? "video" : "in-person",
    reason: row.reason ?? "",
    priceCents: row.priceCents,
  };
}

export function toProviderBooking(row: BookingRow): ProviderBooking {
  return {
    ...toSummary(row),
    patientName: row.patientName ?? "Patient",
    patientEmail: row.patientEmail ?? "",
  };
}

/** Everything an email about this booking needs. */
export function toEmailData(row: BookingRow): BookingEmailData {
  const summary = toSummary(row);
  return {
    bookingId: summary.id,
    patientName: row.patientName ?? "there",
    patientEmail: row.patientEmail ?? "",
    doctorName: summary.doctorName,
    specialty: summary.specialty,
    start: summary.start,
    timezone: summary.timezone,
    visitType: summary.visitType,
    reason: summary.reason,
  };
}

/** A patient's appointments, soonest first. */
export async function listBookings(patientId: string): Promise<BookingSummary[]> {
  await connectToDatabase();
  const rows = await BookingModel.find({ patientId }).sort({ start: 1 }).lean();
  return rows.map((row) => toSummary(row as unknown as BookingRow));
}

type CancelArgs = { bookingId: string; userId: string; isAdmin: boolean; reason: string };

/** Cancels a pending or confirmed booking and returns it (for the email). Patients can only cancel their own. */
export async function cancelBooking({
  bookingId,
  userId,
  isAdmin,
  reason,
}: CancelArgs): Promise<BookingEmailData | null> {
  if (!isValidObjectId(bookingId)) return null;
  await connectToDatabase();

  const updated = await BookingModel.findOneAndUpdate(
    {
      _id: bookingId,
      status: { $in: [...activeStatuses] }, // only pending or confirmed can be cancelled
      ...(isAdmin ? {} : { patientId: userId }),
    },
    { $set: { status: "cancelled", cancelledAt: new Date(), cancelReason: reason } },
    { new: true },
  ).lean();
  return updated ? toEmailData(updated as unknown as BookingRow) : null;
}
