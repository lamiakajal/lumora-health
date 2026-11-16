import { MongoClient } from "mongodb";
import { getEnv } from "@/lib/env";

// Reuse one client across hot reloads in development so we do not open a new connection per edit.
const globalForMongo = globalThis as typeof globalThis & { __lumoraMongoClient?: MongoClient };

/** The raw MongoDB client. Better Auth stores its users and sessions through this. */
export function getMongoClient(): MongoClient {
  globalForMongo.__lumoraMongoClient ??= new MongoClient(getEnv().MONGODB_URI);
  return globalForMongo.__lumoraMongoClient;
}

/** The database named in MONGODB_URI (for example /lumora). */
export function getDb() {
  return getMongoClient().db();
}
