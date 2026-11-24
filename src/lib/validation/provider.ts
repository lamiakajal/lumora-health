import { z } from "zod";

export const slotLengthOptions = [15, 20, 30, 45, 60] as const;
export const bufferOptions = [0, 5, 10, 15] as const;

export const availabilitySchema = z.object({
  weekly: z
    .array(
      z.object({
        dayOfWeek: z.number().int().min(0).max(6),
        start: z.string(),
        end: z.string(),
      }),
    )
    .max(28),
  slotMinutes: z.number().refine((value) => (slotLengthOptions as readonly number[]).includes(value), {
    message: "Choose a slot length from the list.",
  }),
  bufferMinutes: z.number().refine((value) => (bufferOptions as readonly number[]).includes(value), {
    message: "Choose a buffer from the list.",
  }),
  timeOff: z
    .array(
      z.object({
        startDate: z.string(),
        endDate: z.string(),
        reason: z.string().trim().max(100, "Keep the reason short.").default(""),
      }),
    )
    .max(50),
});

export type AvailabilityInput = z.infer<typeof availabilitySchema>;

export const statusActionSchema = z.object({
  action: z.enum(["confirm", "complete", "cancel"]),
});
