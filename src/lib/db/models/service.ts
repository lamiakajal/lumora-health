import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const serviceSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    durationMinutes: { type: Number, required: true, default: 30, min: 5, max: 240 },
    priceCents: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "USD", uppercase: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type ServiceDoc = InferSchemaType<typeof serviceSchema>;

export const ServiceModel =
  (models.Service as Model<ServiceDoc> | undefined) ?? model<ServiceDoc>("Service", serviceSchema);
