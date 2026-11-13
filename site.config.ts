/**
 * Single source of truth for brand and contact details.
 * Replace these values with the client's real information before launch.
 */
export const siteConfig = {
  name: "Lumora Health",
  shortName: "Lumora",
  tagline: "Modern care, closer to home.",
  description:
    "Lumora Health is a multi-specialty medical group offering same-week appointments, telehealth visits and transparent pricing across the United States and Canada.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en-US",
  contact: {
    phone: "(415) 555-0132",
    emergencyPhone: "(415) 555-0199",
    email: "care@lumorahealth.example",
    address: {
      street: "410 Market Street, Suite 200",
      city: "San Francisco",
      region: "CA",
      postalCode: "94105",
      country: "US",
    },
  },
  hours: [
    { days: "Monday – Friday", time: "8:00 AM – 6:00 PM" },
    { days: "Saturday", time: "9:00 AM – 2:00 PM" },
    { days: "Sunday", time: "Closed (emergency line open 24/7)" },
  ],
  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    x: "https://x.com/",
    linkedin: "https://linkedin.com/",
  },
  developer: {
    name: "Lamia Kajal",
    url: "https://lamiakajal.com",
    github: "https://github.com/lamiakajal",
    linkedin: "https://www.linkedin.com/in/lamiakajal",
  },
} as const;

export type SiteConfig = typeof siteConfig;
