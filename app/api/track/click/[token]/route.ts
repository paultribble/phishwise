// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiLogger } from "@/lib/logger";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendUserPhishClickAlert, sendManagerPhishAlert } from "@/lib/email";

export const dynamic = "force-dynamic";

const log = apiLogger("/api/track/click/[token]");

/**
 * GET /api/track/click/[token]
 * Handles click tracking for phishing simulation emails.
 * Updates metrics, creates history, and redirects to training module.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  // Rate limit: 100 clicks per day per IP
  const ip = getClientIp(req);
  const { success } = await checkRateLimit(`click_ip_${ip}`, 100, 86400000);
  if (!success) {
    return new NextResponse("Too many requests", { status: 429 });
  }

  const token = params.token;

  if (!token || !token.startsWith("tk_")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const simEmail = await prisma.simulationEmail.findUnique({
      where: { trackingToken: token },
      include: {
        template: { select: { moduleId: true, name: true, module: { select: { name: true } } } },
        user: { select: { id: true, name: true, email: true, schoolId: true } },
      },
    });

    if (!simEmail) {
      console.error("Simulation email not found for token:", token);
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Mark as clicked if not already
    if (!simEmail.clicked) {
      log.info(
        { userId: simEmail.userId, token, moduleId: simEmail.template.moduleId },
        'Simulation email clicked'
      );

      await prisma.simulationEmail.update({
        where: { id: simEmail.id },
        data: {
          clicked: true,
          clickedAt: new Date(),
        },
      });

      // Create history record
      await prisma.userHistory.create({
        data: {
          userId: simEmail.userId,
          actionType: "simulation_clicked",
          detail: `Clicked simulation email (template: ${simEmail.template.moduleId})`,
        },
      });

      // Update metrics
      await prisma.userMetrics.upsert({
        where: { userId: simEmail.userId },
        update: {
          totalClicked: { increment: 1 },
          lastActivity: new Date(),
        },
        create: {
          userId: simEmail.userId,
          totalClicked: 1,
        },
      });

      // Assign training for this module (upsert to avoid duplicate)
      await prisma.userTraining.upsert({
        where: {
          userId_moduleId: {
            userId: simEmail.userId,
            moduleId: simEmail.template.moduleId,
          },
        },
        update: { assignedAt: new Date() },
        create: {
          userId: simEmail.userId,
          moduleId: simEmail.template.moduleId,
          assignedAt: new Date(),
        },
      });

      // Fire-and-forget: send alert emails and notify manager
      const baseUrl =
        process.env.NEXTAUTH_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
      const trainingUrl = `${baseUrl}/training/${simEmail.template.moduleId}`;
      const dashboardUrl = `${baseUrl}/dashboard/manager`;

      Promise.all([
        // Notify user
        simEmail.user.email
          ? sendUserPhishClickAlert(
              simEmail.user.email,
              simEmail.user.name || "there",
              simEmail.template.module.name,
              trainingUrl
            ).catch(() => {})
          : Promise.resolve(),

        // Notify manager if user is in a school
        simEmail.user.schoolId
          ? prisma.user
              .findFirst({
                where: { schoolId: simEmail.user.schoolId, role: "MANAGER" },
                select: { email: true, name: true },
              })
              .then((manager) => {
                if (manager?.email) {
                  return sendManagerPhishAlert(
                    manager.email,
                    manager.name || "Manager",
                    simEmail.user.name || simEmail.user.email || "A user",
                    simEmail.template.name,
                    simEmail.user.schoolId!,
                    dashboardUrl
                  );
                }
              })
              .catch(() => {})
          : Promise.resolve(),
      ]).catch(() => {});
    }

    // Redirect to "you got phished" warning page, then to training
    return NextResponse.redirect(
      new URL(`/training/${simEmail.template.moduleId}/caught?token=${token}`, req.url)
    );
  } catch (error) {
    console.error("Click tracking error:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}
