/**
 * Email template generator for phishing simulations
 * Replaces all placeholders: {{USER_NAME}}, {{ACTION_URL}}, {{DATE}}, {{TIME}}, {{LOCATION}}, {{DEVICE}}
 * Supports bulletproof table-based HTML templates with inline styles
 */

export interface EmailTemplateData {
  subject: string;
  fromAddress: string;
  body: string;
  trackingLink: string;
  userName?: string;
}

export function generatePhishingEmail(data: EmailTemplateData): string {
  const { subject, fromAddress, body, trackingLink, userName } = data;

  // Generate timestamp info
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  // Replace all template placeholders
  let processedBody = body
    // User personalization
    .replace(/\{\{USER_NAME\}\}/g, userName ? escapeHtml(userName) : 'Valued User')
    // Tracking link - supports both bulletproof {{ACTION_URL}} and legacy href="#"
    .replace(/\{\{ACTION_URL\}\}/g, trackingLink)
    .replace(/\{\{PHISHING_LINK\}\}/g, trackingLink)
    .replace(/\{\{tracking_url\}\}/g, trackingLink)
    .replace(/href="#"/g, `href="${trackingLink}"`)
    // Time/location info
    .replace(/\{\{DATE\}\}/g, dateStr)
    .replace(/\{\{TIME\}\}/g, timeStr)
    .replace(/\{\{LOCATION\}\}/g, 'Unknown Location') // Client IP geolocation could be added here
    .replace(/\{\{DEVICE\}\}/g, 'Unknown Device'); // User-Agent parsing could be added here

  // Return the processed template as-is (bulletproof templates already have full HTML structure)
  // This preserves all table-based layouts and inline styles from the template
  return processedBody;
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
