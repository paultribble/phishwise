import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { email } = await req.json();
    const targetEmail = email || session.user.email;

    const trackingToken = `demo-token-${Date.now()}`;
    const trackingUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/track?token=${trackingToken}`;

    const html = `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <p>Hello,</p>
        <p>We detected an unusual sign-in attempt on your account from a new device.</p>
        <p>For your protection, access to your account has been temporarily limited. 
        Please verify your identity to restore full access.</p>
        <p>
          <a href="${trackingUrl}" style="background:#1d4ed8;color:white;padding:12px 24px;text-decoration:none;border-radius:4px;display:inline-block;">
            Verify your account now
          </a>
        </p>
        <p>If no action is taken within 24 hours, your account may be suspended.</p>
        <p>Account Security Team</p>
      </div>
    `;

    await sendEmail({
      to: targetEmail,
      subject: "Unusual Sign-In Attempt Detected",
      html,
      from: "PhishWise Security <security@phishwise-demo.com>",
    });

    return NextResponse.json({ success: true, message: "Email sent" });
  } catch (error) {
    console.error("Demo email error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
