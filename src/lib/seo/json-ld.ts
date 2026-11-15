import type { Doctor } from "@/data/doctors";
import type { Faq } from "@/data/faqs";
import type { Service } from "@/data/services";
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

/** Wraps nodes in one @graph so pages can declare several things at once. */
export function graphJsonLd(nodes: JsonLdNode[]): JsonLdNode {
  return { "@context": "https://schema.org", "@graph": nodes };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${base()}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

export function serviceJsonLd(service: Service): JsonLdNode {
  return {
    "@type": "Service",
    "@id": `${base()}/services/${service.slug}#service`,
    name: service.title,
    description: service.description,
    url: `${base()}/services/${service.slug}`,
    serviceType: service.title,
    provider: { "@id": `${base()}/#hospital` },
    areaServed: ["United States", "Canada"],
  };
}

export function physicianJsonLd(doctor: Doctor, photoPath?: string | null): JsonLdNode {
  return {
    "@type": "Physician",
    "@id": `${base()}/doctors/${doctor.slug}#physician`,
    name: doctor.name,
    url: `${base()}/doctors/${doctor.slug}`,
    description: `${doctor.name} is a ${doctor.specialty} specialist at ${siteConfig.name}.`,
    knowsLanguage: doctor.languages,
    worksFor: { "@id": `${base()}/#hospital` },
    ...(photoPath ? { image: `${base()}${photoPath}` } : {}),
  };
}
