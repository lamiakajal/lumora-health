import { z } from "zod";

const US_ZIP = /^\d{5}(-\d{4})?$/;
const CA_POSTAL = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

/** True for a US ZIP (12345 or 12345-6789) or a Canadian postal code (A1A 1A1). */
export function isValidPostalCode(value: string): boolean {
  const trimmed = value.trim();
  return US_ZIP.test(trimmed) || CA_POSTAL.test(trimmed);
}

/** Canadian codes become "A1A 1A1"; US ZIP codes are returned trimmed. */
export function normalizePostalCode(value: string): string {
  const trimmed = value.trim();
  if (CA_POSTAL.test(trimmed)) {
    const compact = trimmed.replace(/[ -]/g, "").toUpperCase();
    return `${compact.slice(0, 3)} ${compact.slice(3)}`;
  }
  return trimmed;
}

export const doctorSearchSchema = z.object({
  specialty: z.string().trim(),
  location: z
    .string()
    .trim()
    .refine((value) => value === "" || isValidPostalCode(value), {
      message: "Enter a valid US ZIP code or Canadian postal code.",
    }),
  insurance: z.string().trim(),
});

export type DoctorSearchValues = z.infer<typeof doctorSearchSchema>;

/** Builds the /doctors URL for a search, leaving out empty filters. */
export function buildDoctorsHref(values: DoctorSearchValues): string {
  const params = new URLSearchParams();
  if (values.specialty) params.set("specialty", values.specialty);
  if (values.location) params.set("location", normalizePostalCode(values.location));
  if (values.insurance) params.set("insurance", values.insurance);
  const query = params.toString();
  return query ? `/doctors?${query}` : "/doctors";
}
