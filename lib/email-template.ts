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

  // Replace placeholder text in body with actual clickable links
  const bodyWithLinks = body
    .replace(/\[([^\]]+)\]/g, (match, linkText) => {
      return `<a href="${trackingLink}" style="color: #1D4ED8; text-decoration: underline; font-weight: bold;">${escapeHtml(linkText)}</a>`;
    });

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(subject)}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
    <table style="max-width: 600px; margin: 0 auto; background-color: white; border-collapse: collapse;">
        <tr>
            <td style="padding: 20px; border-bottom: 1px solid #eee;">
                <p style="margin: 0; color: #666; font-size: 12px;">From: <strong>${escapeHtml(fromAddress)}</strong></p>
                <p style="margin: 10px 0 0 0; color: #666; font-size: 12px;">Subject: ${escapeHtml(subject)}</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 30px 20px;">
                ${userName ? `<p style="margin: 0 0 15px 0; color: #333; font-size: 14px;">Hello ${escapeHtml(userName)},</p>` : ""}
                <div style="color: #333; font-size: 14px; line-height: 1.6;">
                    ${bodyWithLinks}
                </div>
            </td>
        </tr>
    </table>
</body>
</html>
  `.trim();
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
