import { Hero } from "@/components/home/hero";
import { StatsBand } from "@/components/home/stats-band";
import { findPublicImage } from "@/lib/public-images";

export default function Home() {
  // Add public/images/hero.jpg (or .webp/.png) and it is picked up automatically.
  const heroPhoto = findPublicImage("/images/hero");

  return (
    <main id="main">
      <Hero photo={heroPhoto} />
      <StatsBand />
    </main>
  );
}
