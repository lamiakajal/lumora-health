import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const weeklyRuleSchema = new Schema(
  {
    /** 0 = Sunday ... 6 = Saturday. */
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    /** Local time in the provider's time zone, "HH:mm" (24 hour). */
    start: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
    end: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
  },
  { _id: false },
);

const timeOffSchema = new Schema(
  {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    reason: { type: String, default: "" },
  },
  { _id: false },
);

/** One document per doctor: their weekly hours plus holidays and time off. */
const availabilitySchema = new Schema(
  {
    providerId: { type: Schema.Types.ObjectId, ref: "Provider", required: true, unique: true },
    weekly: { type: [weeklyRuleSchema], default: [] },
    slotMinutes: { type: Number, required: true, default: 30, min: 5, max: 240 },
    bufferMinutes: { type: Number, required: true, default: 0, min: 0, max: 120 },
    timeOff: { type: [timeOffSchema], default: [] },
  },
  { timestamps: true },
);

export type AvailabilityDoc = InferSchemaType<typeof availabilitySchema>;

export const AvailabilityModel =
  (models.Availability as Model<AvailabilityDoc> | undefined) ??
  model<AvailabilityDoc>("Availability", availabilitySchema);
