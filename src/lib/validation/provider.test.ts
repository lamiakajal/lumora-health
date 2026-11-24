import { describe, expect, it } from "vitest";
import { availabilitySchema, statusActionSchema } from "./provider";

const valid = {
  weekly: [{ dayOfWeek: 1, start: "09:00", end: "12:00" }],
  slotMinutes: 30,
  bufferMinutes: 5,
  timeOff: [{ startDate: "2026-12-24", endDate: "2026-12-26", reason: "Holiday" }],
};

describe("availabilitySchema", () => {
  it("accepts a complete schedule", () => {
    expect(availabilitySchema.safeParse(valid).success).toBe(true);
  });

  it("rejects unsupported slot lengths and buffers", () => {
    expect(availabilitySchema.safeParse({ ...valid, slotMinutes: 7 }).success).toBe(false);
    expect(availabilitySchema.safeParse({ ...valid, bufferMinutes: 12 }).success).toBe(false);
  });

  it("rejects a day outside Sunday to Saturday", () => {
    const bad = { ...valid, weekly: [{ dayOfWeek: 8, start: "09:00", end: "12:00" }] };
    expect(availabilitySchema.safeParse(bad).success).toBe(false);
  });

  it("defaults a missing reason to empty text", () => {
    const result = availabilitySchema.safeParse({
      ...valid,
      timeOff: [{ startDate: "2026-12-24", endDate: "2026-12-24" }],
    });
    expect(result.success && result.data.timeOff[0].reason).toBe("");
  });
});

describe("statusActionSchema", () => {
  it("accepts the three doctor actions only", () => {
    for (const action of ["confirm", "complete", "cancel"]) {
      expect(statusActionSchema.safeParse({ action }).success).toBe(true);
    }
    expect(statusActionSchema.safeParse({ action: "delete" }).success).toBe(false);
  });
});
