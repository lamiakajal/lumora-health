/**
 * Only allow redirects to pages on this site. Rejects absolute URLs and
 * protocol-relative URLs (//evil.com) so a login link cannot send people elsewhere.
 */
export function safeRedirectPath(value: string | null | undefined, fallback = "/portal"): string {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
  return value;
}
