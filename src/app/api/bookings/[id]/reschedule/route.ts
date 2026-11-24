import { after } from "next/server";
import { auth } from "@/lib/auth/server";
import { normalizeRole } from "@/lib/auth/roles";
import { rescheduleBooking } from "@/lib/booking/service";
import { notifyBookingRescheduled } from "@/lib/email/notify";
import { rescheduleRequestSchema } from "@/lib/validation/booking";

type Context = { params: Promise<{ id: string }> };

/** POST /api/bookings/:id/reschedule with { "start": "<ISO time>" } */
export async function POST(request: Request, { params }: Context) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Please sign in." }, { status: 401 });

  const parsed = rescheduleRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Choose a valid time." }, { status: 422 });

  const { id } = await params;
  const role = normalizeRole((session.user as { role?: unknown }).role);

  try {
    const result = await rescheduleBooking({
      bookingId: id,
      userId: session.user.id,
      isAdmin: role === "admin",
      newStart: new Date(parsed.data.start),
      now: new Date(),
    });

    if (!result.ok) {
      if (result.reason === "not-found") {
        return Response.json({ error: "We could not find that appointment." }, { status: 404 });
      }
      if (result.reason === "too-late") {
        return Response.json(
          { error: "This visit is too close to change online. Please call us and we will help." },
          { status: 409 },
        );
      }
      return Response.json({ error: result.message ?? "That time is no longer available." }, { status: 409 });
    }

    after(() => notifyBookingRescheduled(result.booking, result.previousStart.toISOString()));
    return Response.json({
      id: result.booking.bookingId,
      start: result.booking.start,
      timezone: result.booking.timezone,
    });
  } catch (error) {
    console.error("reschedule failed", error);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
