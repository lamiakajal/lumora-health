import { describe, expect, it } from "vitest";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";
import {
  doctorsForService,
  getDoctorBySlug,
  getServiceBySlug,
  relatedServices,
  serviceMatchesQuery,
} from "./services";

describe("lookups", () => {
  it("finds a service and a doctor by slug", () => {
    expect(getServiceBySlug("cardiology")?.title).toBe("Cardiology");
    expect(getDoctorBySlug("amelia-hart")?.name).toBe("Dr. Amelia Hart");
    expect(getServiceBySlug("nope")).toBeUndefined();
  });
});

describe("doctorsForService", () => {
  it("returns the doctors linked to a specialty", () => {
    const cardiology = getServiceBySlug("cardiology")!;
    expect(doctorsForService(cardiology).map((doctor) => doctor.slug)).toContain("daniel-okafor");
  });

  it("lists video-ready doctors on the telehealth page", () => {
    const telehealth = getServiceBySlug("telehealth")!;
    const list = doctorsForService(telehealth);
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((doctor) => doctor.telehealth)).toBe(true);
  });

  it("gives every specialty page at least one doctor", () => {
    for (const service of services) {
      expect(doctorsForService(service).length, service.slug).toBeGreaterThan(0);
    }
  });

  it("links every doctor to an existing specialty", () => {
    const slugs = new Set(services.map((service) => service.slug));
    expect(doctors.every((doctor) => slugs.has(doctor.serviceSlug))).toBe(true);
  });
});

describe("relatedServices", () => {
  it("stays in the same department and excludes itself", () => {
    const heart = getServiceBySlug("cardiology")!;
    const related = relatedServices(heart);
    expect(related.length).toBeGreaterThan(0);
    expect(related.every((service) => service.category === "heart")).toBe(true);
    expect(related.some((service) => service.slug === "cardiology")).toBe(false);
  });
});

describe("serviceMatchesQuery", () => {
  it("matches title or description, ignoring case", () => {
    const service = getServiceBySlug("dermatology")!;
    expect(serviceMatchesQuery(service, "DERMA")).toBe(true);
    expect(serviceMatchesQuery(service, "eczema")).toBe(true);
    expect(serviceMatchesQuery(service, "zzz")).toBe(false);
    expect(serviceMatchesQuery(service, "  ")).toBe(true);
  });
});
