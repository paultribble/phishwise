import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { logger } from "@/lib/logger";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const inviteSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "MANAGER") {
    logger.warn('Unauthorized invite attempt', { route: '/api/manager/invite', userId: session?.user?.id });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit: 5 invitations per hour per IP
  const ip = getClientIp(request);
  const { success } = await checkRateLimit(`invite_ip_${ip}`, 5, 3600000);
  if (!success) {
    return NextResponse.json(
      { error: "Too many invitations. Try again later" },
      { status: 429 }
    );
  }

  try {
    const manager = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { schoolId: true },
    });

    if (!manager?.schoolId) {
      return NextResponse.json({ error: "No school assigned" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = inviteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const school = await prisma.school.findUnique({
      where: { id: manager.schoolId },
      select: { name: true, inviteCode: true },
    });

    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    const signupUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/signup?invite=${school.inviteCode}`;

    await sendEmail({
      to: parsed.data.email,
      subject: `You've been invited to join ${school.name} on PhishWise`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>You've Been Invited!</h2>
          <p>You've been invited to join <strong>${school.name}</strong> on PhishWise, a phishing awareness training platform.</p>
          <p>Use the invite code below to join:</p>
          <div style="background: #f0f4ff; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${school.inviteCode}</span>
          </div>
          <p>Or click the link below to get started:</p>
          <p><a href="${signupUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Join ${school.name}</a></p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">If you did not expect this invitation, you can safely ignore this email.</p>
        </div>
      `,
    });

    logger.info('Invitation sent', { route: '/api/manager/invite', schoolId: manager.schoolId, email: parsed.data.email });
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Invite error", { route: '/api/manager/invite', error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: "Failed to send invitation" }, { status: 500 });
  }
}
