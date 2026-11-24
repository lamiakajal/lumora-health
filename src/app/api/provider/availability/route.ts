import { requireStaff } from "@/lib/auth/provider-session";
import { validateTimeOff, validateWeeklyRules } from "@/lib/booking/availability-rules";
import { saveAvailability } from "@/lib/booking/provider-service";
import { availabilitySchema } from "@/lib/validation/provider";

/** PUT /api/provider/availability: save the signed-in doctor's weekly hours and time off. */
export async function PUT(request: Request) {
  const staff = await requireStaff(request);
  if (staff instanceof Response) return staff;
  if (!staff.provider) {
    return Response.json({ error: "Your account is not linked to a doctor profile yet." }, { status: 403 });
  }

  const parsed = availabilitySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Please check your hours and try again." }, { status: 422 });
  }

  const problem = validateWeeklyRules(parsed.data.weekly) ?? validateTimeOff(parsed.data.timeOff);
  if (problem) return Response.json({ error: problem }, { status: 422 });

  try {
    await saveAvailability({ provider: staff.provider, ...parsed.data });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("saving availability failed", error);
    return Response.json({ error: "We could not save your hours. Please try again." }, { status: 500 });
  }
}
