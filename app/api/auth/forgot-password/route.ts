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

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Reset your PhishWise password",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0f1929;color:#e2e8f0;border-radius:12px;">
          <img src="${process.env.NEXTAUTH_URL}/logo.jpg" alt="PhishWise" style="height:40px;margin-bottom:24px;" />
          <h2 style="color:#fff;margin:0 0 12px;">Reset your password</h2>
          <p style="color:#94a3b8;margin:0 0 24px;">
            We received a request to reset the password for your PhishWise account.
            Click the button below to set a new password. This link expires in 1 hour.
          </p>
          <a href="${resetUrl}"
            style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;
                   text-decoration:none;border-radius:8px;font-weight:600;">
            Reset Password
          </a>
          <p style="color:#475569;font-size:13px;margin-top:24px;">
            If you didn't request this, you can safely ignore this email.
            Your password will not change.
          </p>
          <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;" />
          <p style="color:#334155;font-size:12px;">PhishWise · University of Arkansas Capstone</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
