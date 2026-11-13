/**
 * Maps elapsed time to a 0-100 integer using an ease-out cubic curve.
 * Used by the page loader so the percentage feels natural.
 */
export function easedPercent(elapsedMs: number, durationMs: number): number {
  if (durationMs <= 0) return 100;
  const t = Math.min(Math.max(elapsedMs / durationMs, 0), 1);
  const eased = 1 - Math.pow(1 - t, 3);
  return Math.round(eased * 100);
}
