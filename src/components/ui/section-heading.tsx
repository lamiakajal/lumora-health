import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  /** Id for the <h2>, so a section can point to it with aria-labelledby. */
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <p className="mb-3 inline-flex rounded-full bg-soft px-4 py-1.5 text-sm font-semibold text-primary-deep">
        {eyebrow}
      </p>
      <h2 id={id} className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
