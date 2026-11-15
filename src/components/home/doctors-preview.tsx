"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DoctorCard } from "@/components/home/doctor-card";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { categories } from "@/data/categories";
import { doctors } from "@/data/doctors";
import { doctorsCopy } from "@/data/home-copy";
import { cn } from "@/lib/cn";
import { ALL_CATEGORIES, categoriesWithDoctors, filterDoctors } from "@/lib/doctors";

const tabs = [
  { id: ALL_CATEGORIES, label: "All" },
  ...categoriesWithDoctors(doctors).map((id) => ({
    id,
    label: categories.find((category) => category.id === id)?.tab ?? id,
  })),
];

type DoctorsPreviewProps = {
  /** Portrait paths keyed by doctor slug, found on the server. */
  photos: Record<string, string | null>;
};

export function DoctorsPreview({ photos }: DoctorsPreviewProps) {
  const [active, setActive] = useState<string>(ALL_CATEGORIES);
  const visible = useMemo(() => filterDoctors(doctors, active), [active]);

  return (
    <section aria-labelledby="doctors-title" className="mx-auto mt-24 max-w-7xl px-5">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <Reveal>
          <SectionHeading
            id="doctors-title"
            eyebrow={doctorsCopy.eyebrow}
            title={doctorsCopy.title}
            description={doctorsCopy.description}
            align="left"
          />
        </Reveal>
        <Reveal delay={0.1}>
          <ButtonLink href="/doctors" variant="outline" arrow>
            View all {doctors.length} doctors
          </ButtonLink>
        </Reveal>
      </div>

      <div
        role="group"
        aria-label="Filter doctors by department"
        className="mt-10 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]"
      >
        {tabs.map((tab) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(tab.id)}
              className={cn(
                "relative shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
                selected
                  ? "border-transparent text-primary-foreground"
                  : "bg-card hover:border-primary hover:text-primary",
              )}
            >
              {selected && (
                <motion.span
                  layoutId="doctor-tab"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <motion.ul layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {visible.map((doctor, index) => (
            <motion.li
              key={doctor.slug}
              layout
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.3 }}
            >
              <DoctorCard doctor={doctor} photo={photos[doctor.slug] ?? null} index={index} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </section>
  );
}
