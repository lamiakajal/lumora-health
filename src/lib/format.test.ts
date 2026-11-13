import { describe, expect, it } from "vitest";
import { toTelHref } from "./format";

describe("toTelHref", () => {
  it("formats a US display number", () => {
    expect(toTelHref("(415) 555-0132")).toBe("tel:+14155550132");
  });

  it("does not double the country code", () => {
    expect(toTelHref("+1 (415) 555-0132")).toBe("tel:+14155550132");
  });

  it("returns an empty string when there are no digits", () => {
    expect(toTelHref("")).toBe("");
    expect(toTelHref("call us")).toBe("");
  });
});
