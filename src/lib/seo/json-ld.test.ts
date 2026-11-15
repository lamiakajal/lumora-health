import { describe, expect, it } from "vitest";
import { featuredFaqs } from "@/data/faqs";
import { doctors } from "@/data/doctors";
import { services } from "@/data/services";
import {
  breadcrumbJsonLd,
  developerJsonLd,
  faqJsonLd,
  homeJsonLd,
  physicianJsonLd,
  serializeJsonLd,
  serviceJsonLd,
} from "./json-ld";

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

describe("breadcrumbJsonLd", () => {
  it("numbers the items from 1 with absolute URLs", () => {
    const node = breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Doctors", path: "/doctors" },
    ]) as { itemListElement: { position: number; item: string }[] };
    expect(node.itemListElement.map((entry) => entry.position)).toEqual([1, 2]);
    expect(node.itemListElement[1].item).toMatch(/^https?:\/\/.+\/doctors$/);
  });
});

describe("serviceJsonLd and physicianJsonLd", () => {
  it("describe a specialty and a doctor", () => {
    expect((serviceJsonLd(services[0]) as { "@type": string })["@type"]).toBe("Service");
    const physician = physicianJsonLd(doctors[0], "/images/doctors/amelia-hart.webp") as {
      "@type": string;
      image?: string;
    };
    expect(physician["@type"]).toBe("Physician");
    expect(physician.image).toMatch(/amelia-hart\.webp$/);
  });

  it("leaves out the image when there is no photo", () => {
    expect("image" in physicianJsonLd(doctors[0], null)).toBe(false);
  });
});
