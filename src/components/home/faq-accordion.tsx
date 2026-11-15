"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Faq } from "@/data/faqs";
import { cn } from "@/lib/cn";

/** One question open at a time. Keyboard and screen-reader friendly. */
export function FaqAccordion({ items }: { items: readonly Faq[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const baseId = useId();

  return (
    <ul className="space-y-3">
      {items.map((item, index) => {
        const open = item.id === openId;
        const buttonId = `${baseId}-button-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <li
            key={item.id}
            className={cn(
              "overflow-hidden rounded-card border bg-card transition-all duration-300",
              open ? "border-primary/40 shadow-soft" : "hover:border-primary/30",
            )}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-display text-[17px] font-bold"
              >
                {item.question}
                <span
                  aria-hidden="true"
                  className={cn(
                    "relative grid size-8 shrink-0 place-items-center rounded-full transition-colors duration-300",
                    open ? "bg-primary text-primary-foreground" : "bg-soft text-primary",
                  )}
                >
                  <span className="absolute h-0.5 w-3.5 rounded-full bg-current" />
                  <span
                    className={cn(
                      "absolute h-3.5 w-0.5 rounded-full bg-current transition-transform duration-300",
                      open && "rotate-90",
                    )}
                  />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 leading-relaxed text-muted-foreground">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
