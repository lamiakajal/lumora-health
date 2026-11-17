import { auth } from "@/lib/auth/server";
import { normalizeRole } from "@/lib/auth/roles";
import { cancelBooking } from "@/lib/booking/service";
import { cancelRequestSchema } from "@/lib/validation/booking";

type Context = { params: Promise<{ id: string }> };

/** PATCH /api/bookings/:id with { "action": "cancel" } */
export async function PATCH(request: Request, { params }: Context) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Please sign in." }, { status: 401 });

  const parsed = cancelRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "That request is not supported." }, { status: 422 });

  const { id } = await params;
  const role = normalizeRole((session.user as { role?: unknown }).role);

  const cancelled = await cancelBooking({
    bookingId: id,
    userId: session.user.id,
    isAdmin: role === "admin",
    reason: parsed.data.reason,
  });

  if (!cancelled) {
    return Response.json({ error: "We could not cancel that appointment." }, { status: 404 });
  }
  return Response.json({ ok: true });
}
