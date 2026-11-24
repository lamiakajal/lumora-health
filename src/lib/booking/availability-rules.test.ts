import { describe, expect, it } from "vitest";
import {
  intervalsToTimeOff,
  timeOffToIntervals,
  validateTimeOff,
  validateWeeklyRules,
} from "./availability-rules";
import { generateSlotsForDate, type AvailabilityConfig } from "./slots";

const monday = (start: string, end: string) => ({ dayOfWeek: 1, start, end });

describe("validateWeeklyRules", () => {
  it("accepts normal hours with a lunch break", () => {
    expect(validateWeeklyRules([monday("09:00", "12:00"), monday("13:00", "17:00")])).toBeNull();
  });

  it("allows windows that touch end to start", () => {
    expect(validateWeeklyRules([monday("09:00", "12:00"), monday("12:00", "15:00")])).toBeNull();
  });

  it("rejects a window that ends before it starts", () => {
    expect(validateWeeklyRules([monday("17:00", "09:00")])).toMatch(/end after it starts/);
    expect(validateWeeklyRules([monday("09:00", "09:00")])).toMatch(/end after it starts/);
  });

  it("rejects overlapping windows on one day", () => {
    expect(validateWeeklyRules([monday("09:00", "12:00"), monday("11:00", "14:00")])).toMatch(/overlap/);
  });

  it("allows the same hours on different days", () => {
    const tuesday = { dayOfWeek: 2, start: "09:00", end: "12:00" };
    expect(validateWeeklyRules([monday("09:00", "12:00"), tuesday])).toBeNull();
  });

  it("rejects bad times and bad days", () => {
    expect(validateWeeklyRules([monday("9am", "12:00")])).toMatch(/09:00/);
    expect(validateWeeklyRules([{ dayOfWeek: 9, start: "09:00", end: "12:00" }])).toMatch(/valid day/);
  });

  it("limits how many windows fit in one day", () => {
    const many = [
      monday("06:00", "07:00"),
      monday("08:00", "09:00"),
      monday("10:00", "11:00"),
      monday("12:00", "13:00"),
      monday("14:00", "15:00"),
    ];
    expect(validateWeeklyRules(many)).toMatch(/at most/);
  });
});

describe("validateTimeOff", () => {
  it("accepts a single day and a range", () => {
    expect(validateTimeOff([{ startDate: "2026-11-26", endDate: "2026-11-26", reason: "" }])).toBeNull();
    expect(validateTimeOff([{ startDate: "2026-12-24", endDate: "2026-12-26", reason: "Holiday" }])).toBeNull();
  });

  it("rejects an end before the start and invalid dates", () => {
    expect(validateTimeOff([{ startDate: "2026-12-26", endDate: "2026-12-24", reason: "" }])).toMatch(/on or after/);
    expect(validateTimeOff([{ startDate: "2026-02-30", endDate: "2026-03-01", reason: "" }])).toMatch(/valid dates/);
  });
});

describe("time off conversion", () => {
  const zone = "America/Los_Angeles";
  const entry = { startDate: "2026-11-26", endDate: "2026-11-27", reason: "Thanksgiving" };

  it("covers whole local days", () => {
    const [interval] = timeOffToIntervals([entry], zone);
    expect(interval.start.toISOString()).toBe("2026-11-26T08:00:00.000Z"); // midnight PST
    expect(interval.end.toISOString()).toBe("2026-11-28T08:00:00.000Z"); // midnight after the 27th
  });

  it("round-trips back to the dates that were typed", () => {
    expect(intervalsToTimeOff(timeOffToIntervals([entry], zone), zone)).toEqual([entry]);
  });

  it("removes every slot on those days", () => {
    const config: AvailabilityConfig = {
      timezone: zone,
      weekly: [4, 5].map((dayOfWeek) => ({ dayOfWeek, start: "09:00", end: "11:00" })), // Thu, Fri
      slotMinutes: 30,
      bufferMinutes: 0,
      timeOff: timeOffToIntervals([entry], zone),
    };
    const now = new Date("2026-01-01T00:00:00.000Z");
    expect(generateSlotsForDate("2026-11-26", config, { now })).toEqual([]); // Thursday
    expect(generateSlotsForDate("2026-11-27", config, { now })).toEqual([]); // Friday
    expect(generateSlotsForDate("2026-12-03", config, { now }).length).toBeGreaterThan(0); // next Thursday
  });
});
