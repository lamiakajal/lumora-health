"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { DoctorAdminRow } from "@/lib/admin/service";
import { cn } from "@/lib/cn";

export function DoctorManager({ doctors }: { doctors: DoctorAdminRow[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [emails, setEmails] = useState<Record<string, string>>({});

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return doctors.filter((doctor) => !needle || `${doctor.name} ${doctor.specialty}`.toLowerCase().includes(needle));
  }, [doctors, query]);

  async function call(slug: string, method: "PATCH" | "POST", body: unknown, success: string) {
    setBusy(`${slug}-${method}`);
    try {
      const response = await fetch(`/api/admin/doctors/${slug}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.error("That did not work", { description: data.error ?? "Please try again." });
        return;
      }
      toast.success(success);
      router.refresh();
    } catch {
      toast.error("We could not reach the server", { description: "Check your connection and try again." });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <label htmlFor="doctor-filter" className="sr-only">
        Find a doctor
      </label>
      <input
        id="doctor-filter"
        type="search"
        placeholder="Find a doctor"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 md:max-w-sm"
      />

      <ul className="mt-5 space-y-3">
        {shown.map((doctor) => (
          <li key={doctor.slug} className="rounded-xl border bg-background p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg font-bold">{doctor.name}</p>
                <p className="text-sm text-muted-foreground">
                  {doctor.specialty} &middot; {doctor.bookings} {doctor.bookings === 1 ? "booking" : "bookings"}
                </p>
                <p className="mt-1 text-sm">
                  {doctor.linked ? (
                    <span className="font-semibold text-primary-deep">
                      Account linked{doctor.linkedEmail ? `: ${doctor.linkedEmail}` : ""}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">No account linked yet</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-bold",
                    doctor.active ? "bg-primary/15 text-primary-deep" : "bg-red-500/10 text-red-700 dark:text-red-300",
                  )}
                >
                  {doctor.active ? "Taking bookings" : "Switched off"}
                </span>
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={() =>
                    call(
                      doctor.slug,
                      "PATCH",
                      { active: !doctor.active },
                      doctor.active ? `${doctor.name} is switched off for new bookings` : `${doctor.name} is taking bookings again`,
                    )
                  }
                  className="rounded-full border px-4 py-1.5 text-sm font-semibold transition hover:border-primary disabled:opacity-60"
                >
                  {doctor.active ? "Switch off" : "Switch on"}
                </button>
              </div>
            </div>

            <form
              className="mt-3 flex flex-wrap gap-2 border-t pt-3"
              onSubmit={(event) => {
                event.preventDefault();
                const email = (emails[doctor.slug] ?? "").trim();
                if (email) call(doctor.slug, "POST", { email }, "Account linked");
              }}
            >
              <label className="sr-only" htmlFor={`link-${doctor.slug}`}>
                Account email for {doctor.name}
              </label>
              <input
                id={`link-${doctor.slug}`}
                type="email"
                placeholder="Link an account by email"
                value={emails[doctor.slug] ?? ""}
                onChange={(event) => setEmails((current) => ({ ...current, [doctor.slug]: event.target.value }))}
                className="h-10 min-w-56 flex-1 rounded-lg border bg-card px-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
              />
              <button
                type="submit"
                disabled={busy !== null}
                className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-60"
              >
                {busy === `${doctor.slug}-POST` ? "Linking..." : "Link account"}
              </button>
            </form>
          </li>
        ))}
        {shown.length === 0 && <li className="text-muted-foreground">No doctors match that search.</li>}
      </ul>
    </div>
  );
}
