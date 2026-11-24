import { requireAdminApi } from "@/lib/auth/provider-session";
import { linkDoctorAccount, setProviderActive } from "@/lib/admin/service";
import { linkDoctorSchema, setActiveSchema } from "@/lib/validation/admin";

type Context = { params: Promise<{ slug: string }> };

/** PATCH /api/admin/doctors/:slug with { "active": true | false } */
export async function PATCH(request: Request, { params }: Context) {
  const admin = await requireAdminApi(request);
  if (admin instanceof Response) return admin;

  const parsed = setActiveSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "That request is not supported." }, { status: 422 });

  const { slug } = await params;
  const result = await setProviderActive(slug, parsed.data.active);
  return result.ok ? Response.json({ ok: true }) : Response.json({ error: result.error }, { status: 404 });
}

/** POST /api/admin/doctors/:slug with { "email": "doctor@example.com" } links an account to this doctor. */
export async function POST(request: Request, { params }: Context) {
  const admin = await requireAdminApi(request);
  if (admin instanceof Response) return admin;

  const parsed = linkDoctorSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "Enter a valid email." }, { status: 422 });
  }

  const { slug } = await params;
  try {
    const result = await linkDoctorAccount(slug, parsed.data.email);
    return result.ok ? Response.json({ ok: true }) : Response.json({ error: result.error }, { status: 404 });
  } catch (error) {
    console.error("linking doctor failed", error);
    return Response.json({ error: "We could not link that account. It may already belong to another doctor." }, { status: 409 });
  }
}
