"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRightIcon, ChevronDownIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { isItemActive, type NavItem } from "@/lib/navigation";

export function NavDropdown({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const panelId = useId();
  const active = isItemActive(pathname, item);
  const children = item.children ?? [];
  const wide = children.length > 5;

  const openNow = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "relative inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[15px] font-semibold transition-colors hover:text-primary",
          active ? "text-primary" : "text-foreground/80",
        )}
      >
        {item.label}
        <ChevronDownIcon
          className={cn("size-4 transition-transform duration-200", open && "rotate-180")}
        />
        {active && (
          <motion.span
            layoutId="nav-underline"
            className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-primary"
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className={cn(
              "absolute left-0 top-full z-50 mt-3 rounded-card border bg-card p-2 shadow-lift",
              wide ? "w-[36rem]" : "w-72",
            )}
          >
            <ul className={cn("grid gap-1", wide && "grid-cols-2")}>
              {children.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    onClick={() => setOpen(false)}
                    className="group flex flex-col gap-0.5 rounded-xl p-3 transition-colors hover:bg-soft"
                  >
                    <span className="flex items-center justify-between text-sm font-semibold">
                      {child.label}
                      <ArrowRightIcon className="size-4 -translate-x-1 text-primary opacity-0 transition duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                    </span>
                    {child.description && (
                      <span className="text-[13px] leading-snug text-muted-foreground">
                        {child.description}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
              {item.href && (
                <li className={cn(wide && "col-span-2")}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="mt-1 flex items-center justify-between rounded-xl bg-soft px-4 py-3 text-sm font-semibold text-primary-deep transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    View all {item.label.toLowerCase()}
                    <ArrowRightIcon className="size-4" />
                  </Link>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
