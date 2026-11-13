"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { ChevronDownIcon, CloseIcon, PhoneIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { toTelHref } from "@/lib/format";
import { isItemActive, primaryNav } from "@/lib/navigation";
import { siteConfig } from "../../../site.config";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  pathname: string;
};

export function MobileMenu({ open, onClose, pathname }: MobileMenuProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm"
          />
          <motion.aside
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed inset-y-0 right-0 z-[65] flex w-[min(100%,24rem)] flex-col bg-background shadow-lift"
          >
            <div className="flex h-[72px] shrink-0 items-center justify-between border-b px-5">
              <Link href="/" onClick={onClose} aria-label={`${siteConfig.name} home`}>
                <Logo />
              </Link>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="grid size-10 place-items-center rounded-full border bg-card transition hover:border-primary hover:text-primary"
              >
                <CloseIcon />
              </button>
            </div>

            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-4">
              <ul className="space-y-1">
                {primaryNav.map((item) => {
                  const active = isItemActive(pathname, item);
                  const isOpen = expanded === item.label;

                  if (!item.children) {
                    return (
                      <li key={item.label}>
                        <Link
                          href={item.href ?? "/"}
                          onClick={onClose}
                          className={cn(
                            "block rounded-xl px-4 py-3 text-base font-semibold transition-colors hover:bg-soft",
                            active && "bg-soft text-primary",
                          )}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  }

                  return (
                    <li key={item.label}>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setExpanded(isOpen ? null : item.label)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl px-4 py-3 text-base font-semibold transition-colors hover:bg-soft",
                          active && "text-primary",
                        )}
                      >
                        {item.label}
                        <ChevronDownIcon
                          className={cn(
                            "size-5 transition-transform duration-200",
                            isOpen && "rotate-180",
                          )}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22 }}
                            className="overflow-hidden"
                          >
                            {item.children.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  onClick={onClose}
                                  className="block rounded-lg py-2.5 pl-8 pr-4 text-[15px] text-muted-foreground transition-colors hover:text-primary"
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="shrink-0 space-y-3 border-t p-5">
              <ButtonLink href="/book" size="lg" arrow className="w-full" onClick={onClose}>
                Book appointment
              </ButtonLink>
              <div className="grid grid-cols-2 gap-3">
                <ButtonLink href="/login" variant="outline" onClick={onClose}>
                  Sign in
                </ButtonLink>
                <a
                  href={toTelHref(siteConfig.contact.phone)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border bg-card text-sm font-semibold transition hover:border-primary hover:text-primary"
                >
                  <PhoneIcon className="size-4" />
                  Call us
                </a>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
