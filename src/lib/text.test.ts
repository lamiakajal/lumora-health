import { describe, expect, it } from "vitest";
import { getInitials } from "./text";

describe("getInitials", () => {
  it("ignores titles", () => {
    expect(getInitials("Dr. Amelia Hart")).toBe("AH");
  });

  it("handles abbreviated surnames", () => {
    expect(getInitials("Jennifer M.")).toBe("JM");
  });

  it("uses first and last for long names", () => {
    expect(getInitials("Mary Jane Watson Parker")).toBe("MP");
  });

  it("handles single names and empty input", () => {
    expect(getInitials("Madonna")).toBe("M");
    expect(getInitials("   ")).toBe("");
  });
});
