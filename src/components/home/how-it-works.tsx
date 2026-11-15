import { ConnectorLine } from "@/components/home/connector-line";
import { CalendarIcon, StethoscopeIcon, VideoIcon } from "@/components/ui/icons-medical";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { howItWorks } from "@/lib/home-sections";

const stepIcons = [StethoscopeIcon, CalendarIcon, VideoIcon] as const;

export function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works-title" className="mt-24 bg-soft/60 py-24">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal>
          <SectionHeading
            id="how-it-works-title"
            eyebrow={howItWorks.eyebrow}
            title={howItWorks.title}
            description={howItWorks.description}
          />
        </Reveal>

        <ol className="relative mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          <ConnectorLine />
          {howItWorks.steps.map((step, index) => {
            const Icon = stepIcons[index];
            return (
              <li key={step.title}>
                <Reveal delay={index * 0.15} className="flex flex-col items-center text-center">
                  <span className="relative grid size-20 place-items-center rounded-full border-4 border-soft bg-card text-primary shadow-soft transition-transform duration-300 hover:scale-110">
                    <Icon className="size-8" />
                    <span className="absolute -right-1 -top-1 grid size-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {index + 1}
                    </span>
                  </span>
                  <h3 className="mt-6 font-display text-xl font-bold">{step.title}</h3>
                  <p className="mt-2 max-w-xs leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
