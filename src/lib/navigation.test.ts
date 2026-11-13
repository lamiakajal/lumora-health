import { describe, expect, it } from "vitest";
import { isActivePath, isItemActive, primaryNav } from "./navigation";

describe("isActivePath", () => {
  it("matches the home page exactly", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/about", "/")).toBe(false);
  });

  it("matches nested routes", () => {
    expect(isActivePath("/services/telehealth", "/services")).toBe(true);
  });

  it("does not match a different route with the same prefix", () => {
    expect(isActivePath("/servicesx", "/services")).toBe(false);
  });
});

describe("isItemActive", () => {
  const patients = primaryNav.find((item) => item.label === "Patients")!;

  it("is active when a child route is open", () => {
    expect(isItemActive("/pricing", patients)).toBe(true);
  });

  it("is inactive on unrelated routes", () => {
    expect(isItemActive("/doctors", patients)).toBe(false);
  });
});
