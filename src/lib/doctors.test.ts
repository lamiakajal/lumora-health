import { describe, expect, it } from "vitest";
import { doctors } from "@/data/doctors";
import { ALL_CATEGORIES, categoriesWithDoctors, filterDoctors } from "./doctors";

describe("filterDoctors", () => {
  it("limits the 'all' tab", () => {
    expect(filterDoctors(doctors, ALL_CATEGORIES, 8)).toHaveLength(8);
  });

  it("filters by category", () => {
    const result = filterDoctors(doctors, "heart");
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((doctor) => doctor.category === "heart")).toBe(true);
  });

  it("returns nothing for an unknown category", () => {
    expect(filterDoctors(doctors, "astrology")).toEqual([]);
  });
});

describe("categoriesWithDoctors", () => {
  it("lists every category that has doctors", () => {
    const list = categoriesWithDoctors(doctors);
    expect(list).toContain("heart");
    expect(list).toContain("mind");
    expect(new Set(list).size).toBe(list.length);
  });
});
