import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendPhishingEmail } from "@/lib/email/send";
import { generateTrackingToken, getRecentTemplateIds, selectTemplate } from "@/lib/scheduler/logic";
import { z } from "zod";
import { errors } from "@/lib/errors";
import { apiLogger } from "@/lib/logger";

const log = apiLogger("/api/admin/trigger-simulation");
const schema = z.object({ email: z.string().email("Valid email is required") });

/**
 * POST /api/admin/trigger-simulation
 * Manually trigger a phishing simulation for a specific user.
 * Requires MANAGER or ADMIN role, and must belong to the same school.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !["MANAGER", "ADMIN"].includes(session.user.role)) {
    const e = errors.forbidden("Manager or Admin role required");
    return NextResponse.json(e.toJSON(), { status: e.statusCode });
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      log.warn({ userId: session.user.id, error: parsed.error.message }, "Validation failed");
      const e = errors.invalidInput("email");
      return NextResponse.json(e.toJSON(), { status: e.statusCode });
    }
    const { email } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { school: true },
    });

    if (!user || !user.school) {
      const e = errors.notFound("User or school");
      return NextResponse.json(e.toJSON(), { status: e.statusCode });
    }

    if (!user.email) {
      const e = errors.invalidInput("User has no email address");
      return NextResponse.json(e.toJSON(), { status: e.statusCode });
    }

    if (session.user.role === "MANAGER") {
      const manager = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { schoolId: true },
      });
      if (manager?.schoolId !== user.schoolId) {
        const e = errors.schoolMismatch();
        return NextResponse.json(e.toJSON(), { status: e.statusCode });
      }
    }

    const recentIds = await getRecentTemplateIds(user.id);
    const template = await selectTemplate(user.id, recentIds);

    if (!template) {
      const e = errors.noTemplate();
      return NextResponse.json(e.toJSON(), { status: e.statusCode });
    }

    let campaign = await prisma.campaign.findFirst({
      where: { schoolId: user.school.id },
    });

    if (!campaign) {
      campaign = await prisma.campaign.create({
        data: {
          schoolId: user.school.id,
          name: `Ongoing Security Awareness`,
          scheduleType: "manual",
        },
      });
    }

    const token = generateTrackingToken();
    const simEmail = await prisma.simulationEmail.create({
      data: {
        userId: user.id,
        campaignId: campaign.id,
        templateId: template.id,
        trackingToken: token,
      },
    });

    const sendResult = await sendPhishingEmail({
      to: user.email,
      userName: user.name || "User",
      subject: template.subject,
      htmlBody: template.body,
      trackingToken: token,
      fromAddress: template.fromAddress || undefined,
    });

    if (!sendResult.success) {
      const e = errors.emailFailed(sendResult.error);
      return NextResponse.json(e.toJSON(), { status: e.statusCode });
    }

    await prisma.userMetrics.upsert({
      where: { userId: user.id },
      update: { totalSent: { increment: 1 }, lastActivity: new Date() },
      create: { userId: user.id, totalSent: 1 },
    });

    log.info({ triggeredBy: session.user.id, targetEmail: email, simulationId: simEmail.id }, "Simulation triggered");
    return NextResponse.json({
      success: true,
      simulationId: simEmail.id,
      message: `Phishing simulation sent to ${email}`,
    });
  } catch (error) {
    log.error({ error: String(error) }, "Trigger simulation failed");
    const e = errors.internal();
    return NextResponse.json(e.toJSON(), { status: e.statusCode });
  }
}
