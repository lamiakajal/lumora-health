import { describe, expect, it } from "vitest";
import { fieldErrors, loginSchema, registerSchema } from "./auth";

describe("loginSchema", () => {
  it("accepts a valid email and a password", () => {
    expect(loginSchema.safeParse({ email: " a@b.com ", password: "x" }).success).toBe(true);
  });

  it("rejects a bad email or empty password", () => {
    expect(loginSchema.safeParse({ email: "nope", password: "x" }).success).toBe(false);
    expect(loginSchema.safeParse({ email: "a@b.com", password: "" }).success).toBe(false);
  });
});

describe("registerSchema", () => {
  const valid = {
    name: "Lamia Kajal",
    email: "lamia@example.com",
    password: "correct-horse",
    confirmPassword: "correct-horse",
  };

  it("accepts a complete registration", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("requires matching passwords", () => {
    const result = registerSchema.safeParse({ ...valid, confirmPassword: "different" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(fieldErrors(result.error.issues).confirmPassword).toBe("Passwords do not match.");
    }
  });

  it("requires a strong enough password", () => {
    const result = registerSchema.safeParse({ ...valid, password: "short", confirmPassword: "short" });
    expect(result.success).toBe(false);
  });
});

describe("fieldErrors", () => {
  it("keeps the first message for each field", () => {
    const result = fieldErrors([
      { path: ["email"], message: "first" },
      { path: ["email"], message: "second" },
      { path: ["name"], message: "name error" },
    ]);
    expect(result).toEqual({ email: "first", name: "name error" });
  });
});
