"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  BookingConfirmation,
  type Confirmation,
} from "@/components/booking/booking-confirmation";
import { buttonStyles } from "@/components/ui/button";
import { categories } from "@/data/categories";
import { doctors } from "@/data/doctors";
import { useAvailability } from "@/hooks/use-availability";
import { authClient } from "@/lib/auth/client";
import { formatPrice, priceCentsFor, type VisitType } from "@/lib/booking/defaults";
import { describeLocalDate, formatDay, formatTime, localHour } from "@/lib/booking/time";
import { cn } from "@/lib/cn";
import { doctorsForService, getDoctorBySlug, getServiceBySlug } from "@/lib/services";

const control =
  "h-12 w-full rounded-xl border bg-background px-4 text-[15px] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15";

function Step({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  return (
    <section className="rounded-card border bg-card p-6 shadow-soft">
      <h2 className="flex items-center gap-3 font-display text-xl font-bold">
        <span className="grid size-8 place-items-center rounded-full bg-primary text-sm text-primary-foreground">
          {number}
        </span>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function BookingWizard() {
  const router = useRouter();
  const params = useSearchParams();
  const session = authClient.useSession();

  const service = getServiceBySlug(params.get("service") ?? "");
  const choices = service ? doctorsForService(service) : doctors;
  const requestedDoctor = params.get("doctor") ?? "";
  // /book?reschedule=<booking id>&doctor=<slug> moves an existing visit instead of making a new one.
  const rescheduleId = params.get("reschedule");
  const isReschedule = Boolean(rescheduleId && getDoctorBySlug(requestedDoctor));
  const returnPath = (slug: string) =>
    isReschedule ? `/book?reschedule=${rescheduleId}&doctor=${slug}` : `/book?doctor=${slug}`;

  const [doctorSlug, setDoctorSlug] = useState(getDoctorBySlug(requestedDoctor) ? requestedDoctor : "");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [visitType, setVisitType] = useState<VisitType>("in-person");
  const [reason, setReason] = useState("");
  const [version, setVersion] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const doctor = getDoctorBySlug(doctorSlug);
  const { loading, data, error } = useAvailability(doctor?.slug ?? null, version);

  // Everything below is worked out from state, so there is nothing to keep in sync.
  const days = data?.days ?? [];
  const firstOpenDate = days.find((day) => day.slots.length > 0)?.date ?? null;
  const activeDate =
    selectedDate && days.some((day) => day.date === selectedDate && day.slots.length > 0)
      ? selectedDate
      : firstOpenDate;
  const slots = days.find((day) => day.date === activeDate)?.slots ?? [];
  const activeStart = selectedStart && slots.includes(selectedStart) ? selectedStart : null;
  const effectiveVisit: VisitType = doctor && !doctor.telehealth ? "in-person" : visitType;
  const timezone = data?.timezone ?? "America/Los_Angeles";

  function chooseDoctor(slug: string) {
    setDoctorSlug(slug);
    setSelectedDate(null);
    setSelectedStart(null);
  }

  async function confirm() {
    if (!doctor || !activeStart) return;
    setSubmitting(true);
    try {
      const response = await fetch(isReschedule ? `/api/bookings/${rescheduleId}/reschedule` : "/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isReschedule
            ? { start: activeStart }
            : { doctorSlug: doctor.slug, start: activeStart, visitType: effectiveVisit, reason },
        ),
      });
      const body = await response.json().catch(() => ({}));

      if (response.status === 401) {
        toast.error("Please sign in to book");
        router.push(`/login?next=${encodeURIComponent(returnPath(doctor.slug))}`);
        return;
      }
      if (response.status === 409) {
        toast.error("That time was just taken", { description: "Please choose another time." });
        setSelectedStart(null);
        setVersion((value) => value + 1); // reload the calendar
        return;
      }
      if (!response.ok) {
        toast.error(isReschedule ? "We could not move that visit" : "We could not book that visit", {
          description: body.error ?? "Please try again in a moment.",
        });
        return;
      }

      setConfirmation({
        id: body.id,
        doctorName: doctor.name,
        start: body.start,
        timezone: body.timezone,
        visitType: effectiveVisit,
        rescheduled: isReschedule,
      });
      toast.success(isReschedule ? "Appointment rescheduled" : "Appointment requested", {
        description: "You can manage it in your portal.",
      });
    } catch {
      toast.error("We could not reach the server", { description: "Check your connection and try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmation) {
    return (
      <section aria-label="Booking confirmed" className="mx-auto max-w-7xl px-5 py-14">
        <BookingConfirmation confirmation={confirmation} />
      </section>
    );
  }

  const signedIn = Boolean(session.data);

  return (
    <section aria-label="Book an appointment" className="mx-auto grid max-w-7xl gap-6 px-5 py-14 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-6">
        <Step number={1} title="Choose your doctor">
          <label htmlFor="booking-doctor" className="sr-only">
            Doctor
          </label>
          <select
            id="booking-doctor"
            value={doctorSlug}
            onChange={(event) => chooseDoctor(event.target.value)}
            disabled={isReschedule}
            className={control}
          >
            <option value="">Select a doctor</option>
            {categories.map((category) => {
              const group = choices.filter((item) => item.category === category.id);
              if (group.length === 0) return null;
              return (
                <optgroup key={category.id} label={category.label}>
                  {group.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name} ({item.specialty})
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
          {isReschedule && (
            <p className="mt-3 text-sm text-muted-foreground">
              You are choosing a new time for an existing visit.{" "}
              <Link href="/portal" className="font-bold text-primary-deep hover:underline">
                Back to my appointments
              </Link>
            </p>
          )}
          {service && !isReschedule && (
            <p className="mt-3 text-sm text-muted-foreground">
              Showing {service.title.toLowerCase()} doctors.{" "}
              <Link href="/book" className="font-bold text-primary-deep hover:underline">
                Show all doctors
              </Link>
            </p>
          )}
        </Step>

        <Step number={2} title="Pick a day">
          {!doctor && <p className="text-muted-foreground">Choose a doctor to see their calendar.</p>}
          {doctor && loading && <div className="h-24 animate-pulse rounded-xl bg-muted" aria-busy="true" />}
          {doctor && error && (
            <p role="alert" className="text-red-600 dark:text-red-400">
              {error}{" "}
              <button type="button" onClick={() => setVersion((value) => value + 1)} className="font-bold underline">
                Try again
              </button>
            </p>
          )}
          {doctor && data && !firstOpenDate && (
            <p className="text-muted-foreground">
              {doctor.name} has no openings in the next two weeks. Try another doctor, or call our
              team and we will help.
            </p>
          )}
          {doctor && data && firstOpenDate && (
            <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
              {days.map((day) => {
                const label = describeLocalDate(day.date);
                const open = day.slots.length > 0;
                const selected = day.date === activeDate;
                return (
                  <button
                    key={day.date}
                    type="button"
                    disabled={!open}
                    aria-pressed={selected}
                    onClick={() => {
                      setSelectedDate(day.date);
                      setSelectedStart(null);
                    }}
                    className={cn(
                      "flex w-[4.5rem] shrink-0 flex-col items-center rounded-2xl border px-2 py-3 transition",
                      selected
                        ? "border-transparent bg-primary text-primary-foreground shadow-soft"
                        : open
                          ? "bg-background hover:border-primary"
                          : "cursor-not-allowed bg-muted/50 text-muted-foreground/50",
                    )}
                  >
                    <span className="text-xs font-semibold uppercase">{label.weekday}</span>
                    <span className="font-display text-2xl font-bold">{label.day}</span>
                    <span className="text-xs">{label.month}</span>
                  </button>
                );
              })}
            </div>
          )}
        </Step>

        <Step number={3} title="Choose a time">
          {!activeDate && <p className="text-muted-foreground">Pick a day first.</p>}
          {activeDate && (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                Times shown in {data?.timezoneLabel} ({doctor?.name}&rsquo;s time zone)
              </p>
              {(["Morning", "Afternoon"] as const).map((part) => {
                const group = slots.filter((slot) => (localHour(slot, timezone) < 12) === (part === "Morning"));
                if (group.length === 0) return null;
                return (
                  <div key={part} className="mb-5 last:mb-0">
                    <h3 className="mb-2 text-sm font-bold">{part}</h3>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {group.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          aria-pressed={slot === activeStart}
                          onClick={() => setSelectedStart(slot)}
                          className={cn(
                            "h-11 rounded-xl border text-sm font-semibold transition",
                            slot === activeStart
                              ? "border-transparent bg-primary text-primary-foreground shadow-soft"
                              : "bg-background hover:border-primary hover:text-primary",
                          )}
                        >
                          {formatTime(slot, timezone)}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </Step>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-card border bg-card p-6 shadow-lift">
          <h2 className="font-display text-xl font-bold">{isReschedule ? "New time" : "Your visit"}</h2>

          {doctor ? (
            <p className="mt-3">
              <span className="font-semibold">{doctor.name}</span>
              <span className="block text-sm text-muted-foreground">{doctor.specialty}</span>
            </p>
          ) : (
            <p className="mt-3 text-muted-foreground">No doctor chosen yet.</p>
          )}

          {activeStart && (
            <p className="mt-4 rounded-xl bg-soft px-4 py-3 text-[15px] font-semibold">
              {formatDay(activeStart, timezone)} at {formatTime(activeStart, timezone)} {data?.timezoneLabel}
            </p>
          )}

          {doctor && !isReschedule && (
            <fieldset className="mt-5">
              <legend className="mb-2 text-sm font-bold">Type of visit</legend>
              <div className="grid grid-cols-2 gap-2">
                {(["in-person", "video"] as const).map((type) => {
                  const disabled = type === "video" && !doctor.telehealth;
                  return (
                    <label
                      key={type}
                      className={cn(
                        "flex cursor-pointer flex-col rounded-xl border p-3 text-sm transition has-[:checked]:border-primary has-[:checked]:bg-soft",
                        disabled && "cursor-not-allowed opacity-50",
                      )}
                    >
                      <input
                        type="radio"
                        name="visit-type"
                        value={type}
                        checked={effectiveVisit === type}
                        disabled={disabled}
                        onChange={() => setVisitType(type)}
                        className="sr-only"
                      />
                      <span className="font-bold">{type === "video" ? "Video" : "In person"}</span>
                      <span className="text-muted-foreground">
                        {disabled ? "Not offered" : formatPrice(priceCentsFor(doctor, type))}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          {!isReschedule && (
          <div className="mt-5">
            <label htmlFor="booking-reason" className="mb-1.5 block text-sm font-bold">
              Reason for your visit <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <textarea
              id="booking-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value.slice(0, 500))}
              rows={3}
              placeholder="Share anything your doctor should know. Do not include emergencies."
              className="w-full rounded-xl border bg-background px-4 py-3 text-[15px] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
            />
            <p className="mt-1 text-right text-xs text-muted-foreground">{reason.length}/500</p>
          </div>
          )}

          {signedIn ? (
            <button
              type="button"
              onClick={confirm}
              disabled={!doctor || !activeStart || submitting}
              className={buttonStyles({ size: "lg", className: "mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50" })}
            >
              {submitting ? "Saving..." : isReschedule ? "Confirm new time" : "Confirm appointment"}
            </button>
          ) : (
            <Link
              href={`/login?next=${encodeURIComponent(doctor ? returnPath(doctor.slug) : "/book")}`}
              className={buttonStyles({ size: "lg", className: "mt-4 w-full" })}
            >
              Sign in to confirm
            </Link>
          )}
          <p className="mt-3 text-center text-xs text-muted-foreground">
            For emergencies call 911. Payment is not taken yet, you will see the full cost before any charge.
          </p>
        </div>
      </aside>
    </section>
  );
}
