"use client";

import { useId } from "react";
import { motion, type MotionProps } from "motion/react";
import { cn } from "@/lib/cn";
import { siteConfig } from "../../../site.config";

type LogoMarkProps = {
  className?: string;
  /** Loops the heartbeat line forever (used by the page loader). */
  loop?: boolean;
};

/**
 * Brand mark: a teal-to-ocean gradient tile, a medical cross with a heartbeat
 * line running through it, and a small warm "light" spark (Lumora = light).
 * Inside <Logo /> it reacts to hover; with `loop` it animates on its own.
 */
export function LogoMark({ className, loop = false }: LogoMarkProps) {
  const uid = useId().replace(/:/g, "");
  const gradientId = `lumora-gradient-${uid}`;
  const clipId = `lumora-clip-${uid}`;

  const pulse: MotionProps = loop
    ? {
        animate: { pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] },
        transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
      }
    : {
        variants: {
          rest: { pathLength: 1, opacity: 1 },
          hover: {
            pathLength: [0, 1],
            opacity: 1,
            transition: { duration: 0.8, ease: "easeInOut" },
          },
        },
      };

  const spark: MotionProps = loop
    ? {
        animate: { scale: [1, 1.35, 1], opacity: [0.85, 1, 0.85] },
        transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
      }
    : {};

  return (
    <motion.svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={cn("size-10 shrink-0", className)}
      variants={{
        rest: { rotate: 0, scale: 1 },
        hover: { rotate: -6, scale: 1.08 },
      }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="4"
          y1="2"
          x2="44"
          y2="46"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2dd4bf" />
          <stop offset="0.55" stopColor="#0d9488" />
          <stop offset="1" stopColor="#0b4f6c" />
        </linearGradient>
        <clipPath id={clipId}>
          <rect width="48" height="48" rx="14" />
        </clipPath>
      </defs>

      <rect width="48" height="48" rx="14" fill={`url(#${gradientId})`} />
      <g clipPath={`url(#${clipId})`}>
        <circle cx="40" cy="6" r="16" fill="#fff" opacity="0.14" />
        <path d="M0 31C14 22 30 39 48 28V48H0Z" fill="#0b4f6c" opacity="0.2" />
      </g>

      <rect x="18" y="8" width="12" height="32" rx="4" fill="#fff" />
      <rect x="8" y="18" width="32" height="12" rx="4" fill="#fff" />

      <motion.path
        d="M10 24H17L20 17L24 31L27 21L29 24H38"
        stroke="#0b5d6b"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...pulse}
      />

      <motion.circle
        cx="38.5"
        cy="9.5"
        r="2.6"
        fill="#fde68a"
        className="origin-center [transform-box:fill-box]"
        {...spark}
      />
    </motion.svg>
  );
}

/** Mark plus wordmark. The heartbeat loops forever; hovering adds a small tilt. */
export function Logo({ className }: { className?: string }) {
  const second = siteConfig.name.replace(siteConfig.shortName, "").trim();

  return (
    <motion.span
      initial="rest"
      animate="rest"
      whileHover="hover"
      className={cn("inline-flex items-center gap-3", className)}
    >
      <LogoMark loop />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.4rem] font-extrabold tracking-tight">
          {siteConfig.shortName}
        </span>
        {second && (
          <span className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.34em] text-primary-deep">
            {second}
          </span>
        )}
      </span>
    </motion.span>
  );
}
