/** "Dr. Amelia Hart" -> "AH". Titles are ignored; long names use first and last. */
export function getInitials(name: string, max = 2): string {
  const parts = name
    .replace(/^(dr|mr|mrs|ms)\.?\s+/i, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "";
  const letters = parts.map((part) => part.charAt(0).toUpperCase());
  if (letters.length > max) return letters[0] + letters[letters.length - 1];
  return letters.join("");
}
