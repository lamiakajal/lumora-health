import { ObjectId } from "mongodb";
import { doctors } from "@/data/doctors";
import { timezoneFor } from "@/lib/booking/defaults";
import { toProviderBooking, type BookingRow } from "@/lib/booking/service";
import type { BookingStatus } from "@/lib/booking/status";
import type { ProviderBooking } from "@/lib/booking/types";
import { BookingModel, ProviderModel } from "@/lib/db/models";
import { getDb } from "@/lib/db/mongo-client";
import { connectToDatabase } from "@/lib/db/mongoose";
import { getDoctorBySlug } from "@/lib/services";
import { weeklyRevenue, type RevenueBucket } from "./revenue";

const WEEKS = 8;
const LIST_LIMIT = 300;

export type StatusTotals = Record<BookingStatus, { count: number; valueCents: number }>;

export type DoctorAdminRow = {
  slug: string;
  name: string;
  specialty: string;
  active: boolean;
  linkedEmail: string | null;
  linked: boolean;
  bookings: number;
};

export type AdminOverview = {
  totals: StatusTotals;
  revenue: RevenueBucket[];
  bookings: ProviderBooking[];
  doctors: DoctorAdminRow[];
};

const emptyTotals = (): StatusTotals => ({
  pending: { count: 0, valueCents: 0 },
  confirmed: { count: 0, valueCents: 0 },
  completed: { count: 0, valueCents: 0 },
  cancelled: { count: 0, valueCents: 0 },
});

/** Everything the admin dashboard shows, loaded in one go. */
export async function getAdminOverview(now: Date): Promise<AdminOverview> {
  await connectToDatabase();
  const since = new Date(now.getTime() - WEEKS * 7 * 24 * 60 * 60_000);

  const [rows, grouped, perDoctor, revenueRows, providers] = await Promise.all([
    BookingModel.find().sort({ start: -1 }).limit(LIST_LIMIT).lean(),
    BookingModel.aggregate([{ $group: { _id: "$status", count: { $sum: 1 }, valueCents: { $sum: "$priceCents" } } }]),
    BookingModel.aggregate([{ $group: { _id: "$providerSlug", count: { $sum: 1 } } }]),
    BookingModel.find({ start: { $gte: since } }).select({ start: 1, status: 1, priceCents: 1 }).lean(),
    ProviderModel.find().lean(),
  ]);

  const totals = emptyTotals();
  for (const group of grouped as { _id: BookingStatus; count: number; valueCents: number }[]) {
    if (group._id in totals) totals[group._id] = { count: group.count, valueCents: group.valueCents };
  }

  const bookingCounts = new Map((perDoctor as { _id: string; count: number }[]).map((item) => [item._id, item.count]));

  // Look up the sign-in email of linked doctors (accounts are stored by Better Auth).
  const userIds = providers.map((provider) => provider.userId).filter((id): id is string => Boolean(id));
  const emailByUserId = new Map<string, string>();
  if (userIds.length > 0) {
    const objectIds = userIds.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id));
    const users = await getDb()
      .collection("user")
      .find({ _id: { $in: [...objectIds, ...userIds] } } as never)
      .project({ email: 1 })
      .toArray();
    for (const user of users) emailByUserId.set(String(user._id), String(user.email ?? ""));
  }
  const providerBySlug = new Map(providers.map((provider) => [provider.slug, provider]));

  return {
    totals,
    revenue: weeklyRevenue(
      revenueRows.map((row) => ({ start: row.start, status: row.status as BookingStatus, priceCents: row.priceCents })),
      WEEKS,
      now,
    ),
    bookings: rows.map((row) => toProviderBooking(row as unknown as BookingRow)),
    doctors: doctors.map((doctor) => {
      const provider = providerBySlug.get(doctor.slug);
      return {
        slug: doctor.slug,
        name: doctor.name,
        specialty: doctor.specialty,
        active: provider ? provider.active !== false : true,
        linked: Boolean(provider?.userId),
        linkedEmail: provider?.userId ? (emailByUserId.get(provider.userId) ?? null) : null,
        bookings: bookingCounts.get(doctor.slug) ?? 0,
      };
    }),
  };
}

export type AdminActionResult = { ok: true } | { ok: false; error: string };

/** Switches a doctor on or off for new bookings. Existing appointments are not touched. */
export async function setProviderActive(slug: string, active: boolean): Promise<AdminActionResult> {
  const doctor = getDoctorBySlug(slug);
  if (!doctor) return { ok: false, error: "We could not find that doctor." };
  await connectToDatabase();

  await ProviderModel.findOneAndUpdate(
    { slug },
    {
      $set: { active },
      $setOnInsert: { slug, name: doctor.name, serviceSlugs: [doctor.serviceSlug], timezone: timezoneFor(doctor) },
    },
    { upsert: true },
  );
  return { ok: true };
}

/** Gives a signed-up account the "doctor" role and links it to a doctor on the site. */
export async function linkDoctorAccount(slug: string, email: string): Promise<AdminActionResult> {
  const doctor = getDoctorBySlug(slug);
  if (!doctor) return { ok: false, error: "We could not find that doctor." };
  await connectToDatabase();

  const users = getDb().collection("user");
  const user = await users.findOne({ email: email.trim().toLowerCase() });
  if (!user) return { ok: false, error: "No account uses that email yet. Ask them to register first." };

  const userId = String(user._id);
  // An account belongs to one doctor at a time.
  await ProviderModel.updateMany({ userId, slug: { $ne: slug } }, { $unset: { userId: 1 } });
  await users.updateOne({ _id: user._id }, { $set: { role: "doctor" } });
  await ProviderModel.findOneAndUpdate(
    { slug },
    {
      $set: { userId },
      $setOnInsert: { slug, name: doctor.name, serviceSlugs: [doctor.serviceSlug], timezone: timezoneFor(doctor), active: true },
    },
    { upsert: true },
  );
  return { ok: true };
}
