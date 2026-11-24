import { describe, expect, it } from "vitest";
import type { ProviderBooking } from "@/lib/booking/types";
import { filterBookings, paginate } from "./bookings";

const make = (id: string, overrides: Partial<ProviderBooking>): ProviderBooking => ({
  id,
  doctorSlug: "amelia-hart",
  doctorName: "Dr. Amelia Hart",
  specialty: "Primary Care",
  start: "2026-11-23T17:00:00.000Z",
  end: "2026-11-23T17:30:00.000Z",
  timezone: "America/Los_Angeles",
  status: "pending",
  visitType: "in-person",
  reason: "",
  priceCents: 12900,
  patientName: "Lamia Kajal",
  patientEmail: "lamia@example.com",
  ...overrides,
});

const list = [
  make("1", {}),
  make("2", { status: "confirmed", patientName: "Rahim Uddin", patientEmail: "rahim@example.com" }),
  make("3", { doctorSlug: "daniel-okafor", doctorName: "Dr. Daniel Okafor", status: "cancelled" }),
];
const all = { q: "", status: "all", doctor: "" } as const;

describe("filterBookings", () => {
  it("keeps everything with no filters", () => {
    expect(filterBookings(list, all)).toHaveLength(3);
  });

  it("filters by status and doctor", () => {
    expect(filterBookings(list, { ...all, status: "confirmed" }).map((b) => b.id)).toEqual(["2"]);
    expect(filterBookings(list, { ...all, doctor: "daniel-okafor" }).map((b) => b.id)).toEqual(["3"]);
  });

  it("searches patient name, email and doctor, ignoring case", () => {
    expect(filterBookings(list, { ...all, q: "RAHIM" }).map((b) => b.id)).toEqual(["2"]);
    expect(filterBookings(list, { ...all, q: "okafor" }).map((b) => b.id)).toEqual(["3"]);
  });

  it("combines filters", () => {
    expect(filterBookings(list, { q: "lamia", status: "cancelled", doctor: "" })).toHaveLength(1);
  });
});

describe("paginate", () => {
  const items = Array.from({ length: 25 }, (_, index) => index + 1);

  it("slices a page and counts pages", () => {
    const result = paginate(items, 2, 10);
    expect(result.items).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    expect(result.totalPages).toBe(3);
  });

  it("clamps a page that is out of range", () => {
    expect(paginate(items, 99, 10).page).toBe(3);
    expect(paginate(items, 0, 10).page).toBe(1);
    expect(paginate([], 1, 10)).toEqual({ items: [], page: 1, totalPages: 1 });
  });
});
