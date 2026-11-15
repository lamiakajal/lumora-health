import type { Faq } from "@/data/faqs";
import { siteConfig } from "../../../site.config";

type JsonLdNode = Record<string, unknown>;

/** Safe to embed in a <script> tag: "<" is escaped so the data can never close the tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

const base = () => siteConfig.url.replace(/\/$/, "");

/** Placeholder hours: keep in step with siteConfig.hours and the client's real schedule. */
const openingHours = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "18:00",
  },
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: "Saturday",
    opens: "09:00",
    closes: "14:00",
  },
];

export function hospitalJsonLd(): JsonLdNode {
  const { contact } = siteConfig;
  return {
    "@type": "Hospital",
    "@id": `${base()}/#hospital`,
    name: siteConfig.name,
    url: base(),
    description: siteConfig.description,
    telephone: contact.phone,
    email: contact.email,
    image: `${base()}/opengraph-image`,
    logo: `${base()}/icon.svg`,
    areaServed: ["United States", "Canada"],
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address.street,
      addressLocality: contact.address.city,
      addressRegion: contact.address.region,
      postalCode: contact.address.postalCode,
      addressCountry: contact.address.country,
    },
    openingHoursSpecification: openingHours,
    sameAs: Object.values(siteConfig.social),
  };
}

export function developerJsonLd(): JsonLdNode {
  const { developer } = siteConfig;
  return {
    "@type": "Person",
    "@id": `${base()}/#developer`,
    name: developer.name,
    url: developer.url,
    jobTitle: "Full Stack Developer",
    sameAs: [developer.github, developer.linkedin],
  };
}

export function websiteJsonLd(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": `${base()}/#website`,
    url: base(),
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: siteConfig.locale,
    publisher: { "@id": `${base()}/#hospital` },
    author: { "@id": `${base()}/#developer` },
  };
}

export function faqJsonLd(items: readonly Faq[]): JsonLdNode {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Everything the home page declares, as one linked graph. */
export function homeJsonLd(items: readonly Faq[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@graph": [hospitalJsonLd(), websiteJsonLd(), developerJsonLd(), faqJsonLd(items)],
  };
}
