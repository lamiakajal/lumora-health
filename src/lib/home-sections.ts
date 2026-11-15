/**
 * Copy for the quick actions, "how it works" and about sections.
 * All wording and numbers are placeholders: replace with the client's real content.
 */
import { toTelHref } from "@/lib/format";
import { siteConfig } from "../../site.config";

export const quickActions = [
  {
    id: "doctor",
    title: "Find a doctor",
    text: "Search 120+ physicians by specialty, location and insurance, then compare profiles and ratings.",
    cta: "View all doctors",
    href: "/doctors",
  },
  {
    id: "nurse",
    title: "24/7 nurse line",
    text: "Talk to a registered nurse any time, day or night, about symptoms or whether you need to be seen.",
    cta: `Call ${siteConfig.contact.emergencyPhone}`,
    href: toTelHref(siteConfig.contact.emergencyPhone),
  },
  {
    id: "book",
    title: "Book an appointment",
    text: "Pick a time that suits you. Most visits can be booked within the same week, in person or online.",
    cta: "Request a visit",
    href: "/book",
  },
] as const;

export const howItWorks = {
  eyebrow: "How it works",
  title: "Care in three simple steps",
  description:
    "No phone queues and no paperwork on the day. Book online and we take care of the rest.",
  steps: [
    {
      title: "Find your doctor",
      text: "Search by specialty, location or insurance, then compare profiles, ratings and visit prices.",
    },
    {
      title: "Choose a time",
      text: "See live availability, book in under two minutes and get an instant confirmation by email.",
    },
    {
      title: "Get the care you need",
      text: "Visit in person or by secure video, then find your notes and receipts in your patient portal.",
    },
  ],
} as const;

export const about = {
  eyebrow: "About Lumora Health",
  title: "A modern medical group built around you",
  paragraphs: [
    "Lumora Health started with a simple idea: getting care should be as easy as booking a table. Our physicians, nurses and care coordinators work as one team across primary care and more than two dozen specialties, so you never repeat your story or wait weeks for answers.",
    "From same-week appointments and secure video visits to clear, upfront pricing, every part of your experience is designed to save you time and give you confidence.",
  ],
  highlights: [
    "Board-certified physicians and specialists",
    "Same-week appointments and video visits",
    "Upfront pricing, most insurance accepted",
    "One secure portal for results and records",
  ],
  badge: { value: "15+", label: "years of trusted care" },
  primaryCta: { label: "Learn more about us", href: "/about" },
  secondaryCta: { label: "Meet our doctors", href: "/doctors" },
} as const;
