import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { generatePhishingEmail } from "@/lib/email-template";
import { z } from "zod";
import { errors } from "@/lib/errors";
import { apiLogger } from "@/lib/logger";

const log = apiLogger("/api/simulations/send");

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
    const e = errors.unauthorized();
    return NextResponse.json(e.toJSON(), { status: e.statusCode });
  }

  if (session.user.role !== "MANAGER" && session.user.role !== "ADMIN") {
    const e = errors.forbidden("Manager or Admin role required");
    return NextResponse.json(e.toJSON(), { status: e.statusCode });
  }

  try {
    const body = await request.json();
    const parsed = sendSimulationSchema.safeParse(body);
    if (!parsed.success) {
      log.warn({ userId: session.user.id, error: parsed.error.message }, "Validation failed");
      const e = errors.invalidInput(parsed.error.errors[0]?.message);
      return NextResponse.json(e.toJSON(), { status: e.statusCode });
    }
    const { userId, templateId } = parsed.data;

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, schoolId: true },
    });

    if (!targetUser) {
      const e = errors.notFound("User");
      return NextResponse.json(e.toJSON(), { status: e.statusCode });
    }

    if (session.user.role === "MANAGER") {
      const manager = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { schoolId: true },
      });

      if (manager?.schoolId !== targetUser.schoolId) {
        const e = errors.schoolMismatch();
        return NextResponse.json(e.toJSON(), { status: e.statusCode });
      }
    }

    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: { module: true },
    });

    if (!template) {
      const e = errors.notFound("Template");
      return NextResponse.json(e.toJSON(), { status: e.statusCode });
    }

    const simulation = await prisma.simulationEmail.create({
      data: {
        userId,
        templateId,
        sentAt: new Date(),
        status: "sent",
      },
    });

    const trackingUrl = `${process.env.NEXTAUTH_URL}/api/track/click/${simulation.trackingToken}`;

    const htmlContent = generatePhishingEmail({
      subject: template.subject,
      fromAddress: template.fromAddress || "security@verify-account.com",
      body: template.body,
      trackingLink: trackingUrl,
    });

    await sendEmail({
      to: targetUser.email,
      subject: template.subject,
      html: htmlContent,
      replyTo: template.fromAddress || "security@verify-account.com",
    });

    await prisma.userHistory.create({
      data: {
        userId,
        actionType: "simulation_sent",
        detail: `Sent: ${template.name} (Module: ${template.module.name})`,
      },
    });

    log.info({ sentBy: session.user.id, targetUserId: userId, simulationId: simulation.id }, "Simulation sent");
    return NextResponse.json(
      {
        success: true,
        message: `Simulation sent to ${targetUser.email}`,
        simulation: { id: simulation.id, trackingToken: simulation.trackingToken },
      },
      { status: 201 }
    );
  } catch (error) {
    log.error({ error: String(error) }, "Send simulation failed");
    const e = errors.internal();
    return NextResponse.json(e.toJSON(), { status: e.statusCode });
  }
}
