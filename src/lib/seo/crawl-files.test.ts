import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("lists the home page with an absolute URL", () => {
    const entries = sitemap();
    expect(entries.length).toBeGreaterThan(0);
    expect(entries[0].url).toMatch(/^https?:\/\//);
  });

  it("has no duplicate URLs", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
  });
});

describe("robots", () => {
  it("keeps private areas out of search results and points to the sitemap", () => {
    const result = robots();
    const rule = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    expect(rule.disallow).toContain("/admin");
    expect(String(result.sitemap)).toMatch(/\/sitemap\.xml$/);
  });
});
