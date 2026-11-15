import type { MetadataRoute } from "next";
import { publicRoutes } from "@/lib/seo/routes";
import { siteConfig } from "../../site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  return publicRoutes.map((route) => ({
    url: `${base}${route.path === "/" ? "" : route.path}`,
    // A fixed date: reading the current time while rendering is not allowed with Cache Components.
    lastModified: new Date("2026-11-15"),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
