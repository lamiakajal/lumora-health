import { describe, expect, it } from "vitest";
import { bookingStatuses, canTransition, decideStatusChange, isActiveStatus } from "./status";

describe("canTransition", () => {
  it("follows pending -> confirmed -> completed", () => {
    expect(canTransition("pending", "confirmed")).toBe(true);
    expect(canTransition("confirmed", "completed")).toBe(true);
  });

  it("lets pending and confirmed bookings be cancelled", () => {
    expect(canTransition("pending", "cancelled")).toBe(true);
    expect(canTransition("confirmed", "cancelled")).toBe(true);
  });

  it("does not skip steps or go backwards", () => {
    expect(canTransition("pending", "completed")).toBe(false);
    expect(canTransition("confirmed", "pending")).toBe(false);
  });

  it("treats completed and cancelled as final", () => {
    for (const next of bookingStatuses) {
      expect(canTransition("completed", next)).toBe(false);
      expect(canTransition("cancelled", next)).toBe(false);
    }
  });
});

describe("isActiveStatus", () => {
  it("only pending and confirmed bookings hold a slot", () => {
    expect(isActiveStatus("pending")).toBe(true);
    expect(isActiveStatus("confirmed")).toBe(true);
    expect(isActiveStatus("completed")).toBe(false);
    expect(isActiveStatus("cancelled")).toBe(false);
  });
});


describe("decideStatusChange", () => {
  const past = new Date("2026-11-20T10:00:00.000Z");
  const future = new Date("2026-11-30T10:00:00.000Z");
  const now = new Date("2026-11-25T10:00:00.000Z");

  it("lets a doctor confirm a pending booking", () => {
    expect(decideStatusChange("pending", "confirm", future, now)).toBe("ok");
  });

  it("does not confirm something that is already confirmed or cancelled", () => {
    expect(decideStatusChange("confirmed", "confirm", future, now)).toBe("invalid");
    expect(decideStatusChange("cancelled", "confirm", future, now)).toBe("invalid");
  });

  it("only completes confirmed bookings, and only once the visit has started", () => {
    expect(decideStatusChange("confirmed", "complete", past, now)).toBe("ok");
    expect(decideStatusChange("confirmed", "complete", future, now)).toBe("too-early");
    expect(decideStatusChange("pending", "complete", past, now)).toBe("invalid");
  });

  it("cancels pending and confirmed bookings but nothing final", () => {
    expect(decideStatusChange("pending", "cancel", future, now)).toBe("ok");
    expect(decideStatusChange("confirmed", "cancel", future, now)).toBe("ok");
    expect(decideStatusChange("completed", "cancel", past, now)).toBe("invalid");
  });
});
