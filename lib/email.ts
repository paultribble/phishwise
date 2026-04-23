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

export async function sendUserPhishClickAlert(
  to: string,
  userName: string,
  moduleName: string,
  trainingUrl: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0c1220; color: #f1f5f9; padding: 32px; border-radius: 12px;">
      <div style="border-left: 4px solid #ef4444; padding-left: 16px; margin-bottom: 24px;">
        <h1 style="color: #ef4444; margin: 0 0 8px;">⚠️ Security Alert</h1>
        <p style="color: #94a3b8; margin: 0;">PhishWise Training Notification</p>
      </div>
      <p style="color: #f1f5f9;">Hi ${userName},</p>
      <p style="color: #94a3b8; line-height: 1.6;">
        You clicked a link in a <strong style="color: #f1f5f9;">simulated phishing email</strong> sent by your organization through PhishWise.
        Don't worry — this is a training exercise designed to help you recognize phishing attacks.
      </p>
      <p style="color: #94a3b8; line-height: 1.6;">
        Real phishing emails can steal your credentials, install malware, or compromise company data.
        The good news: you've been assigned training to help you spot these threats in the future.
      </p>
      <div style="background: #111827; border: 1px solid #1e3058; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <p style="color: #22d3ee; font-weight: bold; margin: 0 0 8px;">📚 Your training module: ${moduleName}</p>
        <p style="color: #94a3b8; margin: 0 0 16px; font-size: 14px;">Complete this training to improve your security awareness score.</p>
        <a href="${trainingUrl}" style="background: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
          Start Training →
        </a>
      </div>
      <p style="color: #475569; font-size: 12px; margin-top: 24px;">
        This notification was sent by PhishWise as part of your organization's security awareness program.
      </p>
    </div>
  `;

  await sendEmail({
    to,
    subject: "⚠️ Security Alert: You clicked a simulated phishing link",
    html,
    fromName: "PhishWise Security",
  });
}

export async function sendManagerPhishAlert(
  to: string,
  managerName: string,
  userName: string,
  templateName: string,
  schoolName: string,
  trainingUrl: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0c1220; color: #f1f5f9; padding: 32px; border-radius: 12px;">
      <div style="border-left: 4px solid #f59e0b; padding-left: 16px; margin-bottom: 24px;">
        <h1 style="color: #f59e0b; margin: 0 0 8px;">📊 Phishing Alert</h1>
        <p style="color: #94a3b8; margin: 0;">Manager Notification — ${schoolName}</p>
      </div>
      <p style="color: #f1f5f9;">Hi ${managerName},</p>
      <p style="color: #94a3b8; line-height: 1.6;">
        A member of your team clicked a link in a simulated phishing email.
      </p>
      <div style="background: #111827; border: 1px solid #1e3058; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <p style="margin: 0 0 8px; color: #94a3b8; font-size: 14px;">USER</p>
        <p style="margin: 0 0 16px; color: #f1f5f9; font-weight: bold;">${userName}</p>
        <p style="margin: 0 0 8px; color: #94a3b8; font-size: 14px;">TEMPLATE</p>
        <p style="margin: 0 0 16px; color: #f1f5f9; font-weight: bold;">${templateName}</p>
        <p style="margin: 0 0 8px; color: #94a3b8; font-size: 14px;">STATUS</p>
        <p style="margin: 0; color: #f59e0b; font-weight: bold;">Training Assigned Automatically</p>
      </div>
      <p style="color: #94a3b8; line-height: 1.6;">
        Training has been automatically assigned. You can track their progress in your manager dashboard.
      </p>
      <a href="${trainingUrl}" style="background: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 8px;">
        View Manager Dashboard →
      </a>
      <p style="color: #475569; font-size: 12px; margin-top: 24px;">
        Sent by PhishWise on behalf of ${schoolName}.
      </p>
    </div>
  `;

  await sendEmail({
    to,
    subject: `[PhishWise] ${userName} clicked a phishing simulation`,
    html,
    fromName: "PhishWise Security",
  });
}
