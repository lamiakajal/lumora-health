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
