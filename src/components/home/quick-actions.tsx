import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { CalendarIcon, HeadsetIcon, StethoscopeIcon } from "@/components/ui/icons-medical";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";
import { quickActions } from "@/lib/home-sections";

const icons = {
  doctor: StethoscopeIcon,
  nurse: HeadsetIcon,
  book: CalendarIcon,
} as const;

export function QuickActions() {
  return (
    <section aria-label="Quick actions" className="mx-auto mt-10 max-w-7xl px-5">
      <div className="grid gap-5 md:grid-cols-3">
        {quickActions.map((action, index) => {
          const Icon = icons[action.id];
          const featured = action.id === "nurse";
          const linkClass =
            "mt-6 inline-flex items-center gap-2 text-sm font-bold after:absolute after:inset-0 after:content-['']";
          const linkContent = (
            <>
              {action.cta}
              <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-1.5" />
            </>
          );

          return (
            <Reveal key={action.id} delay={index * 0.1}>
              <article
                className={cn(
                  "group relative h-full overflow-hidden rounded-card border p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift",
                  featured
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "bg-card",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute -right-12 -top-12 size-44 rounded-full transition-transform duration-500 group-hover:scale-150",
                    featured ? "bg-white/10" : "bg-primary/[0.06]",
                  )}
                />
                <span
                  className={cn(
                    "relative grid size-14 place-items-center rounded-2xl",
                    featured ? "bg-white/20" : "bg-soft text-primary",
                  )}
                >
                  <Icon className="size-7" />
                </span>
                <h3 className="relative mt-6 font-display text-xl font-bold">{action.title}</h3>
                <p
                  className={cn(
                    "relative mt-2 leading-relaxed",
                    featured ? "text-primary-foreground/85" : "text-muted-foreground",
                  )}
                >
                  {action.text}
                </p>
                {action.href.startsWith("tel:") ? (
                  <a href={action.href} className={cn(linkClass, "relative")}>
                    {linkContent}
                  </a>
                ) : (
                  <Link href={action.href} className={cn(linkClass, "relative text-primary-deep")}>
                    {linkContent}
                  </Link>
                )}
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
