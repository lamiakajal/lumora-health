import { describe, expect, it } from "vitest";
import { easedPercent } from "./progress";

describe("easedPercent", () => {
  it("starts at 0 and ends at 100", () => {
    expect(easedPercent(0, 1000)).toBe(0);
    expect(easedPercent(1000, 1000)).toBe(100);
  });

  it("clamps values outside the range", () => {
    expect(easedPercent(-50, 1000)).toBe(0);
    expect(easedPercent(5000, 1000)).toBe(100);
  });

  it("never decreases as time passes", () => {
    let previous = 0;
    for (let ms = 0; ms <= 1000; ms += 50) {
      const value = easedPercent(ms, 1000);
      expect(value).toBeGreaterThanOrEqual(previous);
      previous = value;
    }
  });

  it("finishes immediately for a zero duration", () => {
    expect(easedPercent(0, 0)).toBe(100);
  });
});
