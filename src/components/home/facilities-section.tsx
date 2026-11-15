import { FacilitiesSlider } from "@/components/home/facilities-slider";
import { facilities } from "@/data/facilities";
import { findPublicImage } from "@/lib/public-images";

/** Looks for public/images/facility-<id>.* on the server, then renders the slider. */
export function FacilitiesSection() {
  const photos = Object.fromEntries(
    facilities.map((facility) => [facility.id, findPublicImage(`/images/facility-${facility.id}`)]),
  );

  return <FacilitiesSlider photos={photos} />;
}
