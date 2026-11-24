import { auth } from "@/lib/auth/server";
import { hasRole, normalizeRole, type Role } from "@/lib/auth/roles";
import { getProviderForUser, type ProviderProfile } from "@/lib/booking/provider-service";

export type StaffContext = {
  userId: string;
  role: Role;
  /** The doctor profile linked to this account, if there is one. */
  provider: ProviderProfile | null;
};

/** For API routes used by doctors and administrators. Returns either who is calling, or the error response to send. */
export async function requireStaff(request: Request): Promise<StaffContext | Response> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Please sign in." }, { status: 401 });

  const role = normalizeRole((session.user as { role?: unknown }).role);
  if (!hasRole(role, ["doctor", "admin"])) {
    // Same answer as a missing page, so these routes are not advertised to patients.
    return Response.json({ error: "Not found." }, { status: 404 });
  }

  const provider = role === "doctor" ? await getProviderForUser(session.user.id) : null;
  return { userId: session.user.id, role, provider };
}
