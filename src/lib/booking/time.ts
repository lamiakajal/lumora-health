/**
 * Time zone helpers built on Intl, so no date library is needed.
 * Clinic hours are written as local wall-clock times ("09:00" in the doctor's
 * time zone). Everything stored in the database is a UTC instant.
 */

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function partsFormatter(timeZone: string): Intl.DateTimeFormat {
  let formatter = formatterCache.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    formatterCache.set(timeZone, formatter);
  }
  return formatter;
}

/** How far the wall clock in `timeZone` is ahead of UTC at this instant, in ms. */
export function getTimeZoneOffsetMs(instant: Date, timeZone: string): number {
  const parts = partsFormatter(timeZone).formatToParts(instant);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);
  const wallClockAsUtc = Date.UTC(
    read("year"),
    read("month") - 1,
    read("day"),
    read("hour") % 24,
    read("minute"),
    read("second"),
  );
  const instantWithoutMs = Math.floor(instant.getTime() / 1000) * 1000;
  return wallClockAsUtc - instantWithoutMs;
}

/** "2026-11-23" + "09:00" in America/New_York -> the matching UTC instant. */
export function zonedTimeToUtc(date: string, time: string, timeZone: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const wallClock = Date.UTC(year, month - 1, day, hour, minute);

  // Two passes so the answer is right on the days the clocks change.
  const firstGuess = wallClock - getTimeZoneOffsetMs(new Date(wallClock), timeZone);
  const secondOffset = getTimeZoneOffsetMs(new Date(firstGuess), timeZone);
  return new Date(wallClock - secondOffset);
}

/** The calendar date ("YYYY-MM-DD") that an instant falls on in a time zone. */
export function localDateOf(instant: Date, timeZone: string): string {
  const parts = partsFormatter(timeZone).formatToParts(instant);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${read("year")}-${read("month")}-${read("day")}`;
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function isValidLocalDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

/** 0 = Sunday ... 6 = Saturday, for a calendar date (the same in every time zone). */
export function dayOfWeek(date: string): number {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function addDays(date: string, amount: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const result = new Date(Date.UTC(year, month - 1, day + amount));
  return result.toISOString().slice(0, 10);
}

export function minutesOfDay(time: string): number {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

export function formatMinutes(total: number): string {
  const hour = Math.floor(total / 60);
  const minute = total % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

/** "9:30 AM" */
export function formatTime(instant: Date | string, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit" }).format(
    new Date(instant),
  );
}

/** "Mon, Nov 23" */
export function formatDay(instant: Date | string, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(instant));
}

/** "PST", "EDT" ... the short name of the zone at that moment. */
export function timeZoneLabel(instant: Date | string, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "short" }).formatToParts(
    new Date(instant),
  );
  return parts.find((part) => part.type === "timeZoneName")?.value ?? timeZone;
}

/** Pieces for a date picker button: { weekday: "Mon", day: "23", month: "Nov" }. */
export function describeLocalDate(date: string): { weekday: string; day: string; month: string } {
  const noon = new Date(`${date}T12:00:00.000Z`);
  const format = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...options }).format(noon);
  return {
    weekday: format({ weekday: "short" }),
    day: format({ day: "numeric" }),
    month: format({ month: "short" }),
  };
}

/** The hour (0-23) an instant falls in, on the wall clock of a time zone. */
export function localHour(instant: Date | string, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(instant));
  return Number(parts.find((part) => part.type === "hour")?.value) % 24;
}
