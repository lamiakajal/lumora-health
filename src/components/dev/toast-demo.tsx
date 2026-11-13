"use client";

import { toast } from "sonner";

/** Temporary component used to preview toasts. Removed once real forms exist. */
export function ToastDemo() {
  const base =
    "rounded-full px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 active:translate-y-0";

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        className={`${base} bg-primary text-primary-foreground shadow-soft`}
        onClick={() =>
          toast.success("Appointment request received", {
            description: "We will confirm your visit by email within 15 minutes.",
          })
        }
      >
        Show success toast
      </button>
      <button
        type="button"
        className={`${base} border bg-card text-foreground`}
        onClick={() =>
          toast.error("That time slot was just taken", {
            description: "Please choose another available time.",
          })
        }
      >
        Show error toast
      </button>
    </div>
  );
}
