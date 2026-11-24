import { z } from "zod";

const isoDate = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: "Choose a valid time.",
});

export const bookingRequestSchema = z.object({
  doctorSlug: z.string().trim().min(1, "Choose a doctor."),
  start: isoDate,
  visitType: z.enum(["in-person", "video"], { message: "Choose in person or video." }),
  reason: z.string().trim().max(500, "Please keep this under 500 characters.").default(""),
});

export type BookingRequest = z.infer<typeof bookingRequestSchema>;

export const cancelRequestSchema = z.object({
  action: z.literal("cancel"),
  reason: z.string().trim().max(300).default(""),
});

export const rescheduleRequestSchema = z.object({
  start: isoDate,
});
