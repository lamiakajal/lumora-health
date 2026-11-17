"use client";

import { useEffect, useState } from "react";
import type { AvailabilityResponse } from "@/lib/booking/types";

type State = { doctor: string; version: number; data?: AvailabilityResponse; error?: string };

/**
 * Loads a doctor's open slots. Change `version` to force a refresh
 * (for example after someone else took the slot you wanted).
 */
export function useAvailability(doctorSlug: string | null, version: number) {
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    if (!doctorSlug) return;
    const controller = new AbortController();

    fetch(`/api/availability?doctor=${encodeURIComponent(doctorSlug)}&days=14`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error ?? "We could not load the calendar.");
        return body as AvailabilityResponse;
      })
      .then((data) => setState({ doctor: doctorSlug, version, data }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          doctor: doctorSlug,
          version,
          error: error instanceof Error ? error.message : "We could not load the calendar.",
        });
      });

    return () => controller.abort();
  }, [doctorSlug, version]);

  // The result only counts if it belongs to the doctor and version being shown now.
  const current = state && state.doctor === doctorSlug && state.version === version ? state : null;
  return { loading: Boolean(doctorSlug) && !current, data: current?.data, error: current?.error };
}
