import { describe, expect, it } from "vitest";
import {
  generateSlots,
  generateSlotsForDate,
  overlaps,
  type AvailabilityConfig,
  type Interval,
} from "./slots";

// 2026-11-23 is a Monday. In Los Angeles that is UTC-8, so 09:00 local = 17:00Z.
const MONDAY = "2026-11-23";
const LONG_AGO = new Date("2026-01-01T00:00:00.000Z");

const config: AvailabilityConfig = {
  timezone: "America/Los_Angeles",
  weekly: [
    { dayOfWeek: 1, start: "09:00", end: "12:00" },
    { dayOfWeek: 1, start: "13:00", end: "15:00" },
  ],
  slotMinutes: 30,
  bufferMinutes: 0,
  timeOff: [],
};

const iso = (slots: Interval[]) => slots.map((slot) => slot.start.toISOString());

describe("generateSlotsForDate", () => {
  it("creates slots inside each working window", () => {
    const slots = generateSlotsForDate(MONDAY, config, { now: LONG_AGO });
    expect(slots).toHaveLength(6 + 4); // 09:00-12:00 and 13:00-15:00
    expect(iso(slots)[0]).toBe("2026-11-23T17:00:00.000Z"); // 09:00 PST
    expect(iso(slots)).not.toContain("2026-11-23T20:00:00.000Z"); // 12:00 lunch is not offered
  });

  it("returns nothing on a day with no hours", () => {
    expect(generateSlotsForDate("2026-11-22", config, { now: LONG_AGO })).toEqual([]); // Sunday
  });

  it("spaces slots by the buffer", () => {
    const slots = generateSlotsForDate(MONDAY, { ...config, bufferMinutes: 15 }, { now: LONG_AGO });
    expect(iso(slots).slice(0, 3)).toEqual([
      "2026-11-23T17:00:00.000Z", // 09:00
      "2026-11-23T17:45:00.000Z", // 09:45
      "2026-11-23T18:30:00.000Z", // 10:30
    ]);
  });

  it("never lets a longer visit run past the end of a window", () => {
    const slots = generateSlotsForDate(MONDAY, config, { now: LONG_AGO, durationMinutes: 60 });
    const last = slots.filter((slot) => slot.start.toISOString() < "2026-11-23T21:00:00.000Z").at(-1)!;
    expect(last.end.toISOString()).toBe("2026-11-23T20:00:00.000Z"); // ends at 12:00 at the latest
  });

  it("hides slots that are too soon", () => {
    const now = new Date("2026-11-23T17:10:00.000Z"); // 09:10 local
    const slots = generateSlotsForDate(MONDAY, config, { now, minNoticeMinutes: 60 });
    expect(iso(slots)[0]).toBe("2026-11-23T18:30:00.000Z"); // 10:30, the first slot an hour+ away
  });

  it("hides slots that are in the past", () => {
    const now = new Date("2026-11-24T00:00:00.000Z");
    expect(generateSlotsForDate(MONDAY, config, { now })).toEqual([]);
  });

  it("removes slots that fall in time off", () => {
    const timeOff = [
      { start: new Date("2026-11-23T17:00:00.000Z"), end: new Date("2026-11-23T19:00:00.000Z") },
    ]; // 09:00-11:00 local
    const slots = generateSlotsForDate(MONDAY, { ...config, timeOff }, { now: LONG_AGO });
    expect(iso(slots)[0]).toBe("2026-11-23T19:00:00.000Z"); // 11:00
  });
});

describe("double booking", () => {
  it("removes a slot that is already booked", () => {
    const busy = [
      { start: new Date("2026-11-23T17:30:00.000Z"), end: new Date("2026-11-23T18:00:00.000Z") },
    ]; // 09:30-10:00
    const slots = generateSlotsForDate(MONDAY, config, { now: LONG_AGO, busy });
    expect(iso(slots)).not.toContain("2026-11-23T17:30:00.000Z");
    expect(iso(slots)).toContain("2026-11-23T17:00:00.000Z");
    expect(iso(slots)).toContain("2026-11-23T18:00:00.000Z");
  });

  it("blocks every slot a longer visit would overlap", () => {
    const busy = [
      { start: new Date("2026-11-23T17:30:00.000Z"), end: new Date("2026-11-23T18:00:00.000Z") },
    ];
    const slots = generateSlotsForDate(MONDAY, config, { now: LONG_AGO, busy, durationMinutes: 60 });
    // A 09:00 visit would run to 10:00 and collide with the 09:30 booking.
    expect(iso(slots)).not.toContain("2026-11-23T17:00:00.000Z");
  });
});

describe("overlaps", () => {
  const at = (hour: number, minute: number): Date => new Date(Date.UTC(2026, 10, 23, hour, minute));

  it("detects shared time", () => {
    expect(overlaps({ start: at(10, 0), end: at(10, 30) }, { start: at(10, 15), end: at(10, 45) })).toBe(true);
  });

  it("allows back-to-back appointments", () => {
    expect(overlaps({ start: at(10, 0), end: at(10, 30) }, { start: at(10, 30), end: at(11, 0) })).toBe(false);
  });
});

describe("generateSlots", () => {
  it("returns one entry per day, in order", () => {
    const result = generateSlots("2026-11-22", 3, config, { now: LONG_AGO });
    expect(result.map((day) => day.date)).toEqual(["2026-11-22", "2026-11-23", "2026-11-24"]);
    expect(result[0].slots).toHaveLength(0); // Sunday
    expect(result[1].slots).toHaveLength(10); // Monday
    expect(result[2].slots).toHaveLength(0); // Tuesday has no rule in this config
  });
});
