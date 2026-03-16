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
 * Sends a simulation email with tracking.
 * - Replaces {{USER_NAME}} with the user's name
 * - Replaces {{ACTION_URL}} with the click tracking URL
 * - Injects a tracking pixel for open detection
 *
 * IMPORTANT: The htmlBody MUST contain {{ACTION_URL}} placeholder
 * which will be replaced with the actual tracking URL
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

    // Determine the base URL for tracking links (environment-aware for preview/production)
    // NEXTAUTH_URL is set in production and staging Vercel deployments
    // VERCEL_URL is auto-set by Vercel for preview branches and production
    // This ensures emails redirect to the correct environment
    let baseUrl = process.env.NEXTAUTH_URL;

    // Fallback to VERCEL_URL if NEXTAUTH_URL is not explicitly set
    // VERCEL_URL format: "project-name-xxxxx.vercel.app"
    if (!baseUrl && process.env.VERCEL_URL) {
      // Ensure HTTPS for all Vercel URLs
      baseUrl = `https://${process.env.VERCEL_URL}`;
    }

    // Final fallback for local development
    if (!baseUrl) {
      baseUrl = "http://localhost:3000";
    }

    // Build the absolute click tracking URL
    // When user clicks this link in email → hits /api/track/click/[token] → redirects to caught page
    const clickUrl = clickTrackingUrl || `${baseUrl}/api/track/click/${trackingToken}`;

    // Replace template placeholders with actual values
    let processedHtml = htmlBody
      .replace(/\{\{USER_NAME\}\}/g, escapeHtml(userName))
      .replace(/\{\{ACTION_URL\}\}/g, clickUrl)
      .replace(/\{\{PHISHING_LINK\}\}/g, clickUrl) // backwards compatibility
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
