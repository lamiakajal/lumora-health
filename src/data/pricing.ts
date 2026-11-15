/** Placeholder prices in USD for patients without insurance. */
export type PricingPlan = {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  popular?: boolean;
};

export const pricingPlans: PricingPlan[] = [
  {
    id: "primary-care",
    name: "Primary care visit",
    price: 129,
    unit: "per visit",
    description: "Check-ups, new symptoms and ongoing care with your own doctor.",
    features: [
      "30-minute in-person visit",
      "Prescriptions sent to your pharmacy",
      "Visit summary in your patient portal",
    ],
    cta: "Book primary care",
    href: "/book?service=primary-care",
  },
  {
    id: "video-visit",
    name: "Video visit",
    price: 79,
    unit: "per visit",
    description: "See a doctor from home without the travel or the waiting room.",
    features: [
      "Usually available within 24 hours",
      "Private, secure video",
      "Prescriptions when appropriate",
    ],
    cta: "Book a video visit",
    href: "/book?service=telehealth",
    popular: true,
  },
  {
    id: "specialist",
    name: "Specialist consultation",
    price: 189,
    unit: "per visit",
    description: "Cardiology, dermatology, women's health and more.",
    features: [
      "45-minute consultation",
      "No referral required",
      "Care plan and follow-up included",
    ],
    cta: "Book a specialist",
    href: "/book?service=specialist",
  },
];
