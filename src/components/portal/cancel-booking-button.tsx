"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

/** Two clicks to cancel, so nobody cancels by accident. */
export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [asking, setAsking] = useState(false);
  const [pending, setPending] = useState(false);

  async function cancel() {
    setPending(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        toast.error("We could not cancel that appointment", { description: body.error ?? "Please try again." });
        return;
      }
      toast.success("Appointment cancelled");
      router.refresh();
    } catch {
      toast.error("We could not reach the server", { description: "Check your connection and try again." });
    } finally {
      setPending(false);
      setAsking(false);
    }
  }

  if (!asking) {
    return (
      <button
        type="button"
        onClick={() => setAsking(true)}
        className="text-sm font-bold text-red-600 hover:underline dark:text-red-400"
      >
        Cancel
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-3 text-sm">
      <span className="text-muted-foreground">Cancel this visit?</span>
      <button
        type="button"
        onClick={cancel}
        disabled={pending}
        className="font-bold text-red-600 hover:underline disabled:opacity-60 dark:text-red-400"
      >
        {pending ? "Cancelling..." : "Yes, cancel"}
      </button>
      <button type="button" onClick={() => setAsking(false)} className="font-bold hover:underline">
        Keep it
      </button>
    </span>
  );
}
