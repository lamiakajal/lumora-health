import { describe, expect, it } from "vitest";
import { doctors } from "@/data/doctors";
import { defaultAvailability, formatPrice, priceCentsFor, timezoneFor } from "./defaults";

const amelia = doctors.find((doctor) => doctor.slug === "amelia-hart")!;
const samuel = doctors.find((doctor) => doctor.slug === "samuel-tremblay")!;
const daniel = doctors.find((doctor) => doctor.slug === "daniel-okafor")!;

describe("timezoneFor", () => {
  it("uses Eastern time for Canadian credentials and Pacific otherwise", () => {
    expect(timezoneFor(samuel)).toBe("America/Toronto");
    expect(timezoneFor(amelia)).toBe("America/Los_Angeles");
  });
});

describe("defaultAvailability", () => {
  it("works weekdays with a lunch break", () => {
    const config = defaultAvailability(daniel);
    const monday = config.weekly.filter((rule) => rule.dayOfWeek === 1);
    expect(monday).toEqual([
      { dayOfWeek: 1, start: "09:00", end: "12:00" },
      { dayOfWeek: 1, start: "13:00", end: "17:00" },
    ]);
    expect(config.weekly.some((rule) => rule.dayOfWeek === 0 || rule.dayOfWeek === 6)).toBe(false);
  });

  it("adds Saturday mornings for primary care only", () => {
    expect(defaultAvailability(amelia).weekly.some((rule) => rule.dayOfWeek === 6)).toBe(true);
    expect(defaultAvailability(daniel).weekly.some((rule) => rule.dayOfWeek === 6)).toBe(false);
  });
});

describe("pricing", () => {
  it("prices video, primary and specialist visits", () => {
    expect(priceCentsFor(amelia, "video")).toBe(7900);
    expect(priceCentsFor(amelia, "in-person")).toBe(12900);
    expect(priceCentsFor(daniel, "in-person")).toBe(18900);
  });

  it("formats cents as dollars", () => {
    expect(formatPrice(12900)).toBe("$129.00");
  });
});
