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
    // Build the click tracking URL if not provided
    const clickUrl = clickTrackingUrl || `/api/track/click/${trackingToken}`;

    // Replace template placeholders
    let processedHtml = htmlBody
      .replace(/\{\{USER_NAME\}\}/g, userName)
      .replace(/\{\{PHISHING_LINK\}\}/g, clickUrl)
      .replace(/\{\{tracking_url\}\}/g, clickUrl);

    // Inject tracking pixel for open detection (before closing body tag)
    const openPixelUrl = `/api/track/open/${trackingToken}`;
    const trackingPixel = `<img src="${openPixelUrl}" width="1" height="1" alt="" style="display:none;" />`;

    if (processedHtml.includes("</body>")) {
      processedHtml = processedHtml.replace("</body>", `${trackingPixel}</body>`);
    } else {
      processedHtml += trackingPixel;
    }

    // Send the email
    await sendEmail({
      to,
      subject,
      html: processedHtml,
      from: fromAddress || "PhishWise <noreply@phishwise.app>",
    });

    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMsg };
  }
}
