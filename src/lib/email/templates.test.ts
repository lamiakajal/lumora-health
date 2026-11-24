import { describe, expect, it } from "vitest";
import {
  bookingCancelledEmail,
  bookingConfirmedEmail,
  bookingReminderEmail,
  bookingRequestedEmail,
  escapeHtml,
  whenText,
  type BookingEmailData,
} from "./templates";

const data: BookingEmailData = {
  bookingId: "65f0c0ffee0123456789abcd",
  patientName: "Lamia Kajal",
  patientEmail: "lamia@example.com",
  doctorName: "Dr. Amelia Hart",
  specialty: "Primary Care",
  start: "2026-11-23T17:00:00.000Z",
  timezone: "America/Los_Angeles",
  visitType: "in-person",
  reason: "Annual check-up",
};

describe("escapeHtml", () => {
  it("escapes characters that could inject markup", () => {
    expect(escapeHtml(`<script>alert("x")</script> & 'y'`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;y&#39;",
    );
  });
});

describe("whenText", () => {
  it("shows the day, time and zone in the doctor's time zone", () => {
    expect(whenText(data)).toMatch(/^Mon, Nov 23 at 9:00\sAM PST$/);
  });
});

describe("booking emails", () => {
  it("greets the patient by first name and names the doctor in the request email", () => {
    const email = bookingRequestedEmail(data);
    expect(email.subject).toContain("Dr. Amelia Hart");
    expect(email.html).toContain("Hi Lamia");
    expect(email.text).toContain("Annual check-up");
    expect(email.html).toContain("/portal");
  });

  it("includes a short reference rather than the full database id", () => {
    const email = bookingConfirmedEmail(data);
    expect(email.html).toContain("0123456789ABCD".slice(-8));
    expect(email.html).not.toContain(data.bookingId);
  });

  it("gives video and in-person visits different advice", () => {
    expect(bookingConfirmedEmail({ ...data, visitType: "video" }).text).toContain("Video visit details");
    expect(bookingConfirmedEmail(data).text).toContain("arrive about 10 minutes early");
  });

  it("explains who cancelled", () => {
    expect(bookingCancelledEmail(data, "patient").text).toContain("as you asked");
    expect(bookingCancelledEmail(data, "clinic").text).toContain("not able to see you");
  });

  it("starts the reminder subject with Reminder", () => {
    expect(bookingReminderEmail(data).subject).toMatch(/^Reminder:/);
  });

  it("escapes patient-supplied text in the HTML", () => {
    const email = bookingRequestedEmail({ ...data, patientName: "<b>Evil</b>", reason: "<img src=x onerror=1>" });
    expect(email.html).not.toContain("<b>Evil</b>");
    expect(email.html).not.toContain("<img src=x");
    expect(email.html).toContain("&lt;img");
  });
});
