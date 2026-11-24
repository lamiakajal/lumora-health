import { sendEmail, type SendResult } from "./send";
import {
  bookingCancelledEmail,
  bookingConfirmedEmail,
  bookingReminderEmail,
  bookingRequestedEmail,
  type BookingEmailData,
  type EmailContent,
} from "./templates";

const deliver = (data: BookingEmailData, content: EmailContent): Promise<SendResult> =>
  sendEmail({ to: data.patientEmail, ...content });

export const notifyBookingRequested = (data: BookingEmailData) => deliver(data, bookingRequestedEmail(data));
export const notifyBookingConfirmed = (data: BookingEmailData) => deliver(data, bookingConfirmedEmail(data));
export const notifyBookingReminder = (data: BookingEmailData) => deliver(data, bookingReminderEmail(data));
export const notifyBookingCancelled = (data: BookingEmailData, cancelledBy: "patient" | "clinic") =>
  deliver(data, bookingCancelledEmail(data, cancelledBy));
