import { sendEmail } from "@/lib/email";

interface PhishingEmailOptions {
  to: string;
  userName: string;
  subject: string;
  htmlBody: string;
  trackingToken: string;
  fromAddress?: string;
  clickTrackingUrl?: string;
}

/**
 * Sends a phishing simulation email with tracking.
 * - Replaces {{USER_NAME}} with the user's name
 * - Replaces {{PHISHING_LINK}} with the click tracking URL
 * - Injects a tracking pixel for open detection
 *
 * IMPORTANT: The htmlBody MUST contain {{PHISHING_LINK}} placeholder
 * which will be replaced with the actual tracking URL that redirects back to PhishWise
 */
export async function sendPhishingEmail({
  to,
  userName,
  subject,
  htmlBody,
  trackingToken,
  fromAddress,
  clickTrackingUrl,
}: PhishingEmailOptions) {
  try {
    // Validate required fields
    if (!to || !subject || !htmlBody || !trackingToken) {
      return {
        success: false,
        error: "Missing required fields: to, subject, htmlBody, or trackingToken",
      };
    }

    // Determine the base URL for tracking links
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    // Build the click tracking URL if not provided
    // This URL will be what the phishing link redirects to, which then redirects to training
    const clickUrl = clickTrackingUrl || `${baseUrl}/api/track/click/${trackingToken}`;

    // Replace template placeholders with actual values
    let processedHtml = htmlBody
      .replace(/\{\{USER_NAME\}\}/g, escapeHtml(userName))
      .replace(/\{\{PHISHING_LINK\}\}/g, clickUrl)
      .replace(/\{\{tracking_url\}\}/g, clickUrl);

    // Inject tracking pixel for open detection (before closing body tag)
    const openPixelUrl = `${baseUrl}/api/track/open/${trackingToken}`;
    const trackingPixel = `<img src="${openPixelUrl}" width="1" height="1" alt="" style="display:none;" />`;

    if (processedHtml.includes("</body>")) {
      processedHtml = processedHtml.replace("</body>", `${trackingPixel}</body>`);
    } else {
      processedHtml += trackingPixel;
    }

    // Send the email
    // Use the provided from address (spoofed), or fall back to default
    const replyToAddress = fromAddress || "security@verify-account.com";

    await sendEmail({
      to,
      subject,
      html: processedHtml,
      replyTo: replyToAddress,
    });

    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMsg };
  }
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
