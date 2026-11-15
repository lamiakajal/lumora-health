"use client";

import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ChevronLeftIcon, ChevronRightIcon, QuoteIcon, StarIcon } from "@/components/ui/icons-services";
import { testimonials } from "@/data/testimonials";
import { testimonialsCopy } from "@/data/home-copy";
import { useCarousel } from "@/hooks/use-carousel";
import { cn } from "@/lib/cn";
import { getInitials } from "@/lib/text";

export function Testimonials() {
  const { trackRef, scrollByCard, pause, resume } = useCarousel<HTMLUListElement>({
    autoplayMs: 6000,
  });

  const arrow =
    "grid size-12 place-items-center rounded-full border bg-card transition hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-95";

  return (
    <section
      aria-labelledby="testimonials-title"
      className="mx-auto mt-24 max-w-7xl px-5"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
    >
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <Reveal>
          <SectionHeading
            id="testimonials-title"
            eyebrow={testimonialsCopy.eyebrow}
            title={testimonialsCopy.title}
            align="left"
          />
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex text-warm">
              {Array.from({ length: 5 }).map((_, index) => (
                <StarIcon key={index} className="size-4" />
              ))}
            </span>
            <strong className="text-foreground">{testimonialsCopy.summary.score}/5</strong> from{" "}
            {testimonialsCopy.summary.count} verified reviews
          </p>
        </Reveal>

        <div className="flex gap-3">
          <button type="button" aria-label="Previous review" onClick={() => scrollByCard(-1)} className={arrow}>
            <ChevronLeftIcon />
          </button>
          <button type="button" aria-label="Next review" onClick={() => scrollByCard(1)} className={arrow}>
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      <ul
        ref={trackRef}
        aria-roledescription="carousel"
        aria-label="Patient reviews"
        className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map((item) => (
          <li
            key={item.name}
            className="shrink-0 basis-[88%] snap-start sm:basis-[calc(50%-12px)] lg:basis-[calc(33.333%-16px)]"
          >
            <figure className="flex h-full flex-col rounded-card border bg-card p-7 transition-shadow duration-300 hover:shadow-lift">
              <QuoteIcon className="size-9 text-primary/30" />
              <div className="mt-4 flex text-warm" aria-label={`${item.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon
                    key={index}
                    className={cn("size-4", index >= item.rating && "text-border")}
                  />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 leading-relaxed">{item.text}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t pt-5">
                <span className="grid size-11 place-items-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">
                  {getInitials(item.name)}
                </span>
                <span className="leading-tight">
                  <span className="block font-bold">{item.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.location} &middot; {item.visit}
                  </span>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
