import { existsSync } from "node:fs";
import path from "node:path";

const EXTENSIONS = ["avif", "webp", "jpg", "jpeg", "png"] as const;

/**
 * Finds an optional image in /public so photos can be added without editing code.
 * findPublicImage("/images/hero") returns "/images/hero.webp" (or .jpg, .png ...)
 * when that file exists, otherwise null.
 */
export function findPublicImage(
  basePath: string,
  publicDir: string = path.join(process.cwd(), "public"),
): string | null {
  const clean = basePath.replace(/^\/+/, "");
  for (const extension of EXTENSIONS) {
    if (existsSync(path.join(publicDir, `${clean}.${extension}`))) {
      return `/${clean}.${extension}`;
    }
  }
  return null;
}
