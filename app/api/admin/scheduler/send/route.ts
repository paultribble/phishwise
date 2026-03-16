import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { generatePhishingEmail } from "@/lib/email-template";

/**
 * POST /api/admin/scheduler/send
 * Scheduled endpoint for sending phishing simulations
 * Called by GitHub Actions or external scheduler
 * Requires SCHEDULER_SECRET header
 */
export async function POST(request: NextRequest) {
  // Verify scheduler secret
  const secret = request.headers.get("x-scheduler-secret");
  if (secret !== process.env.SCHEDULER_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all schools with scheduler enabled
    const schools = await prisma.school.findMany({
      where: { enableScheduler: true },
      select: { id: true, frequency: true },
    });

    let totalSent = 0;

    for (const school of schools) {
      // Get random users from school
      const schoolUsers = await prisma.user.findMany({
        where: {
          schoolId: school.id,
          role: "USER",
        },
        select: { id: true, email: true },
      });

      if (schoolUsers.length === 0) continue;

      // Select random user
      const randomUser = schoolUsers[Math.floor(Math.random() * schoolUsers.length)];

      // Get random template from any active module
      const randomTemplate = await prisma.template.findFirst({
        where: { isActive: true },
        include: { module: true },
        orderBy: { createdAt: "desc" },
      });

      if (!randomTemplate) continue;

      // Create simulation record
      const simulation = await prisma.simulationEmail.create({
        data: {
          userId: randomUser.id,
          templateId: randomTemplate.id,
          sentAt: new Date(),
          status: "sent",
        },
      });

      // Generate email with tracking link
      const trackingUrl = `${process.env.NEXTAUTH_URL}/api/track/click/${simulation.trackingToken}`;

      const htmlContent = generatePhishingEmail({
        subject: randomTemplate.subject,
        fromAddress: randomTemplate.fromAddress || "security@verify-account.com",
        body: randomTemplate.body,
        trackingLink: trackingUrl,
      });

      try {
        // Send email
        await sendEmail({
          to: randomUser.email,
          subject: randomTemplate.subject,
          html: htmlContent,
          replyTo: randomTemplate.fromAddress || "security@verify-account.com",
        });

        // Record history
        await prisma.userHistory.create({
          data: {
            userId: randomUser.id,
            actionType: "simulation_sent",
            detail: `Sent: ${randomTemplate.name} (Module: ${randomTemplate.module.name})`,
          },
        });

        totalSent++;
      } catch (emailError) {
        console.error(
          `Failed to send email to ${randomUser.email}:`,
          emailError
        );
        // Continue with next user on email failure
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Scheduled sending complete. Sent ${totalSent} simulations.`,
        totalSent,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/admin/scheduler/send] Error:", error);
    return NextResponse.json(
      {
        error: "Scheduler execution failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
