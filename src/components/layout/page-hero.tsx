import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRightIcon } from "@/components/ui/icons-services";
import { Reveal } from "@/components/ui/reveal";

export type Crumb = { label: string; href?: string };

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs: Crumb[];
  /** Buttons or extra content under the description. */
  children?: ReactNode;
};

/** Top banner for inner pages: breadcrumbs, title and optional actions. */
export function PageHero({ eyebrow, title, description, crumbs, children }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b bg-soft/60">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 -z-10 size-96 animate-float rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/4 -z-10 size-80 animate-float rounded-full bg-accent/15 blur-3xl [animation-delay:-3s]"
      />

      <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            {crumbs.map((crumb, index) => (
              <li key={crumb.label} className="flex items-center gap-1.5">
                {crumb.href ? (
                  <Link href={crumb.href} className="transition-colors hover:text-primary">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="font-semibold text-foreground">
                    {crumb.label}
                  </span>
                )}
                {index < crumbs.length - 1 && <ChevronRightIcon className="size-3.5" />}
              </li>
            ))}
          </ol>
        </nav>

        <Reveal className="mt-6 max-w-3xl">
          {eyebrow && (
            <p className="mb-3 inline-flex rounded-full bg-card px-4 py-1.5 text-sm font-semibold text-primary-deep shadow-soft">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{description}</p>
          )}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </Reveal>
      </div>
    </section>
  );
}
