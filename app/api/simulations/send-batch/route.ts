import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { generatePhishingEmail } from "@/lib/email-template";
import { z } from "zod";
import { errors } from "@/lib/errors";
import { apiLogger } from "@/lib/logger";

const log = apiLogger("/api/simulations/send-batch");

const sendBatchSimulationSchema = z.object({
  userIds: z.array(z.string().min(1)).min(1, "At least one user is required"),
  templateId: z.string().min(1, "Template ID is required"),
  debug: z.boolean().optional(),
});

/**
 * POST /api/simulations/send-batch
 * Send phishing simulations to multiple users
 * Requires MANAGER role
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const debugLogs: string[] = [];

  function addLog(msg: string) {
    debugLogs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
  }

  addLog("Batch simulation request received");

  if (!session?.user?.id) {
    addLog("ERROR: Unauthorized - no session");
    const e = errors.unauthorized();
    return NextResponse.json(
      {
        error: e.message,
        success: false,
        sent: 0,
        failed: 0,
        debug: { logs: debugLogs },
      },
      { status: e.statusCode }
    );
  }

  if (session.user.role !== "MANAGER" && session.user.role !== "ADMIN") {
    addLog("ERROR: Forbidden - user is not MANAGER or ADMIN");
    const e = errors.forbidden("Manager or Admin role required");
    return NextResponse.json(
      {
        error: e.message,
        success: false,
        sent: 0,
        failed: 0,
        debug: { logs: debugLogs },
      },
      { status: e.statusCode }
    );
  }

  try {
    const body = await request.json();
    addLog(`Received body: ${JSON.stringify(body, null, 2)}`);

    const parsed = sendBatchSimulationSchema.safeParse(body);
    if (!parsed.success) {
      addLog(`ERROR: Validation failed - ${parsed.error.message}`);
      log.warn({ userId: session.user.id, error: parsed.error.message }, "Validation failed");
      const e = errors.invalidInput(parsed.error.errors[0]?.message);
      return NextResponse.json(
        {
          error: e.message,
          success: false,
          sent: 0,
          failed: 0,
          debug: { logs: debugLogs },
        },
        { status: e.statusCode }
      );
    }

    const { userIds, templateId, debug } = parsed.data;
    addLog(`Parsed: userIds=[${userIds.join(", ")}], templateId=${templateId}, debug=${debug}`);

    // Fetch manager's school
    const manager = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { schoolId: true },
    });
    addLog(`Manager schoolId: ${manager?.schoolId}`);

    if (!manager?.schoolId && session.user.role !== "ADMIN") {
      addLog("ERROR: Manager has no school assigned");
      const e = errors.schoolMismatch();
      return NextResponse.json(
        {
          error: e.message,
          success: false,
          sent: 0,
          failed: 0,
          debug: { logs: debugLogs },
        },
        { status: e.statusCode }
      );
    }

    // Fetch template with module info
    addLog(`Fetching template: ${templateId}`);
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: { module: true },
    });

    if (!template) {
      addLog(`ERROR: Template not found: ${templateId}`);
      const e = errors.notFound("Template");
      return NextResponse.json(
        {
          error: e.message,
          success: false,
          sent: 0,
          failed: 0,
          debug: { logs: debugLogs },
        },
        { status: e.statusCode }
      );
    }

    addLog(`Template found: ${template.name} (Module: ${template.module.name})`);

    // Fetch all target users
    addLog(`Fetching ${userIds.length} target users...`);
    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: { id: true, email: true, schoolId: true, name: true },
    });

    addLog(`Found ${users.length} user(s)`);

    // Verify all users belong to manager's school (for MANAGER role)
    if (session.user.role === "MANAGER" && manager?.schoolId) {
      const invalidUsers = users.filter((u) => u.schoolId !== manager.schoolId);
      if (invalidUsers.length > 0) {
        addLog(
          `ERROR: ${invalidUsers.length} user(s) do not belong to manager's school: ${invalidUsers.map((u) => u.email).join(", ")}`
        );
        const e = errors.schoolMismatch();
        return NextResponse.json(
          {
            error: `${invalidUsers.length} user(s) do not belong to your school`,
            success: false,
            sent: 0,
            failed: 0,
            debug: { logs: debugLogs },
          },
          { status: e.statusCode }
        );
      }
    }

    let sent = 0;
    let failed = 0;

    // Send simulations to each user
    addLog(`Starting simulation send to ${users.length} user(s)...`);

    for (const user of users) {
      try {
        addLog(`[${sent + failed + 1}/${users.length}] Processing ${user.email}...`);

        // Create simulation record
        addLog(`  → Creating simulation record in database`);
        const simulation = await prisma.simulationEmail.create({
          data: {
            userId: user.id,
            templateId: template.id,
            sentAt: new Date(),
            status: "sent",
          },
        });
        addLog(`  → Simulation created: ${simulation.id} (token: ${simulation.trackingToken})`);

        // Build email content
        addLog(`  → Generating email HTML`);
        const trackingUrl = `${process.env.NEXTAUTH_URL}/api/track/click/${simulation.trackingToken}`;

        // Personalize template body with user name
        const personalizedBody = template.body
          .replace(/\{\{USER_NAME\}\}/g, user.name || user.email.split("@")[0])
          .replace(/\{\{USER_EMAIL\}\}/g, user.email);

        const htmlContent = generatePhishingEmail({
          subject: template.subject,
          fromAddress: template.fromAddress || "security@verify-account.com",
          body: personalizedBody,
          trackingLink: trackingUrl,
          userName: user.name || user.email.split("@")[0],
        });

        // Send email
        addLog(`  → Sending email via Resend (spoofed from: ${template.fromAddress || "security@verify-account.com"})`);
        await sendEmail({
          to: user.email,
          subject: template.subject,
          html: htmlContent,
          replyTo: template.fromAddress || "security@verify-account.com",
        });
        addLog(`  ✅ Email sent successfully to ${user.email}`);

        // Record in history
        addLog(`  → Recording in user history`);
        await prisma.userHistory.create({
          data: {
            userId: user.id,
            actionType: "simulation_sent",
            detail: `Sent: ${template.name} (Module: ${template.module.name})`,
          },
        });

        sent++;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        addLog(`  ❌ FAILED to send to ${user.email}: ${errorMsg}`);
        failed++;
      }
    }

    addLog(`\n=== SUMMARY ===`);
    addLog(`✅ Sent: ${sent}/${users.length}`);
    if (failed > 0) {
      addLog(`❌ Failed: ${failed}/${users.length}`);
    }

    log.info(
      { sentBy: session.user.id, totalUsers: users.length, sent, failed, templateId },
      "Batch simulation sent"
    );

    return NextResponse.json(
      {
        success: sent > 0,
        sent,
        failed,
        message: `Sent to ${sent} user(s)${failed > 0 ? `, ${failed} failed` : ""}`,
        debug: { logs: debugLogs },
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    addLog(`ERROR: ${errorMsg}`);
    log.error({ error: errorMsg }, "Batch send simulation failed");
    const e = errors.internal();
    return NextResponse.json(
      {
        error: e.message,
        success: false,
        sent: 0,
        failed: 0,
        debug: { logs: debugLogs },
      },
      { status: e.statusCode }
    );
  }
}
