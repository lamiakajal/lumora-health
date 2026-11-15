import { SatisfactionRing } from "@/components/home/satisfaction-ring";
import { ClockIcon } from "@/components/ui/icons";
import { ShieldCheckIcon } from "@/components/ui/icons-medical";
import { TagIcon, UsersIcon } from "@/components/ui/icons-services";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { whyUs } from "@/data/home-copy";

const featureIcons = {
  shield: ShieldCheckIcon,
  clock: ClockIcon,
  tag: TagIcon,
  users: UsersIcon,
} as const;

export function WhyChooseUs() {
  return (
    <section
      aria-labelledby="why-title"
      className="mx-auto mt-24 grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[0.8fr_1.2fr]"
    >
      <Reveal>
        <SatisfactionRing value={whyUs.ringValue} label={whyUs.ringLabel} />
      </Reveal>

      <div>
        <Reveal>
          <SectionHeading
            id="why-title"
            eyebrow={whyUs.eyebrow}
            title={whyUs.title}
            description={whyUs.description}
            align="left"
            className="max-w-none"
          />
        </Reveal>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          {whyUs.features.map((feature, index) => {
            const Icon = featureIcons[feature.icon];
            return (
              <li key={feature.title}>
                <Reveal delay={index * 0.1} className="flex gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-soft text-primary">
                    <Icon className="size-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold">{feature.title}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">
                      {feature.text}
                    </p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
