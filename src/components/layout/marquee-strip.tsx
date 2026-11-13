const phrases = [
  "Compassionate care",
  "Same-week appointments",
  "Secure telehealth",
  "Transparent pricing",
  "Board-certified physicians",
  "Most major insurance accepted",
];

export function MarqueeStrip() {
  // The list is rendered twice so the -50% translate loops seamlessly.
  const items = [...phrases, ...phrases];

  return (
    <div
      aria-hidden="true"
      className="group overflow-hidden bg-primary py-4 text-primary-foreground"
    >
      <div className="flex w-max animate-marquee gap-10 group-hover:[animation-play-state:paused]">
        {items.map((phrase, index) => (
          <span
            key={`${phrase}-${index}`}
            className="flex items-center gap-10 font-display text-lg font-semibold tracking-tight"
          >
            {phrase}
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
              <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7V3Z" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
