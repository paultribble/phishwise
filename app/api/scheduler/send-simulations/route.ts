import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  selectEligibleUsers,
  selectTemplate,
  generateTrackingToken,
  getRecentTemplateIds,
} from "@/lib/scheduler/logic";
import { sendPhishingEmail } from "@/lib/email/send";

/**
 * GET /api/scheduler/send-simulations
 * Health check endpoint.
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date(),
  });
}

/**
 * POST /api/scheduler/send-simulations
 * Main scheduler endpoint. Requires SCHEDULER_SECRET in Authorization header.
 * Sends phishing emails to eligible users.
 */
export async function POST(req: NextRequest) {
  // Verify scheduler secret
  const authHeader = req.headers.get("Authorization");
  const secret = process.env.SCHEDULER_SECRET;

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const results = {
    success: true,
    timestamp: new Date(),
    processed: 0,
    sent: 0,
    failed: 0,
    errors: [] as string[],
  };

  try {
    // Get eligible users for simulation
    const eligibleUsers = await selectEligibleUsers();
    results.processed = eligibleUsers.length;

    // Send email to each eligible user
    for (const user of eligibleUsers) {
      try {
        if (!user.email) {
          results.errors.push(`User ${user.id} has no email address`);
          results.failed++;
          continue;
        }

        // Select template for this user
        const recentIds = await getRecentTemplateIds(user.id);
        const template = await selectTemplate(user.id, recentIds);

        if (!template) {
          results.errors.push(`No template available for user ${user.id}`);
          results.failed++;
          continue;
        }

        // Get or create campaign
        const school = await prisma.school.findUnique({
          where: { id: user.schoolId },
        });

        if (!school) {
          results.errors.push(`School not found for user ${user.id}`);
          results.failed++;
          continue;
        }

        let campaign = await prisma.campaign.findFirst({
          where: { schoolId: school.id },
        });

        if (!campaign) {
          campaign = await prisma.campaign.create({
            data: {
              schoolId: school.id,
              name: `Auto Campaign - ${new Date().toISOString()}`,
              scheduleType: "random",
              status: "active",
            },
          });
        }

        // Generate tracking token
        const token = generateTrackingToken();

        // Create simulation email record
        const simEmail = await prisma.simulationEmail.create({
          data: {
            userId: user.id,
            campaignId: campaign.id,
            templateId: template.id,
            token,
            status: "sent",
          },
        });

        // Send the phishing email
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
          results.errors.push(`Failed to send email to ${user.email}: ${sendResult.error}`);
          results.failed++;
          continue;
        }

        // Update user's lastSimulation timestamp
        await prisma.user.update({
          where: { id: user.id },
          data: { lastSimulation: new Date() },
        });

        // Update metrics
        await prisma.userMetrics.upsert({
          where: { userId: user.id },
          update: { totalSent: { increment: 1 }, lastActivity: new Date() },
          create: { userId: user.id, totalSent: 1 },
        });

        // Create history record
        await prisma.userHistory.create({
          data: {
            userId: user.id,
            actionType: "simulation_sent",
            detail: `Sent phishing simulation (template: ${template.id})`,
          },
        });

        results.sent++;

        // 100ms delay between sends
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        results.errors.push(`Error sending to user ${user.id}: ${errorMsg}`);
        results.failed++;
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Scheduler error:", error);
    return NextResponse.json(
      {
        success: false,
        timestamp: new Date(),
        error: errorMsg,
      },
      { status: 500 }
    );
  }
}
