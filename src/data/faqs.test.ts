import { describe, expect, it } from "vitest";
import { faqs, featuredFaqs } from "./faqs";

describe("faqs data", () => {
  it("has unique ids", () => {
    const ids = faqs.map((faq) => faq.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("features a manageable number on the home page", () => {
    expect(featuredFaqs.length).toBeGreaterThanOrEqual(4);
    expect(featuredFaqs.length).toBeLessThanOrEqual(8);
  });

  it("gives every question an answer", () => {
    expect(faqs.every((faq) => faq.answer.length > 20)).toBe(true);
  });
});
