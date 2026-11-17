import { describe, expect, it } from "vitest";
import { bookingRequestSchema, cancelRequestSchema } from "./booking";

const valid = {
  doctorSlug: "amelia-hart",
  start: "2026-11-23T17:00:00.000Z",
  visitType: "video",
  reason: "Follow-up",
};

describe("bookingRequestSchema", () => {
  it("accepts a complete request", () => {
    expect(bookingRequestSchema.safeParse(valid).success).toBe(true);
  });

  it("defaults the reason to an empty string", () => {
    const result = bookingRequestSchema.safeParse({
      doctorSlug: valid.doctorSlug,
      start: valid.start,
      visitType: valid.visitType,
    });
    expect(result.success && result.data.reason).toBe("");
  });

  it("rejects an unknown visit type", () => {
    expect(bookingRequestSchema.safeParse({ ...valid, visitType: "phone" }).success).toBe(false);
  });

  it("rejects a bad time or a very long reason", () => {
    expect(bookingRequestSchema.safeParse({ ...valid, start: "tomorrow-ish" }).success).toBe(false);
    expect(bookingRequestSchema.safeParse({ ...valid, reason: "x".repeat(501) }).success).toBe(false);
  });
});

describe("cancelRequestSchema", () => {
  it("only accepts the cancel action", () => {
    expect(cancelRequestSchema.safeParse({ action: "cancel" }).success).toBe(true);
    expect(cancelRequestSchema.safeParse({ action: "delete" }).success).toBe(false);
  });
});
