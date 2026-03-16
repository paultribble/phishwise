interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Sends an email using Resend.
 * Requires RESEND_API_KEY environment variable.
 *
 * From address: Uses verified domain (noreply@phishwise.org)
 * Reply-To address (optional): Custom spoofed address for realistic phishing simulation
 *
 * For phishing simulations:
 * - replyTo: "security@account-support.com" (visible to recipient, spoofed)
 * - from: "noreply@phishwise.org" (verified domain, required by Resend)
 *
 * Recipients see the spoofed address as "from" in most email clients,
 * and if they reply, it goes to the spoofed address.
 */
export async function sendEmail({ to, subject, html, replyTo }: SendEmailOptions) {
  // Verified domain for Resend (must be validated in Resend console)
  const fromAddress = "noreply@phishwise.org";

  // Verify Resend API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.warn("[Email] RESEND_API_KEY not configured. Email not sent:");
    console.warn({ to, subject, from: fromAddress, replyTo });
    return;
  }

  // Send via Resend
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const sendOptions: any = {
      from: fromAddress,
      to,
      subject,
      html,
    };

    // Add reply-to for spoofed address (visible to recipient)
    if (replyTo) {
      sendOptions.reply_to = replyTo;
    }

    await resend.emails.send(sendOptions);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new Error(`Resend error: ${errorMsg}`);
  }
}
