"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons-services";
import { ServiceIcon } from "@/components/ui/service-icon";
import { facilities, facilitiesCopy } from "@/data/facilities";
import { useCarousel } from "@/hooks/use-carousel";

const gradients = [
  "from-[#0d9488] to-[#0b4f6c]",
  "from-[#0ea5e9] to-[#0369a1]",
  "from-[#14b8a6] to-[#0f766e]",
  "from-[#38bdf8] to-[#0d9488]",
] as const;

type FacilitiesSliderProps = {
  /** Photo paths keyed by facility id, found on the server. */
  photos: Record<string, string | null>;
};

export function FacilitiesSlider({ photos }: FacilitiesSliderProps) {
  const { trackRef, scrollByCard, pause, resume } = useCarousel<HTMLUListElement>({
    autoplayMs: 5000,
  });

  const arrow =
    "grid size-12 place-items-center rounded-full border bg-card transition hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-95";

  return (
    <section
      aria-labelledby="facilities-title"
      className="mt-24 bg-soft/60 py-24"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <SectionHeading
              id="facilities-title"
              eyebrow={facilitiesCopy.eyebrow}
              title={facilitiesCopy.title}
              description={facilitiesCopy.description}
              align="left"
            />
          </Reveal>
          <div className="flex gap-3">
            <button type="button" aria-label="Previous facility" onClick={() => scrollByCard(-1)} className={arrow}>
              <ChevronLeftIcon />
            </button>
            <button type="button" aria-label="Next facility" onClick={() => scrollByCard(1)} className={arrow}>
              <ChevronRightIcon />
            </button>
          </div>
        </div>

        <ul
          ref={trackRef}
          aria-roledescription="carousel"
          aria-label="Our facilities"
          className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {facilities.map((facility, index) => {
            const photo = photos[facility.id];
            return (
              <li
                key={facility.id}
                className="shrink-0 basis-[82%] snap-start sm:basis-[calc(50%-12px)] lg:basis-[calc(33.333%-16px)] xl:basis-[calc(25%-18px)]"
              >
                <figure
                  className={`group relative aspect-[4/5] overflow-hidden rounded-card bg-gradient-to-br ${gradients[index % gradients.length]} shadow-soft transition-shadow duration-300 hover:shadow-lift`}
                >
                  {photo ? (
                    <Image
                      src={photo}
                      alt={facility.title}
                      fill
                      sizes="(min-width: 1280px) 290px, (min-width: 1024px) 380px, (min-width: 640px) 45vw, 82vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <ServiceIcon
                      name={facility.icon}
                      className="absolute left-1/2 top-[38%] size-24 -translate-x-1/2 -translate-y-1/2 text-white/80 transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06222a]/90 via-[#06222a]/20 to-transparent" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="font-display text-xl font-bold">{facility.title}</p>
                    <p className="mt-1.5 text-sm leading-snug text-white/80">{facility.text}</p>
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
