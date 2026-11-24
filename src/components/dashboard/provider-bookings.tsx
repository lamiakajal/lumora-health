import Link from "next/link";
import { BookingActions } from "@/components/dashboard/booking-actions";
import { formatDay, formatTime, timeZoneLabel } from "@/lib/booking/time";
import type { BookingStatus } from "@/lib/booking/status";
import type { ProviderBooking } from "@/lib/booking/types";
import { cn } from "@/lib/cn";

const statusStyles: Record<BookingStatus, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  confirmed: "bg-primary/15 text-primary-deep",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-red-500/10 text-red-700 dark:text-red-300",
};

const statusLabels: Record<BookingStatus, string> = {
  pending: "Needs confirmation",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function BookingRow({ booking, showDoctor = false }: { booking: ProviderBooking; showDoctor?: boolean }) {
  return (
    <li className="rounded-xl border bg-background p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg font-bold">
            {formatDay(booking.start, booking.timezone)}, {formatTime(booking.start, booking.timezone)}{" "}
            <span className="text-sm font-semibold text-muted-foreground">
              {timeZoneLabel(booking.start, booking.timezone)}
            </span>
          </p>
          <p className="mt-0.5 text-[15px]">
            <span className="font-semibold">{booking.patientName}</span>
            <span className="text-muted-foreground">
              {" "}
              &middot; {showDoctor && <>{booking.doctorName} &middot; </>}
              {booking.visitType === "video" ? "Video visit" : "In person"}
              {booking.patientEmail && (
                <>
                  {" "}
                  &middot;{" "}
                  <Link href={`mailto:${booking.patientEmail}`} className="hover:text-primary">
                    {booking.patientEmail}
                  </Link>
                </>
              )}
            </span>
          </p>
          {booking.reason && <p className="mt-1 text-sm text-muted-foreground">&ldquo;{booking.reason}&rdquo;</p>}
        </div>
        <span className={cn("rounded-full px-3 py-1 text-xs font-bold", statusStyles[booking.status])}>
          {statusLabels[booking.status]}
        </span>
      </div>
      <div className="mt-3">
        <BookingActions bookingId={booking.id} status={booking.status} />
      </div>
    </li>
  );
}

function Group({ title, bookings, empty }: { title: string; bookings: ProviderBooking[]; empty: string }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
        {title} ({bookings.length})
      </h3>
      {bookings.length === 0 ? (
        <p className="text-muted-foreground">{empty}</p>
      ) : (
        <ul className="space-y-3">
          {bookings.map((booking) => (
            <BookingRow key={booking.id} booking={booking} />
          ))}
        </ul>
      )}
    </div>
  );
}

export function ProviderBookings({ bookings, now }: { bookings: ProviderBooking[]; now: Date }) {
  const pending = bookings.filter((booking) => booking.status === "pending");
  const upcoming = bookings.filter((booking) => booking.status === "confirmed" && new Date(booking.end) >= now);
  const past = bookings
    .filter(
      (booking) =>
        booking.status === "completed" ||
        booking.status === "cancelled" ||
        (booking.status === "confirmed" && new Date(booking.end) < now),
    )
    .reverse();

  return (
    <div className="space-y-8">
      <Group title="Needs your confirmation" bookings={pending} empty="Nothing waiting for you." />
      <Group title="Upcoming" bookings={upcoming} empty="No confirmed visits coming up." />
      <Group title="Past and cancelled" bookings={past} empty="Nothing here yet." />
    </div>
  );
}
