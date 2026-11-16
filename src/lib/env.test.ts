import { describe, expect, it } from "vitest";
import { parseEnv } from "./env";

const valid = {
  MONGODB_URI: "mongodb://localhost:27017/lumora",
  BETTER_AUTH_SECRET: "x".repeat(32),
  BETTER_AUTH_URL: "http://localhost:3000",
};

describe("parseEnv", () => {
  it("accepts a complete configuration", () => {
    expect(parseEnv(valid)).toEqual(valid);
  });

  it("explains every missing or invalid value", () => {
    expect(() => parseEnv({})).toThrowError(/MONGODB_URI/);
    expect(() => parseEnv({})).toThrowError(/BETTER_AUTH_SECRET/);
    expect(() => parseEnv({})).toThrowError(/BETTER_AUTH_URL/);
  });

  it("rejects a short secret", () => {
    expect(() => parseEnv({ ...valid, BETTER_AUTH_SECRET: "short" })).toThrowError(/32 characters/);
  });

  it("rejects a URL that is not a URL", () => {
    expect(() => parseEnv({ ...valid, BETTER_AUTH_URL: "localhost" })).toThrowError(/full URL/);
  });
});
