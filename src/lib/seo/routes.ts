/**
 * Public pages that exist and should be listed in the sitemap.
 * Add a route here in the same commit that ships its page.
 */
export const publicRoutes: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
];
