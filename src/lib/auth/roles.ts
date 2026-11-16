export const roles = ["patient", "doctor", "admin"] as const;
export type Role = (typeof roles)[number];

/** Anything we do not recognise is treated as the least-privileged role. */
export function normalizeRole(value: unknown): Role {
  return typeof value === "string" && (roles as readonly string[]).includes(value)
    ? (value as Role)
    : "patient";
}

export function hasRole(role: Role, allowed: readonly Role[]): boolean {
  return allowed.includes(role);
}

export const roleLabels: Record<Role, string> = {
  patient: "Patient",
  doctor: "Doctor",
  admin: "Administrator",
};
