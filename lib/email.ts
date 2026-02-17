interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Sends an email using either Resend (development) or SendGrid (production).
 * Configure via RESEND_API_KEY or SENDGRID_API_KEY environment variables.
 */
export async function sendEmail({ to, subject, html, from }: SendEmailOptions) {
  const defaultFrom = "PhishWise <noreply@phishwise.app>";

  // Use Resend in development
  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: from ?? defaultFrom,
      to,
      subject,
      html,
    });

    if (error) {
      throw new Error(`Resend error: ${error.message}`);
    }
    return;
  }

  // Use SendGrid in production
  if (process.env.SENDGRID_API_KEY) {
    const sgMail = await import("@sendgrid/mail");
    sgMail.default.setApiKey(process.env.SENDGRID_API_KEY);

    await sgMail.default.send({
      to,
      from: from ?? defaultFrom,
      subject,
      html,
    });
    return;
  }

  // Fallback: log to console in development
  console.warn("[Email] No email provider configured. Email not sent:");
  console.warn({ to, subject, from: from ?? defaultFrom });
}
