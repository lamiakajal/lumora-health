"use client";

import type { ReactNode } from "react";
import { useTheme } from "next-themes";
import { Toaster as SonnerToaster } from "sonner";
import { cn } from "@/lib/cn";

type Tone = "success" | "error" | "warning" | "info";

const toneStyles: Record<Tone, string> = {
  success: "bg-primary/15 text-primary",
  error: "bg-red-500/15 text-red-600 dark:text-red-400",
  warning: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  info: "bg-accent/20 text-sky-600 dark:text-sky-300",
};

function ToastIcon({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span className={cn("grid size-9 shrink-0 place-items-center rounded-full", toneStyles[tone])}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="size-[18px]"
      >
        {children}
      </svg>
    </span>
  );
}

const icons = {
  success: (
    <ToastIcon tone="success">
      <path d="M20 6 9 17l-5-5" />
    </ToastIcon>
  ),
  error: (
    <ToastIcon tone="error">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16h.01" />
    </ToastIcon>
  ),
  warning: (
    <ToastIcon tone="warning">
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </ToastIcon>
  ),
  info: (
    <ToastIcon tone="info">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-4M12 8h.01" />
    </ToastIcon>
  ),
  loading: (
    <ToastIcon tone="info">
      <path d="M21 12a9 9 0 1 1-6.2-8.55" className="origin-center animate-spin" />
    </ToastIcon>
  ),
  close: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      className="size-4"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
};

const accent = "before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:content-['']";

export function Toaster() {
  const { resolvedTheme } = useTheme();

  return (
    <SonnerToaster
      position="top-right"
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      closeButton
      duration={5000}
      gap={12}
      visibleToasts={4}
      offset={{ top: 96, right: 24, bottom: 24, left: 24 }}
      mobileOffset={{ top: 84, right: 16, bottom: 16, left: 16 }}
      icons={icons}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: cn(
            "group relative flex w-[min(24rem,calc(100vw-2rem))] items-start gap-3 overflow-hidden rounded-2xl border bg-card/95 p-4 pl-5 pr-11 font-sans text-foreground shadow-lift backdrop-blur-xl",
            accent,
          ),
          success: "border-primary/30 before:bg-gradient-to-b before:from-primary before:to-accent",
          error: "border-red-500/30 before:bg-gradient-to-b before:from-red-500 before:to-rose-400",
          warning: "border-amber-500/30 before:bg-gradient-to-b before:from-amber-400 before:to-orange-400",
          info: "border-accent/40 before:bg-gradient-to-b before:from-accent before:to-primary",
          icon: "mt-0.5",
          content: "flex-1",
          title: "text-[15px] font-bold leading-snug",
          description: "mt-0.5 text-sm leading-snug text-muted-foreground",
          closeButton:
            "absolute right-3 top-3 grid size-7 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground",
          actionButton:
            "mt-3 inline-flex rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground",
          cancelButton:
            "mt-3 inline-flex rounded-full border px-4 py-1.5 text-xs font-bold text-foreground",
        },
      }}
    />
  );
}
