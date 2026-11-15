import type { MetadataRoute } from "next";
import { siteConfig } from "../../site.config";

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url.replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Private areas are never meant to appear in search results.
        disallow: ["/api/", "/portal", "/dashboard", "/admin", "/login"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
