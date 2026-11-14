import { describe, expect, it } from "vitest";
import {
  buildDoctorsHref,
  doctorSearchSchema,
  isValidPostalCode,
  normalizePostalCode,
} from "./search";

describe("isValidPostalCode", () => {
  it("accepts US ZIP codes", () => {
    expect(isValidPostalCode("94105")).toBe(true);
    expect(isValidPostalCode("94105-1234")).toBe(true);
  });

  it("accepts Canadian postal codes in several formats", () => {
    expect(isValidPostalCode("M5V 2T6")).toBe(true);
    expect(isValidPostalCode("m5v2t6")).toBe(true);
    expect(isValidPostalCode("M5V-2T6")).toBe(true);
  });

  it("rejects invalid values", () => {
    expect(isValidPostalCode("9410")).toBe(false);
    expect(isValidPostalCode("ABCDE")).toBe(false);
    expect(isValidPostalCode("M5V 2T")).toBe(false);
  });
});

describe("normalizePostalCode", () => {
  it("formats Canadian codes", () => {
    expect(normalizePostalCode("m5v2t6")).toBe("M5V 2T6");
  });

  it("leaves US ZIP codes alone", () => {
    expect(normalizePostalCode(" 94105 ")).toBe("94105");
  });
});

describe("doctorSearchSchema", () => {
  it("allows an empty location", () => {
    const result = doctorSearchSchema.safeParse({
      specialty: "Cardiology",
      location: "",
      insurance: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a malformed location", () => {
    const result = doctorSearchSchema.safeParse({
      specialty: "",
      location: "12",
      insurance: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("buildDoctorsHref", () => {
  it("returns the bare route when nothing is selected", () => {
    expect(buildDoctorsHref({ specialty: "", location: "", insurance: "" })).toBe("/doctors");
  });

  it("includes only the filters that are set", () => {
    const href = buildDoctorsHref({
      specialty: "Primary Care",
      location: "m5v2t6",
      insurance: "",
    });
    expect(href).toBe("/doctors?specialty=Primary+Care&location=M5V+2T6");
  });
});
