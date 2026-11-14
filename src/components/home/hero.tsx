"use client";

import { motion } from "motion/react";
import { DoctorSearchForm } from "@/components/home/doctor-search-form";
import { HeroVisual } from "@/components/home/hero-visual";
import { ButtonLink } from "@/components/ui/button";
import { useSiteReady } from "@/hooks/use-site-ready";
import { hero } from "@/lib/home-content";

function Stars() {
  return (
    <span className="flex gap-0.5 text-warm" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg key={index} viewBox="0 0 24 24" fill="currentColor" className="size-4">
          <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2Z" />
        </svg>
      ))}
    </span>
  );
}

export function Hero({ photo }: { photo?: string | null }) {
  const ready = useSiteReady();

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="relative isolate overflow-hidden">
      {/* Soft animated background blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-8 -z-10 size-96 animate-float rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-40 -z-10 size-[28rem] animate-float rounded-full bg-accent/15 blur-3xl [animation-delay:-3s]"
      />

      <div className="mx-auto max-w-7xl px-5 pb-8 pt-12 lg:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <motion.p
              {...fadeUp(0)}
              className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm font-semibold shadow-soft"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              {hero.badge}
            </motion.p>

            {/* Visible immediately: this is the main content for search engines and LCP. */}
            <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {hero.headlineStart}{" "}
              <span className="relative inline-block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {hero.headlineHighlight}
                <svg
                  viewBox="0 0 300 12"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-2.5 w-full"
                >
                  <motion.path
                    d="M2 8 C 60 2, 120 12, 180 6 S 270 4, 298 8"
                    fill="none"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="stroke-primary"
                    initial={{ pathLength: 0 }}
                    animate={ready ? { pathLength: 1 } : undefined}
                    transition={{ duration: 0.9, delay: 0.5, ease: "easeInOut" }}
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {hero.description}
            </p>

            <motion.div {...fadeUp(0.25)} className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href={hero.primaryCta.href} size="lg" arrow>
                {hero.primaryCta.label}
              </ButtonLink>
              <ButtonLink href={hero.secondaryCta.href} size="lg" variant="outline">
                {hero.secondaryCta.label}
              </ButtonLink>
            </motion.div>

            <motion.div {...fadeUp(0.4)} className="mt-8 flex items-center gap-3 text-sm">
              <Stars />
              <p className="text-muted-foreground">
                <strong className="text-foreground">{hero.rating.score}/5</strong> from{" "}
                {hero.rating.reviews} verified patient reviews
              </p>
            </motion.div>
          </div>

          <HeroVisual photo={photo} />
        </div>

        <motion.div {...fadeUp(0.55)} className="mt-14">
          <p className="mb-3 font-display text-lg font-bold">Find a doctor near you</p>
          <DoctorSearchForm />
        </motion.div>
      </div>
    </section>
  );
}
