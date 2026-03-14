/**
 * Email template generator for phishing simulations
 * Creates realistic HTML emails for testing
 */

export interface EmailTemplateData {
  subject: string;
  fromAddress: string;
  body: string;
  trackingLink: string;
}

export function generatePhishingEmail(data: EmailTemplateData): string {
  const { subject, fromAddress, body, trackingLink } = data;

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
                <div style="color: #333; font-size: 14px; line-height: 1.6;">
                    ${body}
                </div>
                <p style="margin-top: 20px; text-align: center;">
                    <a href="${trackingLink}" style="display: inline-block; padding: 10px 20px; background-color: #1D4ED8; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
                        Click Here
                    </a>
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; background-color: #f9f9f9; border-top: 1px solid #eee; text-align: center; font-size: 11px; color: #999;">
                <p style="margin: 0;">PhishWise Simulation - This is a training exercise</p>
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
