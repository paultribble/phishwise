/**
 * Email template generator for phishing simulations
 * Creates realistic HTML emails for testing
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

  // Replace {{USER_NAME}} placeholders with actual user name (for compatibility with HTML templates)
  const bodyWithPersonalization = body.replace(/\{\{USER_NAME\}\}/g, userName ? escapeHtml(userName) : 'Valued User');

  // Replace all href="#" with actual tracking links (for HTML button templates)
  const bodyWithLinks = bodyWithPersonalization.replace(/href="#"/g, `href="${trackingLink}"`);

  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(subject)}</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: white; }
        .email-header { padding: 20px; border-bottom: 1px solid #eee; }
        .email-body { padding: 30px 20px; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <p style="margin: 0; color: #666; font-size: 12px;">From: <strong>${escapeHtml(fromAddress)}</strong></p>
            <p style="margin: 10px 0 0 0; color: #666; font-size: 12px;">Subject: ${escapeHtml(subject)}</p>
        </div>
        <div class="email-body">
            ${bodyWithLinks}
        </div>
    </div>
</body>
</html>`.trim();
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
