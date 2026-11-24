# How booking works

## Slots

A doctor's availability is a set of weekly rules written in **their own time zone**
(for example Monday 09:00-12:00 and 13:00-17:00 in `America/Los_Angeles`), plus holidays and
time off. `src/lib/booking/slots.ts` turns those rules into real UTC time slots for any date.
It handles daylight saving time, hides slots that are too soon (2 hours notice), hides
slots that overlap time off, and hides slots that are already booked.

Until a doctor's own schedule is saved in the database, `defaults.ts` supplies weekday hours.

## Booking safely

`POST /api/bookings` does not trust the browser. `placeBooking` (`src/lib/booking/create.ts`):

1. Works out the open slots again on the server.
2. Checks the requested start time is one of them.
3. Inserts the booking.

If two patients click the same slot at the same moment, the database refuses the second
insert because of a **unique partial index** on `(providerId, start)` for pending and
confirmed bookings (`src/lib/db/models/booking.ts`). The second patient gets a friendly
"that time was just taken" message and the calendar reloads.

## Statuses

`pending -> confirmed -> completed`, and `pending` or `confirmed -> cancelled`.
Completed and cancelled are final (`src/lib/booking/status.ts`). Cancelling frees the slot.

## Tests

- `time.test.ts`: time zones and daylight saving days.
- `slots.test.ts`: slot generation, buffers, time off, notice, double booking.
- `create.test.ts`: two patients racing for one slot, only one wins.
- `status.test.ts`: allowed status changes.

## Emails

`src/lib/email` builds the messages (`templates.ts`, plain text plus HTML, every patient-supplied
value escaped) and sends them with Resend (`send.ts`). Sending never throws: a failed email can
not break a booking. Emails go out after the response is sent, using Next.js `after()`.

| Event | Email |
| --- | --- |
| Patient books | "Appointment requested" |
| Doctor confirms | "Your appointment is confirmed" |
| Patient or clinic cancels | "Appointment cancelled" |
| Day before the visit | "Your appointment is coming up" (daily job) |

## Doctor dashboard

`/dashboard` (role `doctor`): confirm or decline pending visits, mark visits completed once they
have started, edit weekly hours (several windows per day), visit length, breaks and holidays.
Every change is checked again on the server, and the status rules in `status.ts` decide what is
allowed. Time off is stored as whole local days and removes every slot on those days.

## Rescheduling

Patients can move a pending or confirmed visit from the portal (`/book?reschedule=<id>`), up to
24 hours before it starts (`policy.ts`; admins can move any visit that has not started). The same
safety checks as a new booking apply (`placeReschedule` in `create.ts`): the open slots are worked
out again on the server, the booking's own old time never blocks its new one, and the database's
unique index stops two people taking one slot. A moved visit goes back to *pending* so the doctor
confirms the new time, and the patient gets a "rescheduled" email showing both times.

## Admin dashboard

`/admin` (role `admin`): totals by status, a weekly visit-value chart (completed vs pending and
confirmed), a searchable table of every booking with confirm, complete and cancel actions, and
doctor management: link a doctor's account by email, or switch a doctor off so they stop taking
new bookings (their calendar shows no slots; existing visits are untouched).
