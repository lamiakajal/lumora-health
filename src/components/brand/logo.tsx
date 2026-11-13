import { cn } from "@/lib/cn";
import { siteConfig } from "../../../site.config";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={cn("size-9 text-primary", className)}
    >
      <rect width="40" height="40" rx="12" fill="currentColor" />
      <path d="M17 9h6v8h8v6h-8v8h-6v-8H9v-6h8V9Z" fill="#fff" />
      <circle cx="31" cy="9" r="3" fill="#fde68a" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="font-display text-xl font-bold tracking-tight">
        {siteConfig.name}
      </span>
    </span>
  );
}
