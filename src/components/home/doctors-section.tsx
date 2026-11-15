import { DoctorsPreview } from "@/components/home/doctors-preview";
import { doctors } from "@/data/doctors";
import { getDoctorPhotos } from "@/lib/doctor-photos";

/** Looks up each doctor's portrait on the server, then hands them to the interactive list. */
export function DoctorsSection() {
  return <DoctorsPreview photos={getDoctorPhotos(doctors)} />;
}
