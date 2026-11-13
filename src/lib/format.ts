/**
 * Turns a display phone number like "(415) 555-0132" into a tel: link.
 * Assumes North American numbers (+1) because the clinic serves the US and Canada.
 */
export function toTelHref(phone: string, countryCode = "1"): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  const national =
    digits.length === countryCode.length + 10 && digits.startsWith(countryCode)
      ? digits.slice(countryCode.length)
      : digits;
  return `tel:+${countryCode}${national}`;
}
