"use client";

import { useTheme } from "next-themes";
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  const { resolvedTheme } = useTheme();

  return (
    <SonnerToaster
      position="top-right"
      closeButton
      richColors
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      toastOptions={{ classNames: { toast: "font-sans" } }}
    />
  );
}
