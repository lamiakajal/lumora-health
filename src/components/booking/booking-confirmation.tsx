import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons-medical";
import { formatDay, formatTime, timeZoneLabel } from "@/lib/booking/time";

export type Confirmation = {
  id: string;
  doctorName: string;
  start: string;
  timezone: string;
  visitType: "in-person" | "video";
  /** True when an existing visit was moved rather than a new one booked. */
  rescheduled?: boolean;
};

export function BookingConfirmation({ confirmation }: { confirmation: Confirmation }) {
  const { doctorName, start, timezone, visitType, rescheduled } = confirmation;

  return (
    <div className="mx-auto max-w-xl rounded-card border bg-card p-8 text-center shadow-lift sm:p-10">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-primary text-primary-foreground">
        <CheckIcon className="size-8" strokeWidth={3} />
      </span>
      <h2 className="mt-6 font-display text-3xl font-bold">
        {rescheduled ? "Appointment rescheduled" : "Appointment requested"}
      </h2>
      <p className="mt-3 text-muted-foreground">
        {rescheduled
          ? `Your visit with ${doctorName} has moved to the time below. They will confirm it again.`
          : `Your time with ${doctorName} is held for you. You can see it, and cancel it if your plans change, in your patient portal.`}
      </p>

      <dl className="mt-8 divide-y rounded-xl border text-left">
        <div className="flex justify-between gap-4 px-5 py-3">
          <dt className="text-muted-foreground">Doctor</dt>
          <dd className="font-semibold">{doctorName}</dd>
        </div>
        <div className="flex justify-between gap-4 px-5 py-3">
          <dt className="text-muted-foreground">When</dt>
          <dd className="text-right font-semibold">
            {formatDay(start, timezone)}, {formatTime(start, timezone)} {timeZoneLabel(start, timezone)}
          </dd>
        </div>
        <div className="flex justify-between gap-4 px-5 py-3">
          <dt className="text-muted-foreground">Visit</dt>
          <dd className="font-semibold">{visitType === "video" ? "Video visit" : "In person"}</dd>
        </div>
        <div className="flex justify-between gap-4 px-5 py-3">
          <dt className="text-muted-foreground">Status</dt>
          <dd className="font-semibold">Pending confirmation</dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/portal" size="lg" arrow>
          View in my portal
        </ButtonLink>
        <Link
          href="/doctors"
          className="inline-flex h-14 items-center rounded-full border px-8 text-base font-semibold transition hover:border-primary hover:text-primary"
        >
          Find another doctor
        </Link>
      </div>
    </div>
  );
}
