import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBanner } from "@/components/home/cta-banner";
import { DoctorCard } from "@/components/home/doctor-card";
import { PageHero } from "@/components/layout/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { VideoIcon } from "@/components/ui/icons-medical";
import { StarIcon } from "@/components/ui/icons-services";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { doctors } from "@/data/doctors";
import { getDoctorPhotos } from "@/lib/doctor-photos";
import { breadcrumbJsonLd, graphJsonLd, physicianJsonLd } from "@/lib/seo/json-ld";
import { getDoctorBySlug, getServiceBySlug } from "@/lib/services";
import { getInitials } from "@/lib/text";
import { siteConfig } from "../../../../site.config";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return doctors.map((doctor) => ({ slug: doctor.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);
  if (!doctor) return {};
  return {
    title: `${doctor.name}, ${doctor.specialty}`,
    description: `Book ${doctor.name}, a ${doctor.specialty.toLowerCase()} specialist at ${siteConfig.name}. ${doctor.experienceYears} years of experience, rated ${doctor.rating.toFixed(1)} out of 5.`,
    alternates: { canonical: `/doctors/${doctor.slug}` },
  };
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export default async function DoctorPage({ params }: Props) {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);
  if (!doctor) notFound();

  const service = getServiceBySlug(doctor.serviceSlug);
  const colleagues = doctors
    .filter((other) => other.category === doctor.category && other.slug !== doctor.slug)
    .slice(0, 4);
  const photos = getDoctorPhotos([doctor, ...colleagues]);
  const photo = photos[doctor.slug];

  return (
    <main id="main">
      <JsonLd
        data={graphJsonLd([
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Doctors", path: "/doctors" },
            { name: doctor.name, path: `/doctors/${doctor.slug}` },
          ]),
          physicianJsonLd(doctor, photo),
        ])}
      />

      <PageHero
        title={doctor.name}
        description={`${doctor.specialty} \u00b7 ${doctor.credentials}`}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Doctors", href: "/doctors" },
          { label: doctor.name },
        ]}
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <div className="overflow-hidden rounded-card border bg-card shadow-soft lg:sticky lg:top-28">
            <div className="relative grid aspect-[4/3] place-items-center overflow-hidden bg-gradient-to-br from-[#0d9488] to-[#0b5d6b]">
              {photo ? (
                <Image
                  src={photo}
                  alt={doctor.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 480px, 92vw"
                  className="object-cover object-top"
                />
              ) : (
                <span className="font-display text-8xl font-bold text-white/90">
                  {getInitials(doctor.name)}
                </span>
              )}
              {doctor.telehealth && (
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#0b5d6b] backdrop-blur">
                  <VideoIcon className="size-3.5" />
                  Video visits
                </span>
              )}
            </div>

            <div className="p-6">
              <p className="flex items-center gap-1.5 text-sm">
                <StarIcon className="size-4 text-warm" />
                <strong>{doctor.rating.toFixed(1)}</strong>
                <span className="text-muted-foreground">({doctor.reviews} reviews)</span>
              </p>
              <p className="mt-4 flex items-center gap-2 text-sm font-semibold">
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
                </span>
                Next available: {doctor.nextAvailable}
              </p>
              <ButtonLink
                href={`/book?doctor=${doctor.slug}`}
                size="lg"
                className="mt-6 w-full"
                arrow
              >
                Book a visit
              </ButtonLink>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Free to change up to 24 hours before your visit.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="space-y-10">
          <Reveal>
            <h2 className="font-display text-2xl font-bold">About {doctor.name}</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {doctor.name} is a {doctor.specialty.toLowerCase()} specialist at {siteConfig.name} with{" "}
              {doctor.experienceYears} years of experience. Patients rate their care{" "}
              {doctor.rating.toFixed(1)} out of 5 across {doctor.reviews} reviews.
              {doctor.languages.length > 1
                ? ` They see patients in ${joinList(doctor.languages)}.`
                : ""}
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <dl className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Specialty", value: doctor.specialty },
                { label: "Credentials", value: doctor.credentials },
                { label: "Experience", value: `${doctor.experienceYears} years` },
                { label: "Languages", value: joinList(doctor.languages) },
              ].map((item) => (
                <div key={item.label} className="rounded-card border bg-card p-5">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {item.label}
                  </dt>
                  <dd className="mt-1 font-display text-lg font-bold">{item.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {service && (
            <Reveal delay={0.1}>
              <div className="rounded-card border bg-soft p-6">
                <h2 className="font-display text-xl font-bold">Areas of care</h2>
                <p className="mt-2 text-muted-foreground">{service.description}</p>
                <Link
                  href={`/services/${service.slug}`}
                  className="mt-4 inline-flex text-sm font-bold text-primary-deep underline-offset-4 hover:underline"
                >
                  Learn about {service.title.toLowerCase()} care
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {colleagues.length > 0 && (
        <section aria-labelledby="colleagues-title" className="bg-soft/60 py-16">
          <div className="mx-auto max-w-7xl px-5">
            <Reveal>
              <SectionHeading
                id="colleagues-title"
                eyebrow="From the same department"
                title="Colleagues you may also like"
                align="left"
              />
            </Reveal>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {colleagues.map((other, index) => (
                <li key={other.slug}>
                  <Reveal delay={index * 0.08} className="h-full">
                    <DoctorCard doctor={other} photo={photos[other.slug]} index={index} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBanner />
    </main>
  );
}
