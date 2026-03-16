import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { randomBytes } from "crypto";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = schema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return 200 to prevent email enumeration
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // Delete any existing reset tokens for this email
    await prisma.authToken.deleteMany({
      where: { email, type: "reset" },
    });

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.authToken.create({
      data: { email, token, type: "reset", expiresAt },
    });

    // Build environment-aware URL
    let baseUrl = process.env.NEXTAUTH_URL;
    if (!baseUrl && process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`;
    }
    if (!baseUrl) {
      baseUrl = "http://localhost:3000";
    }

    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    // Bulletproof HTML email template (table-based, works on all clients)
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PhishWise Password Reset</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f5f5; font-family:Arial,sans-serif;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding:40px; text-align:center; border-radius:8px 8px 0 0;">
              <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:bold;">PhishWise</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 20px 0; font-size:24px; color:#1f2937; font-weight:bold;">Reset your password</h2>
              <p style="margin:0 0 20px 0; font-size:14px; color:#555; line-height:1.6;">
                We received a request to reset the password for your PhishWise account. Click the button below to set a new password. This link expires in <strong>1 hour</strong>.
              </p>

              <!-- Button - Bulletproof -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                <tr>
                  <td style="background-color:#2563eb; padding:14px 32px; border-radius:6px; text-align:center;">
                    <a href="${resetUrl}" style="color:#ffffff; text-decoration:none; font-weight:bold; font-size:16px; display:block;">Reset Password</a>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:20px 0 0 0; font-size:12px; color:#666;">
                If the button doesn't work, <a href="${resetUrl}" style="color:#2563eb; text-decoration:underline;">click here to reset your password</a>.
              </p>

              <!-- Footer message -->
              <p style="margin:25px 0 0 0; font-size:12px; color:#999; border-top:1px solid #eee; padding-top:20px;">
                If you didn't request a password reset, you can safely ignore this email. Your password will not change.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px; background-color:#f5f5f5; border-top:1px solid #eee; text-align:center; font-size:11px; color:#999; border-radius:0 0 8px 8px;">
              PhishWise Security Awareness Training<br>
              University of Arkansas CSCE Capstone
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await sendEmail({
      to: email,
      subject: "Reset your PhishWise password",
      html,
      fromName: "PhishWise",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
