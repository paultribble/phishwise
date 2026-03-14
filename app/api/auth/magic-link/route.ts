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

    // Delete any existing magic tokens for this email
    await prisma.authToken.deleteMany({
      where: { email, type: "magic" },
    });

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    await prisma.authToken.create({
      data: { email, token, type: "magic", expiresAt },
    });

    const signinUrl = `${process.env.NEXTAUTH_URL}/magic-signin?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Your PhishWise sign-in link",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0f1929;color:#e2e8f0;border-radius:12px;">
          <img src="${process.env.NEXTAUTH_URL}/logo.jpg" alt="PhishWise" style="height:40px;margin-bottom:24px;" />
          <h2 style="color:#fff;margin:0 0 12px;">Sign in to PhishWise</h2>
          <p style="color:#94a3b8;margin:0 0 24px;">
            Click the button below to sign in to your PhishWise account.
            This link expires in <strong style="color:#60a5fa;">30 minutes</strong> and can only be used once.
          </p>
          <a href="${signinUrl}"
            style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;
                   text-decoration:none;border-radius:8px;font-weight:600;">
            Sign In to PhishWise
          </a>
          <p style="color:#475569;font-size:13px;margin-top:24px;">
            If you didn't request this link, you can safely ignore this email.
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
