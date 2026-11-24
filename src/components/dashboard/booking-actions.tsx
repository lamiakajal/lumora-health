"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { BookingStatus, StatusAction } from "@/lib/booking/status";

const labels: Record<StatusAction, { button: string; done: string; busy: string }> = {
  confirm: { button: "Confirm", done: "Appointment confirmed", busy: "Confirming..." },
  complete: { button: "Mark completed", done: "Marked as completed", busy: "Saving..." },
  cancel: { button: "Cancel visit", done: "Appointment cancelled", busy: "Cancelling..." },
};

const actionsFor: Record<BookingStatus, StatusAction[]> = {
  pending: ["confirm", "cancel"],
  confirmed: ["complete", "cancel"],
  completed: [],
  cancelled: [],
};

/** The buttons a doctor can press for one booking. Each change is checked again on the server. */
export function BookingActions({ bookingId, status }: { bookingId: string; status: BookingStatus }) {
  const router = useRouter();
  const [busy, setBusy] = useState<StatusAction | null>(null);

  async function run(action: StatusAction) {
    if (action === "cancel" && !window.confirm("Cancel this visit? The patient will be told by email.")) return;
    setBusy(action);
    try {
      const response = await fetch(`/api/provider/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        toast.error("That did not work", { description: body.error ?? "Please try again." });
        return;
      }
      toast.success(labels[action].done);
      router.refresh();
    } catch {
      toast.error("We could not reach the server", { description: "Check your connection and try again." });
    } finally {
      setBusy(null);
    }
  }

  const available = actionsFor[status];
  if (available.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {available.map((action) => (
        <button
          key={action}
          type="button"
          disabled={busy !== null}
          onClick={() => run(action)}
          className={
            action === "cancel"
              ? "rounded-full border px-4 py-1.5 text-sm font-semibold text-red-600 transition hover:border-red-500 disabled:opacity-60 dark:text-red-400"
              : "rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-60"
          }
        >
          {busy === action ? labels[action].busy : labels[action].button}
        </button>
      ))}
    </div>
  );
}
