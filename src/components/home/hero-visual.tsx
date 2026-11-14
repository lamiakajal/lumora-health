"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ClockIcon } from "@/components/ui/icons";
import { useSiteReady } from "@/hooks/use-site-ready";
import { heroImageAlt } from "@/lib/home-content";

function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2Z" />
    </svg>
  );
}

function Illustration() {
  return (
    <svg viewBox="0 0 400 500" className="absolute inset-0 size-full" aria-hidden="true">
      <circle cx="200" cy="250" r="165" className="fill-white/50 dark:fill-white/5" />
      <circle cx="200" cy="250" r="115" className="fill-white/70 dark:fill-white/10" />
      <rect x="148" y="198" width="104" height="104" rx="30" className="fill-primary" />
      <path d="M188 216h24v22h22v24h-22v22h-24v-22h-22v-24h22v-22Z" fill="#fff" />
      <circle cx="262" cy="196" r="9" fill="#fde68a" />
      <motion.path
        d="M20 410 H110 L135 370 L165 450 L195 340 L225 420 L245 410 H380"
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-primary"
        animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

const cardStyles =
  "absolute flex items-center gap-3 rounded-2xl border bg-card/95 p-3.5 shadow-lift backdrop-blur animate-float";

export function HeroVisual({ photo }: { photo?: string | null }) {
  const ready = useSiteReady();

  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md lg:max-w-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={ready ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 overflow-hidden rounded-b-[2.5rem] rounded-t-[999px] border bg-gradient-to-b from-soft to-primary/20"
      >
        {photo ? (
          <Image
            src={photo}
            alt={heroImageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 560px, 90vw"
            className="object-cover"
          />
        ) : (
          <Illustration />
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={ready ? { opacity: 1, x: 0 } : undefined}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="absolute -left-3 top-20 sm:-left-8"
      >
        <div className={cardStyles}>
          <span className="grid size-10 place-items-center rounded-full bg-soft text-primary">
            <ClockIcon className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-xs text-muted-foreground">Next available</p>
            <p className="text-sm font-bold">Today, 3:40 PM</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={ready ? { opacity: 1, x: 0 } : undefined}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="absolute -right-3 bottom-28 sm:-right-8"
      >
        <div className={cardStyles} style={{ animationDelay: "-2s" }}>
          <div className="leading-tight">
            <p className="text-xs text-muted-foreground">Patient rating</p>
            <p className="flex items-center gap-1 text-sm font-bold">
              <StarIcon className="size-4 text-warm" /> 4.9 / 5
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={ready ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="absolute bottom-6 left-4"
      >
        <div className={cardStyles} style={{ animationDelay: "-4s" }}>
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
          </span>
          <p className="text-sm font-bold">Video visits available</p>
        </div>
      </motion.div>
    </div>
  );
}
