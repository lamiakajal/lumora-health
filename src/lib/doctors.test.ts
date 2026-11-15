import { describe, expect, it } from "vitest";
import { doctors } from "@/data/doctors";
import {
  ALL_CATEGORIES,
  allLanguages,
  availabilityRank,
  categoriesWithDoctors,
  defaultDoctorFilters,
  filterDoctors,
  matchesSpecialty,
  searchDoctors,
} from "./doctors";

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

describe("availabilityRank", () => {
  it("orders today before tomorrow before later days", () => {
    expect(availabilityRank("Today")).toBeLessThan(availabilityRank("Tomorrow"));
    expect(availabilityRank("Tomorrow")).toBeLessThan(availabilityRank("In 2 days"));
    expect(availabilityRank("In 2 days")).toBeLessThan(availabilityRank("In 10 days"));
  });

  it("sorts unknown text last", () => {
    expect(availabilityRank("someday")).toBeGreaterThan(availabilityRank("In 30 days"));
  });
});

describe("matchesSpecialty", () => {
  const cardiologist = doctors.find((doctor) => doctor.slug === "daniel-okafor")!;
  const derm = doctors.find((doctor) => doctor.slug === "marcus-lee")!;

  it("accepts everything when no specialty is chosen", () => {
    expect(matchesSpecialty(cardiologist, "")).toBe(true);
  });

  it("maps home page options to departments", () => {
    expect(matchesSpecialty(cardiologist, "Cardiology")).toBe(true);
    expect(matchesSpecialty(derm, "Cardiology")).toBe(false);
  });

  it("matches by keyword for specialties that share a department", () => {
    expect(matchesSpecialty(derm, "Dermatology")).toBe(true);
    expect(matchesSpecialty(cardiologist, "Dermatology")).toBe(false);
  });
});

describe("searchDoctors", () => {
  it("returns everyone by default, soonest first", () => {
    const result = searchDoctors(doctors, defaultDoctorFilters);
    expect(result).toHaveLength(doctors.length);
    expect(result[0].nextAvailable).toBe("Today");
  });

  it("searches by name, specialty and language", () => {
    expect(searchDoctors(doctors, { ...defaultDoctorFilters, q: "okafor" })).toHaveLength(1);
    expect(searchDoctors(doctors, { ...defaultDoctorFilters, q: "psychiatry" }).length).toBeGreaterThan(0);
    expect(searchDoctors(doctors, { ...defaultDoctorFilters, q: "bengali" })).toHaveLength(1);
  });

  it("filters by language and video visits", () => {
    const french = searchDoctors(doctors, { ...defaultDoctorFilters, language: "French" });
    expect(french.length).toBeGreaterThan(1);
    expect(french.every((doctor) => doctor.languages.includes("French"))).toBe(true);

    const video = searchDoctors(doctors, { ...defaultDoctorFilters, video: true });
    expect(video.every((doctor) => doctor.telehealth)).toBe(true);
  });

  it("sorts by rating", () => {
    const result = searchDoctors(doctors, { ...defaultDoctorFilters, sort: "rating" });
    expect(result[0].rating).toBeGreaterThanOrEqual(result[result.length - 1].rating);
  });

  it("returns nothing when nothing matches", () => {
    expect(searchDoctors(doctors, { ...defaultDoctorFilters, q: "zzzz" })).toEqual([]);
  });
});

describe("allLanguages", () => {
  it("lists each language once, alphabetically", () => {
    const list = allLanguages(doctors);
    expect(new Set(list).size).toBe(list.length);
    expect([...list].sort((a, b) => a.localeCompare(b))).toEqual(list);
    expect(list).toContain("English");
  });
});
