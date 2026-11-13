"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";

/**
 * Light mode is ALWAYS the default, even if the visitor's device is set to dark.
 * `enableSystem={false}` ignores the OS preference; visitors can still switch manually.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="lumora-theme"
      disableTransitionOnChange
    >
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
