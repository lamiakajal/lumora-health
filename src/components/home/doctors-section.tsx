import { DoctorsPreview } from "@/components/home/doctors-preview";
import { doctors } from "@/data/doctors";
import { findPublicImage } from "@/lib/public-images";

/** Looks up each doctor's portrait on the server, then hands them to the interactive list. */
export function DoctorsSection() {
  const photos = Object.fromEntries(
    doctors.map((doctor) => [doctor.slug, findPublicImage(`/images/doctors/${doctor.slug}`)]),
  );

  return <DoctorsPreview photos={photos} />;
}
