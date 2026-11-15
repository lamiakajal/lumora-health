/**
 * Placeholder reviews. Replace with real patient reviews and make sure you
 * hold written permission from each patient before publishing them.
 */
export type Testimonial = {
  name: string;
  location: string;
  visit: string;
  rating: number;
  text: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Jennifer M.",
    location: "Austin, TX",
    visit: "Primary care",
    rating: 5,
    text: "I booked on my phone at lunch and was seen the next morning. The doctor actually listened, and the price I saw online was the price I paid.",
  },
  {
    name: "David K.",
    location: "Toronto, ON",
    visit: "Video visit",
    rating: 5,
    text: "The video visit saved me a two-hour round trip. My prescription was waiting at the pharmacy before the call had even ended.",
  },
  {
    name: "Maria G.",
    location: "Phoenix, AZ",
    visit: "Pediatrics",
    rating: 5,
    text: "Our whole family goes here now. The pediatric team was wonderful with my anxious six-year-old and never rushed us.",
  },
  {
    name: "Robert T.",
    location: "Vancouver, BC",
    visit: "Cardiology",
    rating: 5,
    text: "Clear explanations, no jargon, and my test results were in the portal the same afternoon. I finally understand my treatment plan.",
  },
  {
    name: "Aisha P.",
    location: "Chicago, IL",
    visit: "Urgent care",
    rating: 5,
    text: "The easiest healthcare experience I have had. Email reminders, no phone tag, and I was in and out in under forty minutes.",
  },
  {
    name: "Tom W.",
    location: "Calgary, AB",
    visit: "Dermatology",
    rating: 4,
    text: "Friendly staff and a thorough skin check. Booking a follow-up from the portal took less than a minute.",
  },
];
