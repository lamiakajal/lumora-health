export type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export type SendResult = { sent: boolean; reason?: string };

const DEFAULT_FROM = "Lumora Health <onboarding@resend.dev>";

/**
 * Sends one email through Resend's HTTP API. It never throws: a failed email must
 * not break a booking. Without RESEND_API_KEY it only logs, which is handy in development.
 */
export async function sendEmail(message: EmailMessage): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info(`[email not sent: RESEND_API_KEY is not set] to=${message.to} subject="${message.subject}"`);
    return { sent: false, reason: "not-configured" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || DEFAULT_FROM,
        to: [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
      }),
    });

    if (!response.ok) {
      console.error("[email failed]", response.status, await response.text());
      return { sent: false, reason: `http-${response.status}` };
    }
    return { sent: true };
  } catch (error) {
    console.error("[email failed]", error);
    return { sent: false, reason: "network" };
  }
}
