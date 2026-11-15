import { describe, expect, it } from "vitest";
import { primaryNav } from "@/lib/navigation";
import { categories } from "./categories";
import { doctors } from "./doctors";
import { featuredServiceSlugs, services } from "./services";

const categoryIds = new Set<string>(categories.map((category) => category.id));

describe("services data", () => {
  it("has unique slugs", () => {
    const slugs = services.map((service) => service.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("uses known categories", () => {
    expect(services.every((service) => categoryIds.has(service.category))).toBe(true);
  });

  it("only features services that exist", () => {
    const slugs = new Set(services.map((service) => service.slug));
    expect(featuredServiceSlugs.every((slug) => slugs.has(slug))).toBe(true);
  });

  it("covers every link in the Services menu", () => {
    const slugs = new Set(services.map((service) => service.slug));
    const menu = primaryNav.find((item) => item.label === "Services");
    for (const child of menu?.children ?? []) {
      expect(slugs.has(child.href.replace("/services/", ""))).toBe(true);
    }
  });
});

describe("doctors data", () => {
  it("has unique slugs", () => {
    const slugs = doctors.map((doctor) => doctor.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("uses known categories", () => {
    expect(doctors.every((doctor) => categoryIds.has(doctor.category))).toBe(true);
  });

  it("has sensible ratings", () => {
    expect(doctors.every((doctor) => doctor.rating >= 1 && doctor.rating <= 5)).toBe(true);
  });
});
