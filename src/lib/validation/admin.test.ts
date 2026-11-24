import { describe, expect, it } from "vitest";
import { linkDoctorSchema, setActiveSchema } from "./admin";

describe("admin validation", () => {
  it("accepts a boolean for active and a real email for linking", () => {
    expect(setActiveSchema.safeParse({ active: false }).success).toBe(true);
    expect(linkDoctorSchema.safeParse({ email: " doctor@example.com " }).success).toBe(true);
  });

  it("rejects anything else", () => {
    expect(setActiveSchema.safeParse({ active: "no" }).success).toBe(false);
    expect(linkDoctorSchema.safeParse({ email: "not-an-email" }).success).toBe(false);
  });
});
