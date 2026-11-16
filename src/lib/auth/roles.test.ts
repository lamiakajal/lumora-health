import { describe, expect, it } from "vitest";
import { hasRole, normalizeRole } from "./roles";

describe("normalizeRole", () => {
  it("keeps known roles", () => {
    expect(normalizeRole("doctor")).toBe("doctor");
    expect(normalizeRole("admin")).toBe("admin");
  });

  it("falls back to patient for anything else", () => {
    expect(normalizeRole(undefined)).toBe("patient");
    expect(normalizeRole("superuser")).toBe("patient");
    expect(normalizeRole(42)).toBe("patient");
  });
});

describe("hasRole", () => {
  it("checks membership", () => {
    expect(hasRole("admin", ["admin"])).toBe(true);
    expect(hasRole("patient", ["doctor", "admin"])).toBe(false);
  });
});
