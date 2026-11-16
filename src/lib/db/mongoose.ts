import mongoose from "mongoose";
import { getEnv } from "@/lib/env";

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

const globalForMongoose = globalThis as typeof globalThis & { __lumoraMongoose?: Cache };
const cache: Cache = (globalForMongoose.__lumoraMongoose ??= { conn: null, promise: null });

/** Connects Mongoose once and reuses the connection (also across hot reloads). */
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;

  cache.promise ??= mongoose.connect(getEnv().MONGODB_URI, { bufferCommands: false });
  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null; // let the next request try again
    throw error;
  }
  return cache.conn;
}
