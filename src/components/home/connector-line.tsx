"use client";

import { motion } from "motion/react";

/** A gradient line that draws itself between the steps when scrolled into view. */
export function ConnectorLine() {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="absolute left-[16.7%] right-[16.7%] top-10 hidden h-0.5 origin-left rounded-full bg-gradient-to-r from-primary/60 via-accent/60 to-primary/60 md:block"
    />
  );
}
