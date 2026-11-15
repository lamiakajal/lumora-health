import { categories, type CategoryId } from "@/data/categories";
import type { Doctor } from "@/data/doctors";

export const ALL_CATEGORIES = "all";

/** Returns up to `limit` doctors for a tab ("all" keeps everyone). */
export function filterDoctors(
  doctors: readonly Doctor[],
  categoryId: string,
  limit = 8,
): Doctor[] {
  const matches =
    categoryId === ALL_CATEGORIES
      ? doctors
      : doctors.filter((doctor) => doctor.category === categoryId);
  return matches.slice(0, limit);
}

/** Categories that have at least one doctor, in the order they are defined. */
export function categoriesWithDoctors(doctors: readonly Doctor[]): CategoryId[] {
  const used = new Set(doctors.map((doctor) => doctor.category));
  return categories.filter((category) => used.has(category.id)).map((category) => category.id);
}

// ---------------------------------------------------------------------------
// Search page logic
// ---------------------------------------------------------------------------

export type DoctorSort = "soonest" | "rating" | "experience" | "name";

export type DoctorFilters = {
  q: string;
  category: string;
  /** The specialty chosen in the home page search bar, e.g. "Cardiology". */
  specialty: string;
  language: string;
  video: boolean;
  sort: DoctorSort;
};

export const defaultDoctorFilters: DoctorFilters = {
  q: "",
  category: ALL_CATEGORIES,
  specialty: "",
  language: "",
  video: false,
  sort: "soonest",
};

/** "Today" -> 0, "Tomorrow" -> 1, "In 3 days" -> 3. Unknown text sorts last. */
export function availabilityRank(text: string): number {
  const value = text.trim().toLowerCase();
  if (value === "today") return 0;
  if (value === "tomorrow") return 1;
  const match = value.match(/(\d+)\s*day/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

const specialtyKeywords: Record<string, string> = {
  "Urgent Care": "urgent",
  Dermatology: "dermatology",
};

const specialtyCategories: Record<string, CategoryId> = {
  "Primary Care": "primary",
  Pediatrics: "children",
  "Women's Health": "women",
  Cardiology: "heart",
  Orthopedics: "bones",
  Neurology: "brain",
  "Mental Health": "mind",
  "Diagnostics & Lab": "wellness",
};

/** Matches the options of the home page "Specialty" select. */
export function matchesSpecialty(doctor: Doctor, specialty: string): boolean {
  if (!specialty) return true;
  const keyword = specialtyKeywords[specialty];
  if (keyword) return doctor.specialty.toLowerCase().includes(keyword);
  const category = specialtyCategories[specialty];
  if (category) return doctor.category === category;
  return doctor.specialty.toLowerCase().includes(specialty.toLowerCase());
}

export function allLanguages(list: readonly Doctor[]): string[] {
  return Array.from(new Set(list.flatMap((doctor) => doctor.languages))).sort((a, b) =>
    a.localeCompare(b),
  );
}

export function searchDoctors(list: readonly Doctor[], filters: DoctorFilters): Doctor[] {
  const needle = filters.q.trim().toLowerCase();

  const matches = list.filter((doctor) => {
    if (filters.category !== ALL_CATEGORIES && doctor.category !== filters.category) return false;
    if (!matchesSpecialty(doctor, filters.specialty)) return false;
    if (filters.language && !doctor.languages.includes(filters.language)) return false;
    if (filters.video && !doctor.telehealth) return false;
    if (needle) {
      const haystack = `${doctor.name} ${doctor.specialty} ${doctor.languages.join(" ")}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });

  const sorted = [...matches];
  switch (filters.sort) {
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
      break;
    case "experience":
      sorted.sort((a, b) => b.experienceYears - a.experienceYears);
      break;
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      sorted.sort(
        (a, b) => availabilityRank(a.nextAvailable) - availabilityRank(b.nextAvailable) || b.rating - a.rating,
      );
  }
  return sorted;
}
