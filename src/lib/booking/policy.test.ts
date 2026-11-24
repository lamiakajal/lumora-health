import { describe, expect, it } from "vitest";
import { canReschedule } from "./policy";

const now = new Date("2026-11-23T12:00:00.000Z");
const inHours = (hours: number) => new Date(now.getTime() + hours * 60 * 60_000);

describe("canReschedule", () => {
  it("allows a visit that is more than a day away", () => {
    expect(canReschedule("confirmed", inHours(48), now)).toBe(true);
    expect(canReschedule("pending", inHours(24), now)).toBe(true);
  });

  it("blocks last-minute changes for patients", () => {
    expect(canReschedule("confirmed", inHours(23), now)).toBe(false);
    expect(canReschedule("confirmed", inHours(-1), now)).toBe(false);
  });

  it("lets an admin move a visit that has not started", () => {
    expect(canReschedule("confirmed", inHours(2), now, { isAdmin: true })).toBe(true);
    expect(canReschedule("confirmed", inHours(-2), now, { isAdmin: true })).toBe(false);
  });

  it("never moves finished or cancelled visits", () => {
    expect(canReschedule("completed", inHours(48), now)).toBe(false);
    expect(canReschedule("cancelled", inHours(48), now, { isAdmin: true })).toBe(false);
  });
});
