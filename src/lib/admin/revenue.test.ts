import { describe, expect, it } from "vitest";
import { weeklyRevenue } from "./revenue";

const now = new Date("2026-11-25T15:00:00.000Z"); // Wednesday; that week starts Monday 2026-11-23

describe("weeklyRevenue", () => {
  it("returns one bucket per week, oldest first, ending with this week", () => {
    const result = weeklyRevenue([], 3, now);
    expect(result.map((bucket) => bucket.weekStart)).toEqual(["2026-11-09", "2026-11-16", "2026-11-23"]);
    expect(result.every((bucket) => bucket.completed === 0 && bucket.upcoming === 0)).toBe(true);
  });

  it("adds completed visits and upcoming visits separately", () => {
    const result = weeklyRevenue(
      [
        { start: "2026-11-10T18:00:00.000Z", status: "completed", priceCents: 12900 },
        { start: "2026-11-11T18:00:00.000Z", status: "completed", priceCents: 7900 },
        { start: "2026-11-24T18:00:00.000Z", status: "confirmed", priceCents: 18900 },
        { start: "2026-11-26T18:00:00.000Z", status: "pending", priceCents: 7900 },
      ],
      3,
      now,
    );
    expect(result[0]).toMatchObject({ completed: 20800, upcoming: 0, visits: 2 });
    expect(result[2]).toMatchObject({ completed: 0, upcoming: 26800, visits: 2 });
  });

  it("ignores cancelled visits and visits outside the range", () => {
    const result = weeklyRevenue(
      [
        { start: "2026-11-24T18:00:00.000Z", status: "cancelled", priceCents: 12900 },
        { start: "2026-09-01T18:00:00.000Z", status: "completed", priceCents: 12900 },
        { start: "2027-02-01T18:00:00.000Z", status: "confirmed", priceCents: 12900 },
      ],
      3,
      now,
    );
    expect(result.reduce((sum, bucket) => sum + bucket.visits, 0)).toBe(0);
  });

  it("puts a Sunday visit in the week that started the Monday before", () => {
    const result = weeklyRevenue(
      [{ start: "2026-11-22T20:00:00.000Z", status: "completed", priceCents: 5000 }],
      3,
      now,
    );
    expect(result[1].completed).toBe(5000); // week of 2026-11-16
  });
});
