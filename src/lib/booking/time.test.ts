import { describe, expect, it } from "vitest";
import {
  addDays,
  dayOfWeek,
  describeLocalDate,
  formatMinutes,
  isValidLocalDate,
  localDateOf,
  localHour,
  minutesOfDay,
  timeZoneLabel,
  zonedTimeToUtc,
} from "./time";

describe("zonedTimeToUtc", () => {
  it("converts New York winter time (UTC-5)", () => {
    expect(zonedTimeToUtc("2026-11-23", "09:00", "America/New_York").toISOString()).toBe(
      "2026-11-23T14:00:00.000Z",
    );
  });

  it("converts Los Angeles winter time (UTC-8)", () => {
    expect(zonedTimeToUtc("2026-11-23", "09:00", "America/Los_Angeles").toISOString()).toBe(
      "2026-11-23T17:00:00.000Z",
    );
  });

  it("converts Vancouver time before British Columbia's move to permanent daylight time", () => {
    // BC is moving to permanent UTC-7 from 2026, so a 2026 winter date would be UTC-7 there.
    // A 2025 date is still ordinary winter time (UTC-8) and does not depend on that decision.
    expect(zonedTimeToUtc("2025-11-24", "09:00", "America/Vancouver").toISOString()).toBe(
      "2025-11-24T17:00:00.000Z",
    );
  });

  it("converts Toronto summer time (UTC-4)", () => {
    expect(zonedTimeToUtc("2026-07-15", "09:00", "America/Toronto").toISOString()).toBe(
      "2026-07-15T13:00:00.000Z",
    );
  });

  it("handles the day daylight saving starts (2026-03-08)", () => {
    expect(zonedTimeToUtc("2026-03-07", "09:00", "America/New_York").toISOString()).toBe(
      "2026-03-07T14:00:00.000Z",
    );
    expect(zonedTimeToUtc("2026-03-08", "09:00", "America/New_York").toISOString()).toBe(
      "2026-03-08T13:00:00.000Z",
    );
  });

  it("handles the day daylight saving ends (2026-11-01)", () => {
    expect(zonedTimeToUtc("2026-10-31", "09:00", "America/New_York").toISOString()).toBe(
      "2026-10-31T13:00:00.000Z",
    );
    expect(zonedTimeToUtc("2026-11-01", "09:00", "America/New_York").toISOString()).toBe(
      "2026-11-01T14:00:00.000Z",
    );
  });
});

describe("localDateOf", () => {
  it("uses the date in the given zone, not UTC", () => {
    const instant = new Date("2026-11-24T03:00:00.000Z");
    expect(localDateOf(instant, "America/Los_Angeles")).toBe("2026-11-23");
    expect(localDateOf(instant, "UTC")).toBe("2026-11-24");
  });
});

describe("calendar helpers", () => {
  it("knows the day of the week", () => {
    expect(dayOfWeek("2026-11-23")).toBe(1); // Monday
    expect(dayOfWeek("2026-11-22")).toBe(0); // Sunday
  });

  it("adds days across month and year ends", () => {
    expect(addDays("2026-11-30", 1)).toBe("2026-12-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("validates dates", () => {
    expect(isValidLocalDate("2026-11-23")).toBe(true);
    expect(isValidLocalDate("2026-02-30")).toBe(false);
    expect(isValidLocalDate("23-11-2026")).toBe(false);
  });

  it("converts between minutes and clock times", () => {
    expect(minutesOfDay("09:30")).toBe(570);
    expect(formatMinutes(570)).toBe("09:30");
    expect(formatMinutes(0)).toBe("00:00");
  });
});

describe("timeZoneLabel", () => {
  it("shows standard or daylight names", () => {
    expect(timeZoneLabel("2026-11-23T17:00:00.000Z", "America/Los_Angeles")).toBe("PST");
    expect(timeZoneLabel("2026-07-15T17:00:00.000Z", "America/Los_Angeles")).toBe("PDT");
  });
});

describe("describeLocalDate", () => {
  it("splits a date into picker labels", () => {
    expect(describeLocalDate("2026-11-23")).toEqual({ weekday: "Mon", day: "23", month: "Nov" });
  });
});

describe("localHour", () => {
  it("reads the wall clock hour in a zone", () => {
    expect(localHour("2026-11-23T17:00:00.000Z", "America/Los_Angeles")).toBe(9);
    expect(localHour("2026-11-23T21:30:00.000Z", "America/Los_Angeles")).toBe(13);
    expect(localHour("2026-11-23T08:00:00.000Z", "America/Los_Angeles")).toBe(0);
  });
});
