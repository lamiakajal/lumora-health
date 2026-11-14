"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

type CountUpProps = {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
};

function formatValue(
  value: number,
  { prefix, suffix, decimals }: { prefix: string; suffix: string; decimals: number },
) {
  const number = value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${prefix}${number}${suffix}`;
}

/** Counts up from 0 every time it scrolls into view (scroll away and back to replay). */
export function CountUp({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.8,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { margin: "-40px" });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const options = { prefix, suffix, decimals };

    if (reduceMotion) {
      node.textContent = formatValue(to, options);
      return;
    }

    // Out of view: reset to 0 so the count starts fresh when it returns.
    if (!inView) {
      node.textContent = formatValue(0, options);
      return;
    }

    const controls = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate: (value) => {
        node.textContent = formatValue(value, options);
      },
    });
    return () => controls.stop();
  }, [inView, reduceMotion, to, duration, prefix, suffix, decimals]);

  const options = { prefix, suffix, decimals };

  return (
    <span className={className}>
      <span className="sr-only">{formatValue(to, options)}</span>
      <span ref={ref} aria-hidden="true">
        {formatValue(0, options)}
      </span>
    </span>
  );
}
