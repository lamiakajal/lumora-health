import { after } from "next/server";
import { requireStaff } from "@/lib/auth/provider-session";
import { changeBookingStatus } from "@/lib/booking/provider-service";
import { notifyBookingCancelled, notifyBookingConfirmed } from "@/lib/email/notify";
import { statusActionSchema } from "@/lib/validation/provider";

type Context = { params: Promise<{ id: string }> };

const messages = {
  "not-found": { status: 404, error: "We could not find that appointment." },
  invalid: { status: 409, error: "That appointment can no longer be changed that way." },
  "too-early": { status: 409, error: "A visit can only be marked completed after it has started." },
} as const;

/** PATCH /api/provider/bookings/:id with { "action": "confirm" | "complete" | "cancel" } */
export async function PATCH(request: Request, { params }: Context) {
  const staff = await requireStaff(request);
  if (staff instanceof Response) return staff;

  // A doctor who is not linked to a profile has no bookings to manage.
  if (staff.role === "doctor" && !staff.provider) {
    return Response.json({ error: "Your account is not linked to a doctor profile yet." }, { status: 403 });
  }

  const parsed = statusActionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "That request is not supported." }, { status: 422 });

  const { id } = await params;
  const result = await changeBookingStatus({
    bookingId: id,
    action: parsed.data.action,
    providerId: staff.role === "admin" ? null : staff.provider!._id,
    now: new Date(),
  });

  if (!result.ok) {
    const failure = messages[result.reason];
    return Response.json({ error: failure.error }, { status: failure.status });
  }

  if (parsed.data.action === "confirm") after(() => notifyBookingConfirmed(result.booking));
  if (parsed.data.action === "cancel") after(() => notifyBookingCancelled(result.booking, "clinic"));

  return Response.json({ ok: true, status: result.status });
}
