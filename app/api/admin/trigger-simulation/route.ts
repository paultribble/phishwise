import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendPhishingEmail } from "@/lib/email/send";
import { generateTrackingToken, getRecentTemplateIds, selectTemplate } from "@/lib/scheduler/logic";

/**
 * POST /api/admin/trigger-simulation
 * Manually trigger a phishing simulation for a specific user.
 * Requires admin role or email in ADMIN_EMAILS.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // Check admin authorization
  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
  const isAdmin = session?.user?.role === "ADMIN" || adminEmails.includes(session?.user?.email || "");

  if (!isAdmin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { school: true },
    });

    if (!user || !user.school) {
      return NextResponse.json(
        { error: "User or school not found" },
        { status: 404 }
      );
    }

    if (!user.email) {
      return NextResponse.json(
        { error: "User has no email address" },
        { status: 400 }
      );
    }

    // Select template
    const recentIds = await getRecentTemplateIds(user.id);
    const template = await selectTemplate(user.id, recentIds);

    if (!template) {
      return NextResponse.json(
        { error: "No template available" },
        { status: 500 }
      );
    }

    // Get or create campaign
    let campaign = await prisma.campaign.findFirst({
      where: { schoolId: user.school.id },
    });

    if (!campaign) {
      campaign = await prisma.campaign.create({
        data: {
          schoolId: user.school.id,
          name: `Manual Trigger Campaign - ${new Date().toISOString()}`,
          scheduleType: "manual",
          status: "active",
        },
      });
    }

    // Generate token and create simulation
    const token = generateTrackingToken();
    const simEmail = await prisma.simulationEmail.create({
      data: {
        userId: user.id,
        campaignId: campaign.id,
        templateId: template.id,
        token,
        status: "sent",
      },
    });

    // Send the email
    const sendResult = await sendPhishingEmail({
      to: user.email,
      userName: user.name || "User",
      subject: template.subject,
      htmlBody: template.body,
      trackingToken: token,
      fromAddress: template.fromAddress ?? undefined,
    });

    if (!sendResult.success) {
      await prisma.simulationEmail.update({
        where: { id: simEmail.id },
        data: { status: "failed" },
      });

      return NextResponse.json(
        { error: `Failed to send email: ${sendResult.error}` },
        { status: 500 }
      );
    }

    // Update user's lastSimulation
    await prisma.user.update({
      where: { id: user.id },
      data: { lastSimulation: new Date() },
    });

    // Update metrics and history
    await prisma.userMetrics.upsert({
      where: { userId: user.id },
      update: { totalSent: { increment: 1 }, lastActivity: new Date() },
      create: { userId: user.id, totalSent: 1 },
    });

    await prisma.userHistory.create({
      data: {
        userId: user.id,
        actionType: "simulation_sent",
        detail: "Manual trigger by admin",
      },
    });

    return NextResponse.json({
      success: true,
      simulationId: simEmail.id,
      message: `Phishing simulation sent to ${email}`,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Trigger simulation error:", error);
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
