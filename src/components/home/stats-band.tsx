import { CountUp } from "@/components/ui/count-up";
import { Reveal } from "@/components/ui/reveal";
import { stats } from "@/lib/home-content";

export function StatsBand() {
  return (
    <section aria-label="Lumora Health at a glance" className="mx-auto mt-16 max-w-7xl px-5">
      <Reveal>
        <dl className="grid grid-cols-2 gap-y-10 rounded-card border bg-card p-8 shadow-soft lg:grid-cols-4 lg:divide-x">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col px-4 text-center">
              <dt className="order-2 mt-2 text-sm font-medium text-muted-foreground">
                {stat.label}
              </dt>
              <dd className="order-1 font-display text-4xl font-bold text-primary-deep sm:text-5xl">
                <CountUp
                  to={stat.value}
                  suffix={stat.suffix}
                  decimals={"decimals" in stat ? stat.decimals : 0}
                />
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
