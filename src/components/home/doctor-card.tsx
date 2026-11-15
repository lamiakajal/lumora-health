import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { VideoIcon } from "@/components/ui/icons-medical";
import { StarIcon } from "@/components/ui/icons-services";
import type { Doctor } from "@/data/doctors";
import { getInitials } from "@/lib/text";

const gradients = [
  "from-[#0d9488] to-[#0b5d6b]",
  "from-[#0ea5e9] to-[#0369a1]",
  "from-[#14b8a6] to-[#0f766e]",
  "from-[#38bdf8] to-[#0d9488]",
] as const;

type DoctorCardProps = {
  doctor: Doctor;
  /** Portrait path from /public (found automatically), or null to show initials. */
  photo?: string | null;
  index?: number;
};

export function DoctorCard({ doctor, photo, index = 0 }: DoctorCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card border bg-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
      <Link
        href={`/doctors/${doctor.slug}`}
        aria-label={`View ${doctor.name}'s profile`}
        className={`relative grid aspect-[4/3] place-items-center overflow-hidden bg-gradient-to-br ${gradients[index % gradients.length]}`}
      >
        {photo ? (
          <Image
            src={photo}
            alt={doctor.name}
            fill
            sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="font-display text-6xl font-bold text-white/90 transition-transform duration-500 group-hover:scale-110">
            {getInitials(doctor.name)}
          </span>
        )}
        {doctor.telehealth && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#0b5d6b] backdrop-blur">
            <VideoIcon className="size-3.5" />
            Video visits
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold">{doctor.name}</h3>
        <p className="text-sm text-muted-foreground">
          {doctor.specialty} &middot; {doctor.credentials}
        </p>

        <p className="mt-3 flex items-center gap-1.5 text-sm">
          <StarIcon className="size-4 text-warm" />
          <strong>{doctor.rating.toFixed(1)}</strong>
          <span className="text-muted-foreground">({doctor.reviews} reviews)</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {doctor.experienceYears} years experience &middot; {doctor.languages.join(", ")}
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
          variant="soft"
          className="mt-5 w-full"
          arrow
        >
          Book now
        </ButtonLink>
      </div>
    </article>
  );
}
