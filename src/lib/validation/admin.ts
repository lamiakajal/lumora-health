import { z } from "zod";

export const setActiveSchema = z.object({ active: z.boolean() });

export const linkDoctorSchema = z.object({
  email: z.string().trim().email("Enter the doctor's account email."),
});
