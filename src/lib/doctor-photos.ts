import type { Doctor } from "@/data/doctors";
import { findPublicImage } from "@/lib/public-images";

/** Finds public/images/doctors/<slug>.* for each doctor (server side). */
export function getDoctorPhotos(list: readonly Doctor[]): Record<string, string | null> {
  return Object.fromEntries(
    list.map((doctor) => [doctor.slug, findPublicImage(`/images/doctors/${doctor.slug}`)]),
  );
}
