"use client";

import { motion } from "motion/react";
import { LogoMark } from "@/components/brand/logo";

const digit =
  "font-display text-[7.5rem] font-extrabold leading-none tracking-tighter bg-gradient-to-b from-primary to-primary-deep bg-clip-text text-transparent sm:text-[11rem]";

/** "4 [logo] 4" with floating digits and a heartbeat line that ends in a flatline. */
export function NotFoundPulse() {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex items-center justify-center gap-2 sm:gap-6" aria-hidden="true">
        <motion.span
          className={digit}
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
        >
          4
        </motion.span>
        <motion.span
          animate={{ y: [0, -18, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        >
          <LogoMark loop className="size-24 drop-shadow-xl sm:size-36" />
        </motion.span>
        <motion.span
          className={digit}
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        >
          4
        </motion.span>
      </div>

      <svg viewBox="0 0 600 80" className="mt-2 h-16 w-full max-w-lg" fill="none" aria-hidden="true">
        <motion.path
          d="M0 40H150L168 40L186 10L206 70L224 24L238 40H600"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
          initial={{ pathLength: 0, opacity: 1 }}
          animate={{ pathLength: [0, 1, 1], opacity: [1, 1, 0] }}
          transition={{
            duration: 3.2,
            times: [0, 0.7, 1],
            repeat: Infinity,
            repeatDelay: 0.6,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
}
