import type { ServiceIconName } from "@/data/services";

/** Photos are optional: save public/images/facility-<id>.webp (or .jpg/.png) and it appears. */
export type Facility = {
  id: string;
  title: string;
  text: string;
  icon: ServiceIconName;
};

export const facilities: Facility[] = [
  { id: "lab", title: "Modern laboratory", text: "On-site testing with results in your portal, often the same day.", icon: "flask" },
  { id: "surgery", title: "Operating suites", text: "Sterile, state-of-the-art theatres for day surgery and complex procedures.", icon: "heart-pulse" },
  { id: "radiology", title: "Imaging and radiology", text: "X-ray, ultrasound, CT and MRI under one roof.", icon: "scan" },
  { id: "icu", title: "Intensive care", text: "Round-the-clock monitoring by specialist critical-care teams.", icon: "activity" },
  { id: "room", title: "Patient rooms", text: "Quiet private rooms designed for rest and recovery.", icon: "heart" },
  { id: "pediatric", title: "Children's ward", text: "A bright, friendly space built around young patients and their parents.", icon: "smile" },
  { id: "pharmacy", title: "On-site pharmacy", text: "Collect your prescription before you leave.", icon: "shield" },
  { id: "waiting", title: "Welcoming lounges", text: "Comfortable waiting areas with free Wi-Fi and refreshments.", icon: "stethoscope" },
];

export const facilitiesCopy = {
  eyebrow: "Our facilities",
  title: "Experience excellence in medical care",
  description: "Modern spaces and technology, designed so you feel safe, comfortable and cared for.",
};
