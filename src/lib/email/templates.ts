import { formatDay, formatTime, timeZoneLabel } from "@/lib/booking/time";
import { siteConfig } from "../../../site.config";

export type BookingEmailData = {
  bookingId: string;
  patientName: string;
  patientEmail: string;
  doctorName: string;
  specialty: string;
  /** ISO, UTC */
  start: string;
  /** IANA time zone the visit is shown in */
  timezone: string;
  visitType: "in-person" | "video";
  reason: string;
};

export type EmailContent = { subject: string; html: string; text: string };

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const firstName = (name: string) => name.trim().split(/\s+/)[0] || "there";
const reference = (id: string) => id.slice(-8).toUpperCase();
const baseUrl = () => siteConfig.url.replace(/\/$/, "");

export function whenText(data: Pick<BookingEmailData, "start" | "timezone">): string {
  return `${formatDay(data.start, data.timezone)} at ${formatTime(data.start, data.timezone)} ${timeZoneLabel(data.start, data.timezone)}`;
}

function detailRows(data: BookingEmailData): [string, string][] {
  const rows: [string, string][] = [
    ["Doctor", `${data.doctorName} (${data.specialty})`],
    ["When", whenText(data)],
    ["Visit", data.visitType === "video" ? "Video visit" : `In person at ${siteConfig.contact.address.street}`],
  ];
  if (data.reason) rows.push(["Reason", data.reason]);
  rows.push(["Reference", reference(data.bookingId)]);
  return rows;
}

type LayoutArgs = {
  preheader: string;
  heading: string;
  intro: string;
  data: BookingEmailData;
  note: string;
  button?: string;
};

function render({ preheader, heading, intro, data, note, button = "View in your portal" }: LayoutArgs): EmailContent["html"] {
  const rows = detailRows(data)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 0;color:#5b7480;font-size:14px;width:110px;vertical-align:top">${escapeHtml(label)}</td>
          <td style="padding:10px 0;color:#0b2530;font-size:15px;font-weight:600">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f2f7f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
    <span style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</span>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 12px">
      <tr><td align="center">
        <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #dce8e9">
          <tr><td style="background:linear-gradient(135deg,#0d9488,#0b4f6c);padding:28px 32px;color:#ffffff;font-size:20px;font-weight:800">
            ${escapeHtml(siteConfig.name)}
          </td></tr>
          <tr><td style="padding:32px">
            <h1 style="margin:0 0 12px;font-size:24px;color:#0b2530">${escapeHtml(heading)}</h1>
            <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#365361">${escapeHtml(intro)}</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #dce8e9;border-bottom:1px solid #dce8e9;margin-bottom:24px">${rows}</table>
            <a href="${baseUrl()}/portal" style="display:inline-block;background:#0d9488;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 28px;border-radius:999px;font-size:15px">${escapeHtml(button)}</a>
            <p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:#5b7480">${escapeHtml(note)}</p>
          </td></tr>
          <tr><td style="padding:20px 32px;background:#f2f7f7;color:#5b7480;font-size:12px;line-height:1.6">
            ${escapeHtml(siteConfig.name)} &middot; ${escapeHtml(siteConfig.contact.address.street)}, ${escapeHtml(siteConfig.contact.address.city)}, ${escapeHtml(siteConfig.contact.address.region)}<br>
            In a medical emergency, call 911.
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

function plain(heading: string, intro: string, data: BookingEmailData, note: string): string {
  const rows = detailRows(data)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
  return `${heading}\n\n${intro}\n\n${rows}\n\nView in your portal: ${baseUrl()}/portal\n\n${note}\n\nIn a medical emergency, call 911.`;
}

function build(subject: string, heading: string, intro: string, data: BookingEmailData, note: string, button?: string): EmailContent {
  return {
    subject,
    html: render({ preheader: intro, heading, intro, data, note, button }),
    text: plain(heading, intro, data, note),
  };
}

export function bookingRequestedEmail(data: BookingEmailData): EmailContent {
  return build(
    `We received your request with ${data.doctorName}`,
    "Appointment requested",
    `Hi ${firstName(data.patientName)}, your time with ${data.doctorName} is held for you. We will email you again as soon as it is confirmed.`,
    data,
    "Plans changed? You can cancel from your patient portal.",
  );
}

export function bookingConfirmedEmail(data: BookingEmailData): EmailContent {
  return build(
    `Confirmed: ${whenText(data)}`,
    "Your appointment is confirmed",
    `Hi ${firstName(data.patientName)}, ${data.doctorName} has confirmed your visit. We look forward to seeing you.`,
    data,
    data.visitType === "video"
      ? "Video visit details will be shared before your appointment. Please be ready a few minutes early."
      : "Please arrive about 10 minutes early and bring a photo ID and your insurance card.",
  );
}

export function bookingCancelledEmail(data: BookingEmailData, cancelledBy: "patient" | "clinic"): EmailContent {
  return build(
    "Your appointment was cancelled",
    "Appointment cancelled",
    cancelledBy === "patient"
      ? `Hi ${firstName(data.patientName)}, as you asked, we have cancelled your visit with ${data.doctorName}.`
      : `Hi ${firstName(data.patientName)}, we are sorry, but ${data.doctorName} is not able to see you at this time and the visit has been cancelled.`,
    data,
    "You can book a new time whenever you like.",
    "Book a new time",
  );
}

export function bookingReminderEmail(data: BookingEmailData): EmailContent {
  return build(
    `Reminder: ${whenText(data)} with ${data.doctorName}`,
    "Your appointment is coming up",
    `Hi ${firstName(data.patientName)}, this is a friendly reminder about your visit with ${data.doctorName}.`,
    data,
    "Need to change plans? Please cancel from your portal so someone else can use the time.",
  );
}
