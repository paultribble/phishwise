import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    logger.warn('Unauthorized test email attempt', { route: '/api/demo/send-test-email', ip: req.headers.get('x-forwarded-for') ?? undefined });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit: 10 test emails per day per user
  const { success } = await checkRateLimit(`demo_user_${session.user.email}`, 10, 86400000);
  if (!success) {
    return NextResponse.json(
      { error: "Too many test emails. Try again later" },
      { status: 429 }
    );
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
      replyTo: "security@phishwise-demo.com",
    });

    logger.info('Test email requested', { route: '/api/demo/send-test-email', userId: session.user.email });
    return NextResponse.json({ success: true, message: "Email sent" });
  } catch (error) {
    logger.error("Demo email error", { route: '/api/demo/send-test-email', error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
