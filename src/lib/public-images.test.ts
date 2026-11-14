import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { findPublicImage } from "./public-images";

describe("findPublicImage", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(path.join(os.tmpdir(), "lumora-public-"));
    mkdirSync(path.join(dir, "images"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("returns null when no file exists", () => {
    expect(findPublicImage("/images/hero", dir)).toBeNull();
  });

  it("finds a file with a supported extension", () => {
    writeFileSync(path.join(dir, "images", "hero.jpg"), "x");
    expect(findPublicImage("/images/hero", dir)).toBe("/images/hero.jpg");
  });

  it("prefers the modern format when several exist", () => {
    writeFileSync(path.join(dir, "images", "hero.jpg"), "x");
    writeFileSync(path.join(dir, "images", "hero.webp"), "x");
    expect(findPublicImage("/images/hero", dir)).toBe("/images/hero.webp");
  });

  it("accepts a path without a leading slash", () => {
    writeFileSync(path.join(dir, "images", "hero.png"), "x");
    expect(findPublicImage("images/hero", dir)).toBe("/images/hero.png");
  });
});
