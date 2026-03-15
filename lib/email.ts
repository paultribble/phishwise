interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Sends an email using Resend.
 * Requires RESEND_API_KEY environment variable.
 *
 * Sender address priority:
 * 1. Provided `from` parameter (custom phishing template address for realistic spoofing)
 * 2. SENDER_EMAIL environment variable
 * 3. Default "noreply@phishwise.app"
 *
 * Note: Domain must be verified in Resend console for custom sender addresses.
 * Use spoofed addresses like "security@account-support.com" to simulate realistic phishing emails.
 */
export async function sendEmail({ to, subject, html, from }: SendEmailOptions) {
  // Determine sender address with priority chain
  const senderAddress =
    from ||
    process.env.SENDER_EMAIL ||
    "noreply@phishwise.app";

  // Verify Resend API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.warn("[Email] RESEND_API_KEY not configured. Email not sent:");
    console.warn({ to, subject, from: senderAddress });
    return;
  }

  // Send via Resend
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: senderAddress,
      to,
      subject,
      html,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new Error(`Resend error: ${errorMsg}`);
  }
}
