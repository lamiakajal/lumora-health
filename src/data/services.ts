import type { CategoryId } from "@/data/categories";

export type ServiceIconName =
  | "stethoscope"
  | "bolt"
  | "video"
  | "heart"
  | "heart-pulse"
  | "smile"
  | "sparkles"
  | "flask"
  | "brain"
  | "eye"
  | "bone"
  | "ear"
  | "scan"
  | "activity"
  | "message"
  | "shield";

export type Service = {
  slug: string;
  title: string;
  description: string;
  icon: ServiceIconName;
  category: CategoryId;
};

export const services: Service[] = [
  // Primary and urgent care
  { slug: "primary-care", title: "Primary Care", description: "Annual physicals, chronic condition care and preventive screenings.", icon: "stethoscope", category: "primary" },
  { slug: "family-medicine", title: "Family Medicine", description: "One trusted doctor for every age in your household.", icon: "stethoscope", category: "primary" },
  { slug: "geriatrics", title: "Geriatrics", description: "Careful, unhurried care for older adults and their families.", icon: "heart", category: "primary" },
  { slug: "urgent-care", title: "Urgent and Emergency Care", description: "Same-day visits for illness, sprains, cuts and other urgent needs.", icon: "bolt", category: "primary" },
  { slug: "telehealth", title: "Telehealth", description: "Secure video visits with your doctor, wherever you are.", icon: "video", category: "primary" },

  // Heart and vascular
  { slug: "cardiology", title: "Cardiology", description: "Heart health testing, diagnosis and long-term treatment plans.", icon: "heart-pulse", category: "heart" },
  { slug: "interventional-cardiology", title: "Interventional Cardiology", description: "Catheter-based treatment for blocked arteries and heart attacks.", icon: "heart-pulse", category: "heart" },
  { slug: "cardiac-electrophysiology", title: "Cardiac Electrophysiology", description: "Diagnosis and treatment of irregular heart rhythms.", icon: "activity", category: "heart" },
  { slug: "cardiac-surgery", title: "Cardiac Surgery", description: "Bypass, valve repair and advanced heart operations.", icon: "heart", category: "heart" },
  { slug: "vascular-surgery", title: "Vascular Surgery", description: "Treatment for diseases of arteries and veins.", icon: "activity", category: "heart" },
  { slug: "pediatric-cardiology", title: "Pediatric Cardiology", description: "Heart care for babies, children and teens.", icon: "heart-pulse", category: "heart" },

  // Brain and nerves
  { slug: "neurology", title: "Neurology", description: "Headaches, epilepsy, stroke recovery, memory and nerve conditions.", icon: "brain", category: "brain" },
  { slug: "neurosurgery", title: "Neurosurgery", description: "Surgery for the brain, spine and nervous system.", icon: "brain", category: "brain" },

  // Mental health
  { slug: "psychiatry", title: "Psychiatry", description: "Diagnosis and treatment of anxiety, depression and other conditions.", icon: "message", category: "mind" },
  { slug: "clinical-psychology", title: "Clinical Psychology", description: "Evidence-based talk therapy for individuals and couples.", icon: "message", category: "mind" },
  { slug: "child-adolescent-psychiatry", title: "Child and Adolescent Psychiatry", description: "Mental health support for young people and their families.", icon: "message", category: "mind" },

  // Children
  { slug: "pediatrics", title: "Pediatrics", description: "Check-ups, vaccines and gentle care for infants, kids and teens.", icon: "smile", category: "children" },
  { slug: "pediatric-surgery", title: "Pediatric Surgery", description: "Child-friendly surgical care from specialists who treat only children.", icon: "smile", category: "children" },

  // Women's health
  { slug: "womens-health", title: "Women's Health (OB-GYN)", description: "Gynecology, pregnancy care, screenings and wellness exams.", icon: "heart", category: "women" },

  // Bones, joints and sport
  { slug: "orthopedic-surgery", title: "Orthopedic Surgery", description: "Joint replacement, fractures and spine and sports surgery.", icon: "bone", category: "bones" },
  { slug: "sports-medicine", title: "Sports Medicine and Physiotherapy", description: "Injury recovery, rehabilitation and getting back to what you love.", icon: "activity", category: "bones" },

  // Specialist care
  { slug: "dermatology", title: "Dermatology", description: "Skin checks, acne, eczema and treatment for common conditions.", icon: "sparkles", category: "specialist" },
  { slug: "oncology", title: "Oncology", description: "Cancer screening, treatment and support, all in one place.", icon: "shield", category: "specialist" },
  { slug: "ophthalmology", title: "Ophthalmology", description: "Eye exams, cataract care and treatment for eye disease.", icon: "eye", category: "specialist" },
  { slug: "ent", title: "Ear, Nose and Throat", description: "Hearing, sinus, allergy and throat care for adults and children.", icon: "ear", category: "specialist" },
  { slug: "gastroenterology", title: "Gastroenterology", description: "Digestive health, endoscopy and liver care.", icon: "activity", category: "specialist" },
  { slug: "urology", title: "Urology", description: "Care for the urinary tract and men's health.", icon: "activity", category: "specialist" },
  { slug: "endocrinology", title: "Endocrinology", description: "Diabetes, thyroid and hormone conditions.", icon: "flask", category: "specialist" },
  { slug: "pulmonology", title: "Pulmonology", description: "Asthma, COPD, sleep apnea and other lung conditions.", icon: "activity", category: "specialist" },
  { slug: "rheumatology", title: "Rheumatology", description: "Arthritis and autoimmune conditions.", icon: "bone", category: "specialist" },
  { slug: "nephrology", title: "Nephrology", description: "Kidney health, dialysis and blood pressure care.", icon: "flask", category: "specialist" },

  // Diagnostics and wellness
  { slug: "diagnostics-lab", title: "Diagnostics and Lab", description: "On-site blood work with results in your patient portal.", icon: "flask", category: "wellness" },
  { slug: "radiology", title: "Radiology and Imaging", description: "X-ray, ultrasound, CT and MRI read by specialist radiologists.", icon: "scan", category: "wellness" },
  { slug: "dentistry", title: "Dentistry", description: "Check-ups, cleanings and restorative dental care.", icon: "sparkles", category: "wellness" },
  { slug: "anesthesiology", title: "Anesthesiology", description: "Safe, comfortable anesthesia and pain management.", icon: "shield", category: "wellness" },
  { slug: "nutrition", title: "Nutrition and Dietetics", description: "Personal eating plans from registered dietitians.", icon: "heart", category: "wellness" },
];

/** The eight specialties shown on the home page, in this order. */
export const featuredServiceSlugs = [
  "primary-care",
  "cardiology",
  "neurology",
  "psychiatry",
  "pediatrics",
  "orthopedic-surgery",
  "womens-health",
  "urgent-care",
] as const;

export function getFeaturedServices(): Service[] {
  return featuredServiceSlugs
    .map((slug) => services.find((service) => service.slug === slug))
    .filter((service): service is Service => Boolean(service));
}
