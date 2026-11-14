/**
 * Home page copy and data.
 * Every number and claim here is placeholder content: replace it with the
 * client's real figures before launch.
 */

export const hero = {
  badge: "Same-week appointments available",
  headlineStart: "Quality healthcare,",
  headlineHighlight: "closer to home.",
  description:
    "Book a visit with board-certified doctors, in person or by secure video. Clear prices, most major insurance plans accepted, and your results waiting in your patient portal.",
  primaryCta: { label: "Book appointment", href: "/book" },
  secondaryCta: { label: "Explore services", href: "/services" },
  rating: { score: "4.9", reviews: "12,400+" },
} as const;

/** Alt text for the hero photo. Drop a file named hero.jpg/.webp/.png in /public/images and it appears. */
export const heroImageAlt = "A Lumora Health doctor talking with a patient";

export const specialtyOptions = [
  "Primary Care",
  "Urgent Care",
  "Pediatrics",
  "Women's Health",
  "Cardiology",
  "Dermatology",
  "Orthopedics",
  "Neurology",
  "Mental Health",
  "Diagnostics & Lab",
] as const;

export const insuranceOptions = [
  "Aetna",
  "Anthem Blue Cross Blue Shield",
  "Cigna",
  "UnitedHealthcare",
  "Medicare",
  "Medicaid",
  "Manulife (Canada)",
  "Sun Life (Canada)",
  "Canada Life",
  "Self-pay / no insurance",
] as const;

export const stats = [
  { value: 120, suffix: "+", label: "Physicians and specialists" },
  { value: 48, suffix: "k+", label: "Patients cared for each year" },
  { value: 28, suffix: "", label: "Medical specialties" },
  { value: 4.9, suffix: "/5", decimals: 1, label: "Average patient rating" },
] as const;
