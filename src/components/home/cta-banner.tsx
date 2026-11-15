import Image from "next/image";
import { PulseBackdrop } from "@/components/home/pulse-backdrop";
import { buttonStyles } from "@/components/ui/button";
import { ArrowRightIcon, PhoneIcon } from "@/components/ui/icons";
import { CheckIcon } from "@/components/ui/icons-medical";
import { Reveal } from "@/components/ui/reveal";
import { toTelHref } from "@/lib/format";
import { findPublicImage } from "@/lib/public-images";
import Link from "next/link";
import { siteConfig } from "../../../site.config";

const perks = ["Same-week appointments", "In person or by video", "Clear prices up front"];

export function CtaBanner() {
  // Uses cta-welcome if you add it, otherwise the team photo that is already in the project.
  const photo = findPublicImage("/images/cta-welcome") ?? findPublicImage("/images/team-corridor");

  return (
    <section aria-labelledby="cta-title" className="mx-auto mt-24 max-w-7xl px-5">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0d9488] via-[#0b7a82] to-[#0b4f6c] text-white shadow-lift">
          {photo && (
            <Image
              src={photo}
              alt=""
              fill
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="-z-20 object-cover opacity-20 mix-blend-luminosity"
            />
          )}
          <PulseBackdrop />

          <div className="relative grid gap-10 px-8 py-14 sm:px-14 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:py-20">
            <div>
              <h2
                id="cta-title"
                className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl"
              >
                Ready to feel better? Book your visit in two minutes.
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
                Choose your doctor, pick a time and you are done. We will confirm by email and
                remind you before your visit.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/book"
                  className={buttonStyles({
                    size: "lg",
                    className:
                      "group bg-white text-[#0b4f6c] hover:bg-white/90 hover:brightness-100",
                  })}
                >
                  Book appointment
                  <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <a
                  href={toTelHref(siteConfig.contact.emergencyPhone)}
                  className={buttonStyles({
                    variant: "outline",
                    size: "lg",
                    className:
                      "border-white/40 bg-white/10 text-white hover:border-white hover:bg-white/20 hover:text-white",
                  })}
                >
                  <PhoneIcon className="size-4" />
                  {siteConfig.contact.emergencyPhone}
                </a>
              </div>
            </div>

            <ul className="grid gap-3">
              {perks.map((perk) => (
                <li
                  key={perk}
                  className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 font-semibold backdrop-blur"
                >
                  <span className="grid size-8 place-items-center rounded-full bg-white text-[#0b4f6c]">
                    <CheckIcon className="size-4" strokeWidth={3} />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
