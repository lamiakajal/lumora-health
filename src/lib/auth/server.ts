import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { getDb } from "@/lib/db/mongo-client";
import { getEnv } from "@/lib/env";
import { siteConfig } from "../../../site.config";

const env = getEnv();

export const auth = betterAuth({
  appName: siteConfig.name,
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(getDb()),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
  },

  user: {
    additionalFields: {
      // "patient" (default), "doctor" or "admin". input:false means nobody can choose
      // their own role when signing up. Admins change roles with scripts/set-role.mjs.
      role: { type: "string", required: false, defaultValue: "patient", input: false },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  // nextCookies must be the last plugin so cookies set in Server Actions work.
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
