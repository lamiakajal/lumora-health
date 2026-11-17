import { MAX_DAYS_AHEAD, SLOT_MINUTES } from "@/lib/booking/defaults";
import { getDoctorSlots } from "@/lib/booking/service";
import { timeZoneLabel } from "@/lib/booking/time";
import type { AvailabilityResponse } from "@/lib/booking/types";
import { getDoctorBySlug } from "@/lib/services";

/** GET /api/availability?doctor=amelia-hart&days=14 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const doctor = getDoctorBySlug(searchParams.get("doctor") ?? "");
  if (!doctor) return Response.json({ error: "We could not find that doctor." }, { status: 404 });

  const requested = Number(searchParams.get("days") ?? 14);
  const days = Number.isFinite(requested) ? Math.min(Math.max(Math.floor(requested), 1), MAX_DAYS_AHEAD) : 14;
  const now = new Date();

  try {
    const result = await getDoctorSlots(doctor, days, now);
    const body: AvailabilityResponse = {
      timezone: result.config.timezone,
      timezoneLabel: timeZoneLabel(now, result.config.timezone),
      durationMinutes: SLOT_MINUTES,
      days: result.days.map((day) => ({
        date: day.date,
        slots: day.slots.map((slot) => slot.start.toISOString()),
      })),
    };
    return Response.json(body);
  } catch (error) {
    console.error("availability failed", error);
    return Response.json({ error: "We could not load the calendar. Please try again." }, { status: 500 });
  }
}
