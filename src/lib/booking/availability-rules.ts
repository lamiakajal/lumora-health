import type { Interval, WeeklyRule } from "./slots";
import { addDays, isValidLocalDate, localDateOf, minutesOfDay, zonedTimeToUtc } from "./time";

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
export const MAX_WINDOWS_PER_DAY = 4;

/** Returns a friendly message for the first problem found, or null when the hours are fine. */
export function validateWeeklyRules(rules: readonly WeeklyRule[]): string | null {
  for (const rule of rules) {
    if (!Number.isInteger(rule.dayOfWeek) || rule.dayOfWeek < 0 || rule.dayOfWeek > 6) {
      return "Pick a valid day of the week.";
    }
    if (!TIME_PATTERN.test(rule.start) || !TIME_PATTERN.test(rule.end)) {
      return "Use times like 09:00.";
    }
    if (minutesOfDay(rule.end) <= minutesOfDay(rule.start)) {
      return "Each window must end after it starts.";
    }
  }

  for (let day = 0; day < 7; day++) {
    const windows = rules
      .filter((rule) => rule.dayOfWeek === day)
      .sort((a, b) => minutesOfDay(a.start) - minutesOfDay(b.start));
    if (windows.length > MAX_WINDOWS_PER_DAY) {
      return `Use at most ${MAX_WINDOWS_PER_DAY} time windows per day.`;
    }
    for (let index = 1; index < windows.length; index++) {
      if (minutesOfDay(windows[index].start) < minutesOfDay(windows[index - 1].end)) {
        return "Time windows on the same day cannot overlap.";
      }
    }
  }
  return null;
}

/** Holidays and time off as the doctor types them: whole calendar days. */
export type TimeOffEntry = { startDate: string; endDate: string; reason: string };

export function validateTimeOff(entries: readonly TimeOffEntry[]): string | null {
  for (const entry of entries) {
    if (!isValidLocalDate(entry.startDate) || !isValidLocalDate(entry.endDate)) {
      return "Choose valid dates for time off.";
    }
    if (entry.endDate < entry.startDate) {
      return "Time off must end on or after the day it starts.";
    }
  }
  return null;
}

/** Whole local days become UTC intervals: midnight at the start to midnight after the last day. */
export function timeOffToIntervals(entries: readonly TimeOffEntry[], timeZone: string): (Interval & { reason: string })[] {
  return entries.map((entry) => ({
    start: zonedTimeToUtc(entry.startDate, "00:00", timeZone),
    end: zonedTimeToUtc(addDays(entry.endDate, 1), "00:00", timeZone),
    reason: entry.reason,
  }));
}

/** The reverse of timeOffToIntervals, for showing saved time off in the editor. */
export function intervalsToTimeOff(
  intervals: readonly { start: Date; end: Date; reason?: string | null }[],
  timeZone: string,
): TimeOffEntry[] {
  return intervals.map((interval) => ({
    startDate: localDateOf(interval.start, timeZone),
    endDate: localDateOf(new Date(interval.end.getTime() - 1), timeZone),
    reason: interval.reason ?? "",
  }));
}
