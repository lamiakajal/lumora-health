import { after } from "next/server";
import { auth } from "@/lib/auth/server";
import { SlotUnavailableError } from "@/lib/booking/create";
import { createBookingForPatient } from "@/lib/booking/service";
import { notifyBookingRequested } from "@/lib/email/notify";
import { getDoctorBySlug } from "@/lib/services";
import { fieldErrors } from "@/lib/validation/auth";
import { bookingRequestSchema } from "@/lib/validation/booking";

/** POST /api/bookings: book a slot for the signed-in patient. */
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Please sign in to book." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = bookingRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Please check the details and try again.", fields: fieldErrors(parsed.error.issues) },
      { status: 422 },
    );
  }

  const doctor = getDoctorBySlug(parsed.data.doctorSlug);
  if (!doctor) return Response.json({ error: "We could not find that doctor." }, { status: 404 });
  if (parsed.data.visitType === "video" && !doctor.telehealth) {
    return Response.json({ error: "This doctor does not offer video visits." }, { status: 422 });
  }

  try {
    const booking = await createBookingForPatient({
      patientId: session.user.id,
      patientName: session.user.name,
      patientEmail: session.user.email,
      doctor,
      start: new Date(parsed.data.start),
      visitType: parsed.data.visitType,
      reason: parsed.data.reason,
    });
    // The email goes out after the response is sent, so a slow mail server never slows booking down.
    after(() =>
      notifyBookingRequested({
        bookingId: booking.id,
        patientName: session.user.name,
        patientEmail: session.user.email,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        start: booking.start.toISOString(),
        timezone: booking.timezone,
        visitType: parsed.data.visitType,
        reason: parsed.data.reason,
      }),
    );

    return Response.json(
      {
        id: booking.id,
        start: booking.start.toISOString(),
        end: booking.end.toISOString(),
        timezone: booking.timezone,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof SlotUnavailableError) {
      return Response.json({ error: error.message }, { status: 409 });
    }
    console.error("booking failed", error);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
