import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

export const paymentStatuses = ["requires_payment", "paid", "refunded", "failed"] as const;

const paymentSchema = new Schema(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true, index: true },
    gateway: { type: String, enum: ["stripe"], required: true, default: "stripe" },
    /** The id Stripe gives the payment, used to match webhooks. */
    gatewayPaymentId: { type: String, unique: true, sparse: true },
    amountCents: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "USD", uppercase: true },
    status: { type: String, enum: paymentStatuses, required: true, default: "requires_payment" },
    receiptUrl: { type: String },
  },
  { timestamps: true },
);

export type PaymentDoc = InferSchemaType<typeof paymentSchema>;

export const PaymentModel =
  (models.Payment as Model<PaymentDoc> | undefined) ?? model<PaymentDoc>("Payment", paymentSchema);
