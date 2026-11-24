import { findBookingsNeedingReminder, markReminderSent, unmarkReminder } from "@/lib/booking/provider-service";
import { notifyBookingReminder } from "@/lib/email/notify";

/** Confirmed visits starting within this many hours get a reminder. */
const REMINDER_WINDOW_HOURS = 26;

/**
 * GET /api/cron/reminders, called once a day by Vercel Cron (see vercel.json).
 * Vercel sends "Authorization: Bearer <CRON_SECRET>"; anything else is refused.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Not authorised." }, { status: 401 });
  }
  if (!process.env.RESEND_API_KEY) {
    return Response.json({ skipped: "RESEND_API_KEY is not set, so no reminders were sent." });
  }

  const now = new Date();
  const due = await findBookingsNeedingReminder(now, REMINDER_WINDOW_HOURS);
  let sent = 0;

  for (const { id, email } of due) {
    // Claim first so overlapping runs never send the same reminder twice.
    if (!(await markReminderSent(id, now))) continue;
    const result = await notifyBookingReminder(email);
    if (result.sent) sent += 1;
    else await unmarkReminder(id); // try again on the next run
  }

  return Response.json({ checked: due.length, sent });
}
