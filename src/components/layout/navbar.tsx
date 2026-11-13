"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { Logo } from "@/components/brand/logo";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { NavDropdown } from "@/components/layout/nav-dropdown";
import { ButtonLink } from "@/components/ui/button";
import { MenuIcon } from "@/components/ui/icons";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/cn";
import { isItemActive, primaryNav } from "@/lib/navigation";
import { siteConfig } from "../../../site.config";

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 8));

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b bg-background/85 shadow-soft backdrop-blur-xl"
            : "border-b border-transparent bg-background",
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-5">
          <Link href="/" aria-label={`${siteConfig.name} home`} className="shrink-0">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {primaryNav.map((item) => (
                <li key={item.label}>
                  {item.children ? (
                    <NavDropdown item={item} pathname={pathname} />
                  ) : (
                    <Link
                      href={item.href ?? "/"}
                      className={cn(
                        "relative inline-flex rounded-full px-3.5 py-2 text-[15px] font-semibold transition-colors hover:text-primary",
                        isItemActive(pathname, item) ? "text-primary" : "text-foreground/80",
                      )}
                    >
                      {item.label}
                      {isItemActive(pathname, item) && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-primary"
                        />
                      )}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <ButtonLink href="/login" variant="ghost" className="hidden xl:inline-flex">
              Sign in
            </ButtonLink>
            <ButtonLink href="/book" arrow className="hidden sm:inline-flex">
              Book appointment
            </ButtonLink>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className="grid size-10 place-items-center rounded-full border bg-card transition hover:border-primary hover:text-primary xl:hidden"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Rendered outside <header>: backdrop-filter would otherwise trap fixed children. */}
      <MobileMenu open={mobileOpen} onClose={closeMobile} pathname={pathname} />
    </>
  );
}
