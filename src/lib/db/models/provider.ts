import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/** A doctor who can be booked. Linked to a Better Auth user so they can sign in. */
const providerSchema = new Schema(
  {
    /** The Better Auth user id (set when the doctor has an account). */
    userId: { type: String, unique: true, sparse: true },
    /** Matches the doctor slug used on the website, e.g. "amelia-hart". */
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    serviceSlugs: { type: [String], default: [] },
    bio: { type: String, default: "" },
    /** IANA time zone the doctor's working hours are written in. */
    timezone: { type: String, required: true, default: "America/New_York" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type ProviderDoc = InferSchemaType<typeof providerSchema>;

export const ProviderModel =
  (models.Provider as Model<ProviderDoc> | undefined) ??
  model<ProviderDoc>("Provider", providerSchema);
