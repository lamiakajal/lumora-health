import { describe, expect, it } from "vitest";
import { safeRedirectPath } from "./redirect";

describe("safeRedirectPath", () => {
  it("allows paths on this site", () => {
    expect(safeRedirectPath("/portal")).toBe("/portal");
    expect(safeRedirectPath("/doctors?specialty=Cardiology")).toBe("/doctors?specialty=Cardiology");
  });

  it("falls back when there is no value", () => {
    expect(safeRedirectPath(null)).toBe("/portal");
    expect(safeRedirectPath("")).toBe("/portal");
  });

  it("blocks other sites", () => {
    expect(safeRedirectPath("https://evil.example")).toBe("/portal");
    expect(safeRedirectPath("//evil.example")).toBe("/portal");
    expect(safeRedirectPath("/\\evil.example")).toBe("/portal");
    expect(safeRedirectPath("javascript:alert(1)")).toBe("/portal");
  });

  it("accepts a custom fallback", () => {
    expect(safeRedirectPath("nope", "/")).toBe("/");
  });
});
