import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { hasRole, normalizeRole, type Role } from "@/lib/auth/roles";

/** The signed-in session, or null. Reads cookies, so call it inside <Suspense>. */
export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** Sends visitors who are not signed in to the login page, then back where they were. */
export async function requireUser(nextPath: string) {
  const session = await getSession();
  if (!session) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  const role = normalizeRole((session.user as { role?: unknown }).role);
  return { session, user: session.user, role };
}

/** Like requireUser, but shows a 404 to signed-in people without the right role. */
export async function requireRole(allowed: readonly Role[], nextPath: string) {
  const result = await requireUser(nextPath);
  if (!hasRole(result.role, allowed)) notFound();
  return result;
}
