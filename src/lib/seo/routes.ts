import { doctors } from "@/data/doctors";
import { services } from "@/data/services";

type Route = { path: string; priority: number; changeFrequency: "weekly" | "monthly" };

/**
 * Public pages that exist and should be listed in the sitemap.
 * Add a static route here in the same commit that ships its page.
 */
const staticRoutes: Route[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/services", priority: 0.9, changeFrequency: "weekly" },
  { path: "/doctors", priority: 0.9, changeFrequency: "weekly" },
];

export const publicRoutes: Route[] = [
  ...staticRoutes,
  ...services.map((service) => ({
    path: `/services/${service.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  })),
  ...doctors.map((doctor) => ({
    path: `/doctors/${doctor.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  })),
];
