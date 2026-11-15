import type { CategoryId } from "@/data/categories";

/**
 * Sample physicians. These are fictional placeholders: replace them with the
 * client's real team before launch. Photos are optional: save a portrait as
 * public/images/doctors/<slug>.webp (or .jpg/.png) and it appears automatically.
 */
export type Doctor = {
  slug: string;
  /** The specialty page this doctor belongs to (see data/services.ts). */
  serviceSlug: string;
  name: string;
  specialty: string;
  category: CategoryId;
  credentials: string;
  experienceYears: number;
  rating: number;
  reviews: number;
  languages: string[];
  nextAvailable: string;
  telehealth: boolean;
};

export const doctors: Doctor[] = [
  { slug: "amelia-hart", serviceSlug: "primary-care", name: "Dr. Amelia Hart", specialty: "Primary Care", category: "primary", credentials: "MD, FAAFP", experienceYears: 14, rating: 4.9, reviews: 812, languages: ["English", "Spanish"], nextAvailable: "Today", telehealth: true },
  { slug: "samuel-tremblay", serviceSlug: "family-medicine", name: "Dr. Samuel Tremblay", specialty: "Family Medicine", category: "primary", credentials: "MD, CCFP", experienceYears: 12, rating: 4.8, reviews: 559, languages: ["English", "French"], nextAvailable: "Today", telehealth: true },
  { slug: "emily-carter", serviceSlug: "geriatrics", name: "Dr. Emily Carter", specialty: "Geriatrics", category: "primary", credentials: "MD, AGSF", experienceYears: 22, rating: 4.9, reviews: 468, languages: ["English"], nextAvailable: "Tomorrow", telehealth: true },
  { slug: "aisha-rahman", serviceSlug: "urgent-care", name: "Dr. Aisha Rahman", specialty: "Emergency and Urgent Care", category: "primary", credentials: "MD, FACEP", experienceYears: 8, rating: 4.8, reviews: 402, languages: ["English", "Bengali", "Urdu"], nextAvailable: "Today", telehealth: false },

  { slug: "daniel-okafor", serviceSlug: "cardiology", name: "Dr. Daniel Okafor", specialty: "Cardiology", category: "heart", credentials: "MD, FACC", experienceYears: 18, rating: 4.9, reviews: 640, languages: ["English", "French"], nextAvailable: "Tomorrow", telehealth: true },
  { slug: "elena-vasquez", serviceSlug: "interventional-cardiology", name: "Dr. Elena Vasquez", specialty: "Interventional Cardiology", category: "heart", credentials: "MD, FSCAI", experienceYears: 15, rating: 4.9, reviews: 377, languages: ["English", "Spanish"], nextAvailable: "In 2 days", telehealth: false },
  { slug: "henry-caldwell", serviceSlug: "cardiac-electrophysiology", name: "Dr. Henry Caldwell", specialty: "Cardiac Electrophysiology", category: "heart", credentials: "MD, FRCPC", experienceYears: 20, rating: 4.9, reviews: 521, languages: ["English"], nextAvailable: "In 3 days", telehealth: true },
  { slug: "kenji-nakamura", serviceSlug: "cardiac-surgery", name: "Dr. Kenji Nakamura", specialty: "Cardiac Surgery", category: "heart", credentials: "MD, FACS", experienceYears: 24, rating: 5.0, reviews: 289, languages: ["English", "Japanese"], nextAvailable: "In 5 days", telehealth: false },
  { slug: "laura-bennett", serviceSlug: "vascular-surgery", name: "Dr. Laura Bennett", specialty: "Vascular Surgery", category: "heart", credentials: "MD, FACS", experienceYears: 13, rating: 4.8, reviews: 311, languages: ["English"], nextAvailable: "In 3 days", telehealth: false },
  { slug: "miguel-alvarez", serviceSlug: "pediatric-cardiology", name: "Dr. Miguel Alvarez", specialty: "Pediatric Cardiology", category: "heart", credentials: "MD, FAAP", experienceYears: 11, rating: 4.9, reviews: 264, languages: ["English", "Spanish"], nextAvailable: "In 4 days", telehealth: true },

  { slug: "david-kessler", serviceSlug: "neurology", name: "Dr. David Kessler", specialty: "Neurology", category: "brain", credentials: "MD, FAAN", experienceYears: 19, rating: 4.8, reviews: 497, languages: ["English", "German"], nextAvailable: "Tomorrow", telehealth: true },
  { slug: "fatima-al-sayed", serviceSlug: "neurosurgery", name: "Dr. Fatima Al-Sayed", specialty: "Neurosurgery", category: "brain", credentials: "MD, FAANS", experienceYears: 16, rating: 4.9, reviews: 238, languages: ["English", "Arabic"], nextAvailable: "In 6 days", telehealth: false },

  { slug: "jonathan-weiss", serviceSlug: "psychiatry", name: "Dr. Jonathan Weiss", specialty: "Psychiatry", category: "mind", credentials: "MD, FAPA", experienceYears: 21, rating: 4.9, reviews: 611, languages: ["English", "Hebrew"], nextAvailable: "Tomorrow", telehealth: true },
  { slug: "grace-adeyemi", serviceSlug: "clinical-psychology", name: "Dr. Grace Adeyemi", specialty: "Clinical Psychology", category: "mind", credentials: "PhD, CPsych", experienceYears: 9, rating: 5.0, reviews: 534, languages: ["English", "Yoruba"], nextAvailable: "Today", telehealth: true },
  { slug: "noah-patel", serviceSlug: "child-adolescent-psychiatry", name: "Dr. Noah Patel", specialty: "Child and Adolescent Psychiatry", category: "mind", credentials: "MD, FAACAP", experienceYears: 12, rating: 4.9, reviews: 342, languages: ["English", "Gujarati"], nextAvailable: "In 2 days", telehealth: true },

  { slug: "priya-raman", serviceSlug: "pediatrics", name: "Dr. Priya Raman", specialty: "Pediatrics", category: "children", credentials: "MD, FAAP", experienceYears: 11, rating: 5.0, reviews: 905, languages: ["English", "Hindi", "Tamil"], nextAvailable: "Today", telehealth: true },
  { slug: "olivia-chen", serviceSlug: "pediatric-surgery", name: "Dr. Olivia Chen", specialty: "Pediatric Surgery", category: "children", credentials: "MD, FACS", experienceYears: 14, rating: 4.9, reviews: 227, languages: ["English", "Mandarin"], nextAvailable: "In 5 days", telehealth: false },

  { slug: "sofia-marchetti", serviceSlug: "womens-health", name: "Dr. Sofia Marchetti", specialty: "Obstetrics and Gynecology", category: "women", credentials: "MD, FACOG", experienceYears: 16, rating: 4.9, reviews: 733, languages: ["English", "Italian"], nextAvailable: "Tomorrow", telehealth: true },

  { slug: "robert-hayes", serviceSlug: "orthopedic-surgery", name: "Dr. Robert Hayes", specialty: "Orthopedic Surgery", category: "bones", credentials: "MD, FAAOS", experienceYears: 23, rating: 4.8, reviews: 584, languages: ["English"], nextAvailable: "In 2 days", telehealth: false },
  { slug: "chloe-martin", serviceSlug: "sports-medicine", name: "Dr. Chloe Martin", specialty: "Sports Medicine and Physiotherapy", category: "bones", credentials: "DPT, SCS", experienceYears: 8, rating: 4.9, reviews: 419, languages: ["English", "French"], nextAvailable: "Today", telehealth: false },

  { slug: "marcus-lee", serviceSlug: "dermatology", name: "Dr. Marcus Lee", specialty: "Dermatology", category: "specialist", credentials: "MD, FAAD", experienceYears: 9, rating: 4.8, reviews: 478, languages: ["English", "Mandarin"], nextAvailable: "In 2 days", telehealth: false },
  { slug: "ahmed-khalil", serviceSlug: "oncology", name: "Dr. Ahmed Khalil", specialty: "Oncology", category: "specialist", credentials: "MD, FASCO", experienceYears: 21, rating: 4.9, reviews: 356, languages: ["English", "Arabic"], nextAvailable: "In 3 days", telehealth: true },
  { slug: "isabelle-roy", serviceSlug: "ophthalmology", name: "Dr. Isabelle Roy", specialty: "Ophthalmology", category: "specialist", credentials: "MD, FRCSC", experienceYears: 15, rating: 4.9, reviews: 402, languages: ["English", "French"], nextAvailable: "In 2 days", telehealth: false },
  { slug: "thomas-grant", serviceSlug: "ent", name: "Dr. Thomas Grant", specialty: "Ear, Nose and Throat", category: "specialist", credentials: "MD, FACS", experienceYears: 17, rating: 4.8, reviews: 365, languages: ["English"], nextAvailable: "Tomorrow", telehealth: false },
  { slug: "natalie-brooks", serviceSlug: "gastroenterology", name: "Dr. Natalie Brooks", specialty: "Gastroenterology", category: "specialist", credentials: "MD, AGAF", experienceYears: 14, rating: 4.8, reviews: 447, languages: ["English"], nextAvailable: "Tomorrow", telehealth: true },
  { slug: "victor-ivanov", serviceSlug: "urology", name: "Dr. Victor Ivanov", specialty: "Urology", category: "specialist", credentials: "MD, FACS", experienceYears: 19, rating: 4.8, reviews: 331, languages: ["English", "Russian"], nextAvailable: "In 4 days", telehealth: false },
  { slug: "hannah-kim", serviceSlug: "endocrinology", name: "Dr. Hannah Kim", specialty: "Endocrinology", category: "specialist", credentials: "MD, FACE", experienceYears: 13, rating: 4.9, reviews: 389, languages: ["English", "Korean"], nextAvailable: "In 2 days", telehealth: true },
  { slug: "carlos-mendes", serviceSlug: "pulmonology", name: "Dr. Carlos Mendes", specialty: "Pulmonology", category: "specialist", credentials: "MD, FCCP", experienceYears: 18, rating: 4.8, reviews: 295, languages: ["English", "Portuguese"], nextAvailable: "In 3 days", telehealth: true },
  { slug: "rachel-goldberg", serviceSlug: "rheumatology", name: "Dr. Rachel Goldberg", specialty: "Rheumatology", category: "specialist", credentials: "MD, FACR", experienceYears: 15, rating: 4.9, reviews: 273, languages: ["English"], nextAvailable: "In 5 days", telehealth: true },
  { slug: "james-oduya", serviceSlug: "nephrology", name: "Dr. James Oduya", specialty: "Nephrology", category: "specialist", credentials: "MD, FASN", experienceYears: 14, rating: 4.8, reviews: 251, languages: ["English", "Swahili"], nextAvailable: "In 4 days", telehealth: true },

  { slug: "peter-nguyen", serviceSlug: "radiology", name: "Dr. Peter Nguyen", specialty: "Radiology", category: "wellness", credentials: "MD, FACR", experienceYears: 16, rating: 4.8, reviews: 188, languages: ["English", "Vietnamese"], nextAvailable: "Today", telehealth: false },
  { slug: "linda-park", serviceSlug: "dentistry", name: "Dr. Linda Park", specialty: "Dentistry", category: "wellness", credentials: "DDS", experienceYears: 12, rating: 4.9, reviews: 522, languages: ["English", "Korean"], nextAvailable: "Tomorrow", telehealth: false },
  { slug: "mark-thompson", serviceSlug: "anesthesiology", name: "Dr. Mark Thompson", specialty: "Anesthesiology", category: "wellness", credentials: "MD, FASA", experienceYears: 20, rating: 4.8, reviews: 204, languages: ["English"], nextAvailable: "In 3 days", telehealth: false },
  { slug: "sarah-whitfield", serviceSlug: "nutrition", name: "Sarah Whitfield", specialty: "Nutrition and Dietetics", category: "wellness", credentials: "RD, CDCES", experienceYears: 10, rating: 4.9, reviews: 436, languages: ["English"], nextAvailable: "Today", telehealth: true },
];
