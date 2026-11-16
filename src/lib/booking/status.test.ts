import { describe, expect, it } from "vitest";
import { bookingStatuses, canTransition, isActiveStatus } from "./status";

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
