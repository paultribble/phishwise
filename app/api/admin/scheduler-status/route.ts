import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * GET /api/admin/scheduler-status
 * Returns recent scheduler run stats and activity.
 * Requires admin role.
 */
export async function GET(req: NextRequest) {
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
    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const recentActivity = await prisma.userHistory.findMany({
      where: {
        AND: [
          { actionType: "simulation_sent" },
          { createdAt: { gte: sevenDaysAgo } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    // Calculate summary stats
    const simulationsSent = await prisma.simulationEmail.count({
      where: { sentAt: { gte: sevenDaysAgo } },
    });

    const simulationsClicked = await prisma.simulationEmail.count({
      where: { clicked: true, sentAt: { gte: sevenDaysAgo } },
    });

    const simulationsOpened = await prisma.simulationEmail.count({
      where: { opened: true, sentAt: { gte: sevenDaysAgo } },
    });

    const uniqueUsersSimulated = await prisma.simulationEmail.findMany({
      where: { sentAt: { gte: sevenDaysAgo } },
      distinct: ["userId"],
      select: { userId: true },
    });

    return NextResponse.json({
      timestamp: new Date(),
      period: "last_7_days",
      summary: {
        totalSent: simulationsSent,
        totalClicked: simulationsClicked,
        totalOpened: simulationsOpened,
        clickRate: simulationsSent > 0
          ? Math.round((simulationsClicked / simulationsSent) * 100)
          : 0,
        openRate: simulationsSent > 0
          ? Math.round((simulationsOpened / simulationsSent) * 100)
          : 0,
        uniqueUsersSent: uniqueUsersSimulated.length,
      },
      recentActivity: recentActivity.map((activity) => ({
        userId: activity.userId,
        userName: activity.user.name,
        userEmail: activity.user.email,
        action: activity.actionType,
        timestamp: activity.createdAt,
      })),
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Scheduler status error:", error);
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
