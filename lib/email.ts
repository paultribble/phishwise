interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Sends an email using SendGrid.
 * Requires SENDGRID_API_KEY environment variable.
 *
 * Sender address priority:
 * 1. Provided `from` parameter (custom phishing template address)
 * 2. SENDER_EMAIL environment variable
 * 3. Default "noreply@phishwise.app"
 *
 * Note: All sender addresses must be verified in SendGrid
 */
export async function sendEmail({ to, subject, html, from }: SendEmailOptions) {
  // Determine sender address with priority chain
  const senderAddress =
    from ||
    process.env.SENDER_EMAIL ||
    "noreply@phishwise.app";

  // Verify SendGrid API key is configured
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("[Email] SENDGRID_API_KEY not configured. Email not sent:");
    console.warn({ to, subject, from: senderAddress });
    return;
  }

  // Send via SendGrid
  try {
    const sgMail = await import("@sendgrid/mail");
    sgMail.default.setApiKey(process.env.SENDGRID_API_KEY);

    await sgMail.default.send({
      to,
      from: senderAddress,
      subject,
      html,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new Error(`SendGrid error: ${errorMsg}`);
  }
}
