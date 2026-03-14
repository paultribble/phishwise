import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { generatePhishingEmail } from "@/lib/email-template";
import { z } from "zod";

const sendSimulationSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  templateId: z.string().min(1, "Template ID is required"),
});

/**
 * POST /api/simulations/send
 * Send a phishing simulation to a user manually
 * Requires MANAGER role
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is manager or admin
  if (session.user.role !== "MANAGER" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validation = sendSimulationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { userId, templateId } = validation.data;

    // Verify user exists and is in manager's school (if manager)
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, schoolId: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (session.user.role === "MANAGER") {
      const manager = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { schoolId: true },
      });

      if (manager?.schoolId !== targetUser.schoolId) {
        return NextResponse.json(
          { error: "Cannot send to user in different school" },
          { status: 403 }
        );
      }
    }

    // Get template
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: { module: true },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Create simulation record
    const simulation = await prisma.simulationEmail.create({
      data: {
        userId,
        templateId,
        sentAt: new Date(),
        status: "sent",
      },
    });

    // Generate email with tracking link
    const trackingUrl = `${process.env.NEXTAUTH_URL}/api/track/click/${simulation.trackingToken}`;

    const htmlContent = generatePhishingEmail({
      subject: template.subject,
      fromAddress: template.fromAddress || "security@verify-account.com",
      body: template.body,
      trackingLink: trackingUrl,
    });

    // Send email
    await sendEmail({
      to: targetUser.email,
      subject: template.subject,
      html: htmlContent,
      from: template.fromAddress || "PhishWise <noreply@phishwise.app>",
    });

    // Record history
    await prisma.userHistory.create({
      data: {
        userId,
        actionType: "simulation_sent",
        detail: `Sent: ${template.name} (Module: ${template.module.name})`,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Simulation sent to ${targetUser.email}`,
        simulation: { id: simulation.id, trackingToken: simulation.trackingToken },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/simulations/send] Error:", error);
    return NextResponse.json(
      { error: "Failed to send simulation" },
      { status: 500 }
    );
  }
}
