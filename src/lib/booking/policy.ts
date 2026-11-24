import { isActiveStatus, type BookingStatus } from "./status";

/** Patients can move a visit up to this many hours before it starts. */
export const RESCHEDULE_MIN_HOURS = 24;

type Options = { isAdmin?: boolean };

/** Only pending or confirmed visits can move, and not at the last minute (admins can always). */
export function canReschedule(status: BookingStatus, start: Date, now: Date, { isAdmin = false }: Options = {}): boolean {
  if (!isActiveStatus(status)) return false;
  if (isAdmin) return start.getTime() > now.getTime();
  return start.getTime() - now.getTime() >= RESCHEDULE_MIN_HOURS * 60 * 60_000;
}
