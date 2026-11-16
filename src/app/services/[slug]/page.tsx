import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CtaBanner } from "@/components/home/cta-banner";
import { DoctorCard } from "@/components/home/doctor-card";
import { PageHero } from "@/components/layout/page-hero";
import { PageSkeleton } from "@/components/layout/page-skeleton";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { CalendarIcon, ShieldCheckIcon, StethoscopeIcon } from "@/components/ui/icons-medical";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceIcon } from "@/components/ui/service-icon";
import { services } from "@/data/services";
import { getDoctorPhotos } from "@/lib/doctor-photos";
import { breadcrumbJsonLd, graphJsonLd, serviceJsonLd } from "@/lib/seo/json-ld";
import {
  doctorsForService,
  getCategoryLabel,
  getServiceBySlug,
  relatedServices,
} from "@/lib/services";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: `${service.title} care`,
    description: `${service.description} Book online with our ${service.title.toLowerCase()} specialists.`,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

const steps = [
  {
    icon: CalendarIcon,
    title: "Book in minutes",
    text: "Choose a time online. We confirm by email and remind you before your visit.",
  },
  {
    icon: StethoscopeIcon,
    title: "A plan made for you",
    text: "Your doctor explains your options clearly and builds a care plan with you.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Everything in one place",
    text: "Results, notes and follow-ups live in your secure patient portal.",
  },
] as const;

async function ServiceContent({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const team = doctorsForService(service);
  const photos = getDoctorPhotos(team);
  const related = relatedServices(service);

  return (
    <main id="main">
      <JsonLd
        data={graphJsonLd([
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Specialties", path: "/services" },
            { name: service.title, path: `/services/${service.slug}` },
          ]),
          serviceJsonLd(service),
        ])}
      />

      <PageHero
        eyebrow={getCategoryLabel(service.category)}
        title={service.title}
        description={service.description}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Specialties", href: "/services" },
          { label: service.title },
        ]}
      >
        <ButtonLink href={`/book?service=${service.slug}`} size="lg" arrow>
          Book a visit
        </ButtonLink>
        <ButtonLink href="/doctors" size="lg" variant="outline">
          See all doctors
        </ButtonLink>
      </PageHero>

      <section aria-labelledby="expect-title" className="mx-auto max-w-7xl px-5 py-16">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="grid size-14 place-items-center rounded-2xl bg-soft text-primary">
              <ServiceIcon name={service.icon} className="size-7" />
            </span>
            <h2 id="expect-title" className="font-display text-2xl font-bold sm:text-3xl">
              What to expect from {service.title.toLowerCase()} care
            </h2>
          </div>
        </Reveal>

        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title}>
              <Reveal delay={index * 0.1} className="h-full">
                <div className="h-full rounded-card border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <span className="grid size-12 place-items-center rounded-2xl bg-soft text-primary">
                    <step.icon className="size-6" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="team-title" className="bg-soft/60 py-16">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal>
            <SectionHeading
              id="team-title"
              eyebrow="Your care team"
              title={`Meet our ${service.title.toLowerCase()} doctors`}
              align="left"
            />
          </Reveal>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {team.map((doctor, index) => (
              <li key={doctor.slug}>
                <Reveal delay={(index % 4) * 0.08} className="h-full">
                  <DoctorCard doctor={doctor} photo={photos[doctor.slug]} index={index} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="mx-auto max-w-7xl px-5 py-16">
          <Reveal>
            <h2 id="related-title" className="font-display text-2xl font-bold">
              Related specialties
            </h2>
          </Reveal>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item, index) => (
              <li key={item.slug}>
                <Reveal delay={index * 0.08} className="h-full">
                  <Link
                    href={`/services/${item.slug}`}
                    className="group flex h-full flex-col rounded-card border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lift"
                  >
                    <span className="grid size-11 place-items-center rounded-xl bg-soft text-primary">
                      <ServiceIcon name={item.icon} className="size-5" />
                    </span>
                    <span className="mt-3 font-display text-base font-bold">{item.title}</span>
                    <span className="mt-1 flex-1 text-sm text-muted-foreground">
                      {item.description}
                    </span>
                    <span className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-primary-deep">
                      Learn more
                      <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-1.5" />
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      )}

      <CtaBanner />
    </main>
  );
}

/**
 * Reading the URL (params) happens behind Suspense so Next.js can show the page shell
 * instantly. Every known slug is still fully prerendered by generateStaticParams.
 */
export default function ServicePage({ params }: Props) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ServiceContent params={params} />
    </Suspense>
  );
}
