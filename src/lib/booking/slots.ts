import { addDays, dayOfWeek, formatMinutes, minutesOfDay, zonedTimeToUtc } from "./time";

export type WeeklyRule = {
  /** 0 = Sunday ... 6 = Saturday */
  dayOfWeek: number;
  /** Local time in the doctor's time zone, "HH:mm" */
  start: string;
  end: string;
};

export type Interval = { start: Date; end: Date };

export type AvailabilityConfig = {
  /** IANA name, e.g. "America/Los_Angeles". Working hours are written in this zone. */
  timezone: string;
  weekly: WeeklyRule[];
  slotMinutes: number;
  bufferMinutes: number;
  /** Holidays and time off, as UTC intervals. */
  timeOff: Interval[];
};

export type SlotOptions = {
  now: Date;
  /** Slots that start sooner than this are hidden. */
  minNoticeMinutes?: number;
  /** Visit length. Defaults to slotMinutes. */
  durationMinutes?: number;
  /** Already booked intervals for this doctor. */
  busy?: Interval[];
};

/** True when two intervals share any time. Touching ends (10:00-10:30, 10:30-11:00) do not overlap. */
export function overlaps(a: Interval, b: Interval): boolean {
  return a.start < b.end && b.start < a.end;
}

/** Every bookable slot on one local calendar date. */
export function generateSlotsForDate(
  date: string,
  config: AvailabilityConfig,
  options: SlotOptions,
): Interval[] {
  const rules = config.weekly
    .filter((rule) => rule.dayOfWeek === dayOfWeek(date))
    .sort((a, b) => minutesOfDay(a.start) - minutesOfDay(b.start));

  const duration = options.durationMinutes ?? config.slotMinutes;
  const step = config.slotMinutes + config.bufferMinutes;
  const earliest = options.now.getTime() + (options.minNoticeMinutes ?? 0) * 60_000;
  const blocked = [...config.timeOff, ...(options.busy ?? [])];
  const slots: Interval[] = [];

  if (duration <= 0 || step <= 0) return slots;

  for (const rule of rules) {
    const windowEnd = minutesOfDay(rule.end);
    for (let minute = minutesOfDay(rule.start); minute + duration <= windowEnd; minute += step) {
      const start = zonedTimeToUtc(date, formatMinutes(minute), config.timezone);
      const candidate = { start, end: new Date(start.getTime() + duration * 60_000) };

      if (start.getTime() < earliest) continue;
      if (blocked.some((interval) => overlaps(candidate, interval))) continue;
      slots.push(candidate);
    }
  }
  return slots;
}

export type DaySlots = { date: string; slots: Interval[] };

/** Slots for `days` consecutive local dates starting at `fromDate`. */
export function generateSlots(
  fromDate: string,
  days: number,
  config: AvailabilityConfig,
  options: SlotOptions,
): DaySlots[] {
  return Array.from({ length: days }, (_, index) => {
    const date = addDays(fromDate, index);
    return { date, slots: generateSlotsForDate(date, config, options) };
  });
}
