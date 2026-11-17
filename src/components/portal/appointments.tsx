import Link from "next/link";
import { CancelBookingButton } from "@/components/portal/cancel-booking-button";
import { isActiveStatus, type BookingStatus } from "@/lib/booking/status";
import { listBookings } from "@/lib/booking/service";
import { formatDay, formatTime, timeZoneLabel } from "@/lib/booking/time";
import { cn } from "@/lib/cn";

const statusStyles: Record<BookingStatus, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  confirmed: "bg-primary/15 text-primary-deep",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-red-500/10 text-red-700 dark:text-red-300",
};

const statusLabels: Record<BookingStatus, string> = {
  pending: "Pending confirmation",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

/** The signed-in patient's appointments. Reads the database, so render it inside <Suspense>. */
export async function Appointments({ patientId }: { patientId: string }) {
  const bookings = await listBookings(patientId);
  const upcoming = bookings.filter((booking) => isActiveStatus(booking.status));
  const history = bookings.filter((booking) => !isActiveStatus(booking.status)).reverse();

  if (bookings.length === 0) {
    return (
      <div>
        <p className="text-muted-foreground">You have no appointments yet.</p>
        <Link href="/book" className="mt-4 inline-flex text-sm font-bold text-primary-deep hover:underline">
          Book your first visit
        </Link>
      </div>
    );
  }

  const row = (booking: (typeof bookings)[number], canCancel: boolean) => (
    <li key={booking.id} className="rounded-xl border bg-background p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg font-bold">
            {formatDay(booking.start, booking.timezone)}, {formatTime(booking.start, booking.timezone)}{" "}
            <span className="text-sm font-semibold text-muted-foreground">
              {timeZoneLabel(booking.start, booking.timezone)}
            </span>
          </p>
          <p className="mt-0.5 text-[15px]">
            <Link href={`/doctors/${booking.doctorSlug}`} className="font-semibold hover:text-primary">
              {booking.doctorName}
            </Link>
            <span className="text-muted-foreground">
              {" "}
              &middot; {booking.specialty} &middot; {booking.visitType === "video" ? "Video visit" : "In person"}
            </span>
          </p>
          {booking.reason && <p className="mt-1 text-sm text-muted-foreground">{booking.reason}</p>}
        </div>
        <span className={cn("rounded-full px-3 py-1 text-xs font-bold", statusStyles[booking.status])}>
          {statusLabels[booking.status]}
        </span>
      </div>
      {canCancel && (
        <div className="mt-3 border-t pt-3">
          <CancelBookingButton bookingId={booking.id} />
        </div>
      )}
    </li>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">Upcoming</h3>
        {upcoming.length > 0 ? (
          <ul className="space-y-3">{upcoming.map((booking) => row(booking, true))}</ul>
        ) : (
          <p className="text-muted-foreground">Nothing coming up.</p>
        )}
      </div>
      {history.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">Past and cancelled</h3>
          <ul className="space-y-3">{history.map((booking) => row(booking, false))}</ul>
        </div>
      )}
      <Link href="/book" className="inline-flex text-sm font-bold text-primary-deep hover:underline">
        Book another visit
      </Link>
    </div>
  );
}
