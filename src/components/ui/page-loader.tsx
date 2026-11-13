"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LogoMark } from "@/components/brand/logo";
import { easedPercent } from "@/lib/progress";
import { siteConfig } from "../../../site.config";

const SESSION_KEY = "lumora:loader-seen";

/**
 * Full-screen loader with the logo and a live percentage.
 * Shown once per browser session so returning navigations stay instant.
 */
export function PageLoader() {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 500 : 1800;
  const [visible, setVisible] = useState(true);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let frame = 0;
    let finishTimer: ReturnType<typeof setTimeout> | undefined;
    let loaded = document.readyState === "complete";
    const onLoad = () => {
      loaded = true;
    };
    window.addEventListener("load", onLoad);

    const alreadySeen = () => {
      try {
        return sessionStorage.getItem(SESSION_KEY) === "1";
      } catch {
        return false;
      }
    };

    const finish = () => {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* storage can be unavailable (private mode) */
      }
      document.body.style.overflow = "";
      setVisible(false);
    };

    const start = performance.now();
    document.body.style.overflow = "hidden";

    const tick = (now: number) => {
      if (alreadySeen()) {
        finish();
        return;
      }
      const raw = easedPercent(now - start, duration);
      // Hold at 95% until the page has actually finished loading.
      const value = loaded ? raw : Math.min(raw, 95);
      setPercent(value);
      if (value >= 100) {
        finishTimer = setTimeout(finish, 280);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      if (finishTimer) clearTimeout(finishTimer);
      window.removeEventListener("load", onLoad);
      document.body.style.overflow = "";
    };
  }, [duration]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="page-loader"
          role="status"
          aria-live="polite"
          aria-label={`Loading ${siteConfig.name}`}
          className="fixed inset-0 z-[100] grid place-items-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03, filter: "blur(6px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="flex w-[min(80vw,22rem)] flex-col items-center gap-6">
            <div className="relative grid place-items-center">
              <span className="absolute size-20 animate-pulse-ring rounded-full bg-primary/30" />
              <LogoMark className="relative size-20 animate-float drop-shadow-lg" />
            </div>

            <p className="font-display text-2xl font-bold tracking-tight">
              {siteConfig.name}
            </p>

            <div className="w-full">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="mt-3 text-center font-display text-sm font-semibold tabular-nums text-muted-foreground">
                {percent}%
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
