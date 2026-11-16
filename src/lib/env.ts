import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z
    .string()
    .min(1, "Add your MongoDB Atlas connection string to .env.local (include the database name, e.g. /lumora)."),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "Must be at least 32 characters. Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\""),
  BETTER_AUTH_URL: z.string().url("Must be a full URL such as http://localhost:3000"),
});

export type Env = z.infer<typeof envSchema>;

/** Validates a set of variables and explains exactly what is wrong. Pure, so it is easy to test. */
export function parseEnv(source: Record<string, string | undefined>): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid environment variables:\n${problems}`);
  }
  return result.data;
}

let cached: Env | undefined;

/** Server-only settings, validated the first time they are needed. */
export function getEnv(): Env {
  cached ??= parseEnv(process.env);
  return cached;
}
