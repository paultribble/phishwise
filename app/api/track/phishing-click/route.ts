import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiLogger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const log = apiLogger("/api/track/phishing-click");

/**
 * GET /api/track/phishing-click/[token]
 * Logs a phishing email click (user fell for the bait)
 * Redirects to training module for education
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const userAgent = request.headers.get("user-agent") || "unknown";
  const ipAddress = request.headers.get("x-forwarded-for") || "unknown";

  addLog(`[Phishing Click] token=${token} from IP=${ipAddress}`);

  try {
    // Find the simulation by tracking token
    addLog(`Looking up simulation with token: ${token}`);
    const simulation = await prisma.simulationEmail.findUnique({
      where: { trackingToken: token },
      include: {
        user: { select: { id: true, email: true, name: true } },
        template: { select: { id: true, name: true, moduleId: true, module: { select: { name: true, id: true } } } },
      },
    });

    if (!simulation) {
      addLog(`[ERROR] Simulation not found for token: ${token}`);
      return NextResponse.json(
        { error: "Invalid tracking token" },
        { status: 404 }
      );
    }

    addLog(
      `Found simulation: user=${simulation.user.email} template=${simulation.template.name}`
    );

    // Update simulation to mark as clicked
    addLog(`Updating simulation status to 'clicked'`);
    await prisma.simulationEmail.update({
      where: { id: simulation.id },
      data: {
        clicked: true,
        clickedAt: new Date(),
        status: "clicked",
      },
    });

    // Log the phishing failure in user history
    addLog(`Logging phishing failure in user history`);
    await prisma.userHistory.create({
      data: {
        userId: simulation.user.id,
        actionType: "phishing_failed",
        detail: `Fell for: ${simulation.template.name} (Module: ${simulation.template.module.name})`,
      },
    });

    // Update user metrics
    addLog(`Updating user metrics`);
    const metrics = await prisma.userMetrics.findUnique({
      where: { userId: simulation.user.id },
    });

    if (metrics) {
      await prisma.userMetrics.update({
        where: { userId: simulation.user.id },
        data: {
          totalClicked: metrics.totalClicked + 1,
          lastActivity: new Date(),
        },
      });
    }

    log.info(
      {
        userId: simulation.user.id,
        email: simulation.user.email,
        templateId: simulation.template.id,
        moduleId: simulation.template.moduleId,
      },
      "User clicked phishing email"
    );

    addLog(
      `✅ Logged phishing click. Redirecting to training module: ${simulation.template.module.name}`
    );

    // Redirect to training module with context
    const trainingUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/training/${simulation.template.moduleId}?phishing=caught&template=${simulation.template.id}`;

    // Return HTML with redirect (can be clicked or auto-redirect after delay)
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>PhishWise Training</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          h1 {
            color: #d32f2f;
            margin: 0 0 10px;
            font-size: 28px;
          }
          .icon {
            font-size: 64px;
            margin-bottom: 20px;
          }
          p {
            color: #555;
            margin: 15px 0;
            line-height: 1.6;
          }
          .module-name {
            font-weight: bold;
            color: #1d4ed8;
            font-size: 18px;
            margin: 20px 0;
          }
          a {
            display: inline-block;
            background: #1d4ed8;
            color: white;
            padding: 12px 30px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
            margin-top: 20px;
            transition: background 0.3s;
          }
          a:hover {
            background: #1e40af;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">⚠️</div>
          <h1>You've Been Phished!</h1>
          <p>You clicked on a simulated phishing email. This is a learning opportunity.</p>
          <div class="module-name">${simulation.template.module.name}</div>
          <p>The training module below will teach you how to recognize and avoid these attacks.</p>
          <a href="${trainingUrl}">Start Training Now</a>
          <p style="font-size: 12px; color: #999; margin-top: 40px;">
            Redirecting automatically in 5 seconds...
          </p>
        </div>
        <script>
          setTimeout(() => {
            window.location.href = "${trainingUrl}";
          }, 5000);
        </script>
      </body>
      </html>
      `,
      {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  } catch (error) {
    addLog(`[ERROR] ${error instanceof Error ? error.message : String(error)}`);
    log.error({ error: String(error), token }, "Phishing click tracking failed");
    return NextResponse.json(
      { error: "Failed to process phishing click" },
      { status: 500 }
    );
  }
}

function addLog(msg: string) {
  console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);
}
