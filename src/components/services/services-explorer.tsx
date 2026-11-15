"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { ServiceIcon } from "@/components/ui/service-icon";
import { categories } from "@/data/categories";
import { services } from "@/data/services";
import { cn } from "@/lib/cn";
import { serviceMatchesQuery } from "@/lib/services";

export function ServicesExplorer() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>("all");

  const groups = useMemo(
    () =>
      categories
        .filter((category) => active === "all" || category.id === active)
        .map((category) => ({
          category,
          items: services.filter(
            (service) => service.category === category.id && serviceMatchesQuery(service, query),
          ),
        }))
        .filter((group) => group.items.length > 0),
    [query, active],
  );

  const total = groups.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <section aria-label="All specialties" className="mx-auto max-w-7xl px-5 py-14">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <label htmlFor="service-search" className="sr-only">
            Search specialties
          </label>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            id="service-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search heart, skin, children, therapy..."
            className="h-12 w-full rounded-full border bg-card pl-12 pr-5 text-[15px] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
          />
        </div>

        <div
          role="group"
          aria-label="Filter by department"
          className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]"
        >
          {[{ id: "all", tab: "All" }, ...categories].map((category) => (
            <button
              key={category.id}
              type="button"
              aria-pressed={active === category.id}
              onClick={() => setActive(category.id)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                active === category.id
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "bg-card hover:border-primary hover:text-primary",
              )}
            >
              {category.tab}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        Showing {total} {total === 1 ? "specialty" : "specialties"}
      </p>

      {groups.length === 0 ? (
        <div className="mt-10 rounded-card border bg-card p-10 text-center">
          <p className="font-display text-xl font-bold">No specialties match that search</p>
          <p className="mt-2 text-muted-foreground">
            Try a shorter word, or call our nurse line and we will point you to the right doctor.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActive("all");
            }}
            className="mt-5 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-14">
          {groups.map(({ category, items }) => (
            <div key={category.id}>
              <h2 className="font-display text-2xl font-bold">{category.label}</h2>
              <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((service, index) => (
                  <li key={service.slug}>
                    <Reveal delay={(index % 4) * 0.06} className="h-full">
                      <Link
                        href={`/services/${service.slug}`}
                        className="group flex h-full flex-col rounded-card border bg-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary hover:shadow-lift"
                      >
                        <span className="grid size-12 place-items-center rounded-2xl bg-soft text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                          <ServiceIcon name={service.icon} className="size-6" />
                        </span>
                        <h3 className="mt-4 font-display text-lg font-bold">{service.title}</h3>
                        <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted-foreground">
                          {service.description}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary-deep">
                          Learn more
                          <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-1.5" />
                        </span>
                      </Link>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
