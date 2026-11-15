"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { DoctorCard } from "@/components/home/doctor-card";
import { categories } from "@/data/categories";
import { doctors } from "@/data/doctors";
import { cn } from "@/lib/cn";
import {
  ALL_CATEGORIES,
  allLanguages,
  defaultDoctorFilters,
  searchDoctors,
  type DoctorSort,
} from "@/lib/doctors";

const sortOptions: { value: DoctorSort; label: string }[] = [
  { value: "soonest", label: "Soonest available" },
  { value: "rating", label: "Highest rated" },
  { value: "experience", label: "Most experienced" },
  { value: "name", label: "Name (A to Z)" },
];

const languages = allLanguages(doctors);
const control =
  "h-11 w-full rounded-xl border bg-background px-4 text-[15px] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15";

function parseSort(value: string | null): DoctorSort {
  return sortOptions.some((option) => option.value === value)
    ? (value as DoctorSort)
    : defaultDoctorFilters.sort;
}

type DoctorsExplorerProps = {
  /** Portrait paths keyed by doctor slug, found on the server. */
  photos: Record<string, string | null>;
};

export function DoctorsExplorer({ photos }: DoctorsExplorerProps) {
  const params = useSearchParams();

  const [q, setQ] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? ALL_CATEGORIES);
  const [specialty, setSpecialty] = useState(params.get("specialty") ?? "");
  const [language, setLanguage] = useState(params.get("language") ?? "");
  const [video, setVideo] = useState(params.get("video") === "1");
  const [sort, setSort] = useState<DoctorSort>(parseSort(params.get("sort")));
  // Filters from the home page search bar. We confirm these when the visit is booked.
  const [location, setLocation] = useState(params.get("location") ?? "");
  const [insurance, setInsurance] = useState(params.get("insurance") ?? "");

  const results = useMemo(
    () => searchDoctors(doctors, { q, category, specialty, language, video, sort }),
    [q, category, specialty, language, video, sort],
  );

  // Keep the address bar in step with the filters so a search can be shared.
  useEffect(() => {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (category !== ALL_CATEGORIES) next.set("category", category);
    if (specialty) next.set("specialty", specialty);
    if (language) next.set("language", language);
    if (video) next.set("video", "1");
    if (sort !== defaultDoctorFilters.sort) next.set("sort", sort);
    if (location) next.set("location", location);
    if (insurance) next.set("insurance", insurance);
    const query = next.toString();
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  }, [q, category, specialty, language, video, sort, location, insurance]);

  const chips = [
    specialty && { label: specialty, clear: () => setSpecialty("") },
    location && { label: `Near ${location}`, clear: () => setLocation("") },
    insurance && { label: insurance, clear: () => setInsurance("") },
  ].filter((chip): chip is { label: string; clear: () => void } => Boolean(chip));

  const hasFilters =
    Boolean(q || specialty || language || location || insurance || video) ||
    category !== ALL_CATEGORIES;

  function reset() {
    setQ("");
    setCategory(ALL_CATEGORIES);
    setSpecialty("");
    setLanguage("");
    setVideo(false);
    setSort(defaultDoctorFilters.sort);
    setLocation("");
    setInsurance("");
  }

  return (
    <section aria-label="Find a doctor" className="mx-auto max-w-7xl px-5 py-14">
      <div className="rounded-card border bg-card p-5 shadow-soft">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-end">
          <div>
            <label htmlFor="doctor-search" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Search by name or specialty
            </label>
            <input
              id="doctor-search"
              type="search"
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Try Okafor, pediatrics, French..."
              className={control}
            />
          </div>

          <div>
            <label htmlFor="doctor-language" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Language
            </label>
            <select
              id="doctor-language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className={control}
            >
              <option value="">Any language</option>
              {languages.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="doctor-sort" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Sort by
            </label>
            <select
              id="doctor-sort"
              value={sort}
              onChange={(event) => setSort(parseSort(event.target.value))}
              className={control}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <label className="flex h-11 cursor-pointer items-center gap-3 rounded-xl border bg-background px-4 text-[15px] font-semibold">
            <input
              type="checkbox"
              checked={video}
              onChange={(event) => setVideo(event.target.checked)}
              className="size-4 accent-[var(--primary)]"
            />
            Video visits
          </label>
        </div>

        <div
          role="group"
          aria-label="Filter by department"
          className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]"
        >
          {[{ id: ALL_CATEGORIES, tab: "All" }, ...categories].map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={category === item.id}
              onClick={() => setCategory(item.id)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                category === item.id
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "bg-background hover:border-primary hover:text-primary",
              )}
            >
              {item.tab}
            </button>
          ))}
        </div>

        {chips.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {chips.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={chip.clear}
                aria-label={`Remove filter ${chip.label}`}
                className="inline-flex items-center gap-2 rounded-full bg-soft px-3 py-1.5 text-sm font-semibold text-primary-deep transition hover:bg-primary hover:text-primary-foreground"
              >
                {chip.label}
                <span aria-hidden="true">&times;</span>
              </button>
            ))}
            <span className="text-sm text-muted-foreground">
              We confirm coverage and location when you book.
            </span>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {results.length} {results.length === 1 ? "doctor" : "doctors"} found
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={reset}
            className="text-sm font-bold text-primary-deep underline-offset-4 hover:underline"
          >
            Reset all filters
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="mt-6 rounded-card border bg-card p-10 text-center">
          <p className="font-display text-xl font-bold">No doctors match those filters</p>
          <p className="mt-2 text-muted-foreground">
            Try removing a filter, or call our nurse line and we will find you the right doctor.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-5 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <motion.ul layout className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {results.map((doctor, index) => (
              <motion.li
                key={doctor.slug}
                layout
                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.28 }}
              >
                <DoctorCard doctor={doctor} photo={photos[doctor.slug] ?? null} index={index} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </section>
  );
}
