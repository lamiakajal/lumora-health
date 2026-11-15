import { AboutVisual } from "@/components/home/about-visual";
import { ButtonLink } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons-medical";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { about } from "@/lib/home-sections";

export function AboutSection() {
  return (
    <section
      aria-labelledby="about-title"
      className="mx-auto grid max-w-7xl items-center gap-16 px-5 py-24 lg:grid-cols-2"
    >
      <Reveal>
        <AboutVisual />
      </Reveal>

      <Reveal delay={0.15}>
        <SectionHeading
          id="about-title"
          eyebrow={about.eyebrow}
          title={about.title}
          align="left"
          className="max-w-none"
        />
        <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {about.highlights.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[15px] font-semibold">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                <CheckIcon className="size-3.5" strokeWidth={3} />
              </span>
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href={about.primaryCta.href} size="lg" arrow>
            {about.primaryCta.label}
          </ButtonLink>
          <ButtonLink href={about.secondaryCta.href} size="lg" variant="outline">
            {about.secondaryCta.label}
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}
