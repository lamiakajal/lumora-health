"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { buttonStyles } from "@/components/ui/button";
import { ChevronDownIcon, MapPinIcon } from "@/components/ui/icons";
import { insuranceOptions, specialtyOptions } from "@/lib/home-content";
import { buildDoctorsHref, doctorSearchSchema } from "@/lib/validation/search";

const controlStyles =
  "h-12 w-full rounded-xl border bg-background px-4 text-[15px] font-medium outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/15";

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
      >
        {label}
      </label>
      <div className="relative">{children}</div>
    </div>
  );
}

function SelectField({
  id,
  name,
  label,
  placeholder,
  options,
}: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  options: readonly string[];
}) {
  return (
    <Field id={id} label={label}>
      <select id={id} name={name} defaultValue="" className={`${controlStyles} appearance-none pr-10`}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </Field>
  );
}

export function DoctorSearchForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const parsed = doctorSearchSchema.safeParse({
      specialty: String(data.get("specialty") ?? ""),
      location: String(data.get("location") ?? ""),
      insurance: String(data.get("insurance") ?? ""),
    });

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Please check your search.";
      setError(message);
      toast.error("Check your search", { description: message });
      return;
    }

    setError(null);
    startTransition(() => router.push(buildDoctorsHref(parsed.data)));
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label="Find a doctor"
      className="rounded-card border bg-card p-4 shadow-lift sm:p-5"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
        <SelectField
          id="search-specialty"
          name="specialty"
          label="Specialty"
          placeholder="Any specialty"
          options={specialtyOptions}
        />

        <Field id="search-location" label="ZIP or postal code">
          <MapPinIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="search-location"
            name="location"
            type="text"
            inputMode="text"
            autoComplete="postal-code"
            maxLength={10}
            placeholder="94105 or M5V 2T6"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "search-location-error" : undefined}
            className={`${controlStyles} pl-10`}
          />
        </Field>

        <SelectField
          id="search-insurance"
          name="insurance"
          label="Insurance"
          placeholder="Any plan"
          options={insuranceOptions}
        />

        <button
          type="submit"
          disabled={pending}
          className={buttonStyles({
            size: "lg",
            className: "h-12 w-full md:col-span-2 lg:col-span-1 lg:w-auto disabled:opacity-70",
          })}
        >
          {pending ? (
            <svg viewBox="0 0 24 24" className="size-5 animate-spin" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
              <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          ) : null}
          {pending ? "Searching" : "Find a doctor"}
        </button>
      </div>

      {error && (
        <p
          id="search-location-error"
          role="alert"
          className="mt-3 text-sm font-medium text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </form>
  );
}
