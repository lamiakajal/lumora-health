import { describe, expect, it } from "vitest";
import { featuredFaqs } from "@/data/faqs";
import { developerJsonLd, faqJsonLd, homeJsonLd, serializeJsonLd } from "./json-ld";

describe("serializeJsonLd", () => {
  it("escapes angle brackets so data cannot close the script tag", () => {
    const output = serializeJsonLd({ text: "</script><b>" });
    expect(output).not.toContain("<");
    expect(output).toContain("\\u003c/script>");
  });

  it("round-trips back to the same data", () => {
    const data = { a: 1, b: ["x", "<y>"] };
    expect(JSON.parse(serializeJsonLd(data))).toEqual(data);
  });
});

describe("faqJsonLd", () => {
  it("lists every visible question with its answer", () => {
    const node = faqJsonLd(featuredFaqs) as { mainEntity: { name: string }[] };
    expect(node.mainEntity).toHaveLength(featuredFaqs.length);
    expect(node.mainEntity[0].name).toBe(featuredFaqs[0].question);
  });
});

describe("developerJsonLd", () => {
  it("links the developer to their public profiles", () => {
    const node = developerJsonLd() as { sameAs: string[]; name: string };
    expect(node.name).toBe("Lamia Kajal");
    expect(node.sameAs.some((url) => url.includes("github.com"))).toBe(true);
  });
});

describe("homeJsonLd", () => {
  it("declares the hospital, website, developer and FAQ in one graph", () => {
    const graph = (homeJsonLd(featuredFaqs) as { "@graph": { "@type": string }[] })["@graph"];
    const types = graph.map((node) => node["@type"]);
    expect(types).toEqual(["Hospital", "WebSite", "Person", "FAQPage"]);
  });
});
