import crypto from 'crypto';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  fromName?: string; // Friendly name for the sender (e.g., "Amazon Account Security")
  isSimulation?: boolean;
  userId?: string;
}

/**
 * Generates an HMAC-signed unsubscribe token for a user.
 * Token format: userId.timestamp.signature
 * Valid for 30 days.
 */
export function generateUnsubscribeToken(userId: string): string {
  const timestamp = Date.now().toString();
  const message = `${userId}.${timestamp}`;
  const signature = crypto
    .createHmac('sha256', process.env.NEXTAUTH_SECRET || '')
    .update(message)
    .digest('hex');
  return `${message}.${signature}`;
}

/**
 * Sends an email using Resend.
 * Requires RESEND_API_KEY environment variable.
 *
 * From address: Uses verified domain (noreply@phishwise.org)
 * From name: Friendly name displayed to recipient (e.g., "Amazon Account Security")
 * Reply-To address (optional): Custom spoofed address for realistic phishing simulation
 *
 * For phishing simulations:
 * - fromName: "Amazon Account Security" (displays to recipient)
 * - replyTo: "security@amazon.com" (visible if recipient replies, spoofed)
 * - from: "Amazon Account Security <noreply@phishwise.org>" (Resend format)
 *
 * Email displays as:
 * From: Amazon Account Security <noreply@phishwise.org>
 * Reply-To: security@amazon.com
 *
 * This maximizes phishing realism while keeping Resend's verified domain requirement.
 */
export async function sendEmail({ to, subject, html, replyTo, fromName, isSimulation, userId }: SendEmailOptions) {
  // Verified domain for Resend (must be validated in Resend console)
  const baseEmail = "noreply@phishwise.org";

  // Format from field with friendly name
  const fromField = fromName ? `${fromName} <${baseEmail}>` : baseEmail;

  // Verify Resend API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.warn("[Email] RESEND_API_KEY not configured. Email not sent:");
    console.warn({ to, subject, from: fromField, replyTo });
    return;
  }

  // Send via Resend
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const sendOptions: any = {
      from: fromField,
      to,
      subject,
      html,
    };

    // Add reply-to for spoofed address (visible to recipient)
    if (replyTo) {
      sendOptions.reply_to = replyTo;
    }

    // Append unsubscribe footer for simulation emails
    if (isSimulation && userId) {
      const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
      const unsubToken = generateUnsubscribeToken(userId);
      const unsubUrl = `${baseUrl}/api/users/unsubscribe?token=${unsubToken}`;
      sendOptions.html += `<p style="font-size:11px; color:#666; margin-top:24px; border-top:1px solid #eee; padding-top:16px;">This is a phishing awareness simulation from PhishWise.<br><a href="${unsubUrl}">Unsubscribe from simulations</a></p>`;
    }

    await resend.emails.send(sendOptions);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new Error(`Resend error: ${errorMsg}`);
  }
}
