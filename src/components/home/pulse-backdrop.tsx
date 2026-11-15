"use client";

import { motion } from "motion/react";

/** A soft looping heartbeat line and floating circles for the banner background. */
export function PulseBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -right-16 -top-20 size-72 animate-float rounded-full bg-white/10" />
      <div className="absolute -bottom-24 left-1/3 size-64 animate-float rounded-full bg-white/10 [animation-delay:-3s]" />
      <svg
        viewBox="0 0 800 120"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-6 h-24 w-full opacity-30"
        fill="none"
      >
        <motion.path
          d="M0 60H260L290 60L320 14L355 106L390 36L415 60H800"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
