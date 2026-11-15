"use client";

import { motion } from "motion/react";
import { CountUp } from "@/components/ui/count-up";

/** A progress ring that fills while the percentage counts up. */
export function SatisfactionRing({ value, label }: { value: number; label: string }) {
  return (
    <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-[#0d9488] to-[#0b5d6b] p-10 text-white">
      <div
        aria-hidden="true"
        className="absolute -right-16 -top-16 size-56 animate-float rounded-full bg-white/10"
      />
      <div className="relative flex flex-col items-center text-center">
        <div className="relative size-48">
          <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
            <circle cx="60" cy="60" r="52" fill="none" stroke="white" strokeOpacity="0.2" strokeWidth="9" />
            <motion.circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="white"
              strokeWidth="9"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: value / 100 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1.8, ease: "easeOut" }}
            />
          </svg>
          <p className="absolute inset-0 grid place-items-center font-display text-5xl font-bold">
            <CountUp to={value} suffix="%" />
          </p>
        </div>
        <p className="mt-6 max-w-xs text-lg font-semibold leading-snug">{label}</p>
      </div>
    </div>
  );
}
