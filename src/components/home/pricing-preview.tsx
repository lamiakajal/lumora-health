import { ButtonLink } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons-medical";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { pricingPlans } from "@/data/pricing";
import { pricingCopy } from "@/data/home-copy";
import { cn } from "@/lib/cn";

export function PricingPreview() {
  return (
    <section aria-labelledby="pricing-title" className="mt-24 bg-soft/60 py-24">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal>
          <SectionHeading
            id="pricing-title"
            eyebrow={pricingCopy.eyebrow}
            title={pricingCopy.title}
            description={pricingCopy.description}
          />
        </Reveal>

        <ul className="mt-14 grid gap-6 md:grid-cols-3 md:items-stretch">
          {pricingPlans.map((plan, index) => (
            <li key={plan.id}>
              <Reveal delay={index * 0.1} className="h-full">
                <div
                  className={cn(
                    "relative flex h-full flex-col rounded-card border bg-card p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift",
                    plan.popular && "border-primary ring-4 ring-primary/10 md:-my-3 md:py-11",
                  )}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground">
                      Most booked
                    </span>
                  )}
                  <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                  <p className="mt-2 text-[15px] text-muted-foreground">{plan.description}</p>

                  <p className="mt-6 flex items-baseline gap-2">
                    <span className="font-display text-5xl font-bold text-primary-deep">
                      ${plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">{plan.unit}</span>
                  </p>

                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-[15px]">
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-soft text-primary">
                          <CheckIcon className="size-3" strokeWidth={3} />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <ButtonLink
                    href={plan.href}
                    variant={plan.popular ? "primary" : "outline"}
                    size="lg"
                    className="mt-8 w-full"
                    arrow
                  >
                    {plan.cta}
                  </ButtonLink>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted-foreground">
          {pricingCopy.note}
        </p>
      </div>
    </section>
  );
}
