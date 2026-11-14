import { useSyncExternalStore } from "react";

export const SITE_READY_EVENT = "lumora:ready";

function subscribe(callback: () => void) {
  window.addEventListener(SITE_READY_EVENT, callback);
  return () => window.removeEventListener(SITE_READY_EVENT, callback);
}

/**
 * Becomes true once the page loader has finished (or was skipped).
 * Entrance animations wait for it so they are not hidden behind the loader.
 */
export function useSiteReady(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.ready === "true",
    () => false,
  );
}
