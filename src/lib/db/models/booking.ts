import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { activeStatuses, bookingStatuses } from "@/lib/booking/status";

const bookingSchema = new Schema(
  {
    /** The Better Auth user id of the patient. */
    patientId: { type: String, required: true, index: true },
    providerId: { type: Schema.Types.ObjectId, ref: "Provider", required: true },
    serviceSlug: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    status: { type: String, enum: bookingStatuses, required: true, default: "pending" },
    visitType: { type: String, enum: ["in-person", "video"], required: true, default: "in-person" },
    reason: { type: String, default: "", maxlength: 500 },
    priceCents: { type: Number, required: true, default: 0, min: 0 },
    rescheduledFrom: { type: Schema.Types.ObjectId, ref: "Booking" },
    cancelledAt: { type: Date },
    cancelReason: { type: String, default: "" },
  },
  { timestamps: true },
);

// The database itself refuses a second pending or confirmed booking for the same
// doctor at the same start time. This is what stops double bookings, even when two
// patients click "confirm" at the same moment.
bookingSchema.index(
  { providerId: 1, start: 1 },
  { unique: true, partialFilterExpression: { status: { $in: [...activeStatuses] } } },
);
bookingSchema.index({ patientId: 1, start: -1 });

export type BookingDoc = InferSchemaType<typeof bookingSchema>;

export const BookingModel =
  (models.Booking as Model<BookingDoc> | undefined) ?? model<BookingDoc>("Booking", bookingSchema);
