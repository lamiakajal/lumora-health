import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceIcon } from "@/components/ui/service-icon";
import { servicesCopy } from "@/data/home-copy";
import { getFeaturedServices, services } from "@/data/services";

export function ServicesGrid() {
  const featured = getFeaturedServices();

  return (
    <section aria-labelledby="services-title" className="mx-auto mt-24 max-w-7xl px-5">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <Reveal>
          <SectionHeading
            id="services-title"
            eyebrow={servicesCopy.eyebrow}
            title={servicesCopy.title}
            description={servicesCopy.description}
            align="left"
          />
        </Reveal>
        <Reveal delay={0.1}>
          <ButtonLink href="/services" variant="outline" arrow>
            View all {services.length} specialties
          </ButtonLink>
        </Reveal>
      </div>

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((service, index) => (
          <li key={service.slug}>
            <Reveal delay={(index % 4) * 0.08} className="h-full">
              <Link
                href={`/services/${service.slug}`}
                className="group flex h-full flex-col rounded-card border bg-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary hover:shadow-lift"
              >
                <span className="grid size-14 place-items-center rounded-2xl bg-soft text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <ServiceIcon name={service.icon} className="size-7" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold">{service.title}</h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary-deep">
                  Learn more
                  <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-1.5" />
                </span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
