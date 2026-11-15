import { ShieldCheckIcon } from "@/components/ui/icons-medical";
import { insuranceOptions } from "@/lib/home-content";

const plans = insuranceOptions.filter((plan) => !plan.toLowerCase().includes("self-pay"));

export function InsuranceStrip() {
  // Rendered twice so the -50% marquee loops without a gap.
  const items = [...plans, ...plans];

  return (
    <section aria-labelledby="insurance-title" className="mx-auto mt-24 max-w-7xl px-5">
      <h2
        id="insurance-title"
        className="text-center font-display text-lg font-bold text-muted-foreground"
      >
        Most major insurance plans accepted in the US and Canada
      </h2>
      <div
        aria-hidden="true"
        className="group relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      >
        <div className="flex w-max animate-marquee gap-4 group-hover:[animation-play-state:paused]">
          {items.map((plan, index) => (
            <span
              key={`${plan}-${index}`}
              className="inline-flex items-center gap-2 rounded-full border bg-card px-5 py-3 text-sm font-semibold shadow-soft"
            >
              <ShieldCheckIcon className="size-4 text-primary" />
              {plan}
            </span>
          ))}
        </div>
      </div>
      <p className="sr-only">Accepted plans include {plans.join(", ")}.</p>
    </section>
  );
}
