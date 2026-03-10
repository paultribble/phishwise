import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * GET /api/manager/analytics
 * Returns comprehensive analytics for a manager's school.
 * Requires MANAGER or ADMIN role.
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const isManager = session.user.role === "MANAGER" || session.user.role === "ADMIN";

  if (!isManager) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  try {
    // Get user's school
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { schoolId: true },
    });

    if (!user?.schoolId) {
      return NextResponse.json(
        { error: "User not associated with a school" },
        { status: 404 }
      );
    }

    const school = await prisma.school.findUnique({
      where: { id: user.schoolId },
    });

    if (!school) {
      return NextResponse.json(
        { error: "School not found" },
        { status: 404 }
      );
    }

    // Get school users
    const schoolUsers = await prisma.user.findMany({
      where: { schoolId: school.id },
      include: { metrics: true },
    });

    // Calculate aggregate stats
    const totalSent = schoolUsers.reduce((sum, u) => sum + (u.metrics?.totalSent ?? 0), 0);
    const totalClicked = schoolUsers.reduce((sum, u) => sum + (u.metrics?.totalClicked ?? 0), 0);

    const avgClickRate = schoolUsers.length > 0
      ? Math.round(
          schoolUsers.reduce((sum, u) => {
            const sent = u.metrics?.totalSent ?? 0;
            const clicked = u.metrics?.totalClicked ?? 0;
            return sum + (sent > 0 ? (clicked / sent) * 100 : 0);
          }, 0) / schoolUsers.length
        )
      : 0;

    const usersNeedingAttention = schoolUsers.filter((u) => {
      const sent = u.metrics?.totalSent ?? 0;
      const clicked = u.metrics?.totalClicked ?? 0;
      const clickRate = sent > 0 ? (clicked / sent) * 100 : 0;
      return clickRate > 50;
    }).length;

    // Find most failed template
    const templateStats = await prisma.simulationEmail.groupBy({
      by: ["templateId"],
      where: { userId: { in: schoolUsers.map((u) => u.id) } },
      _count: { id: true },
    });

    const mostFailedTemplate = templateStats.length > 0
      ? templateStats.reduce((prev, curr) => (curr._count.id > prev._count.id ? curr : prev))
      : null;

    // Get user performance
    const userPerformance = schoolUsers.map((u) => {
      const sent = u.metrics?.totalSent ?? 0;
      const clicked = u.metrics?.totalClicked ?? 0;
      const clickRate = sent > 0 ? Math.round((clicked / sent) * 100) : 0;

      return {
        userId: u.id,
        name: u.name ?? "Unknown",
        email: u.email ?? "",
        totalSent: sent,
        totalClicked: clicked,
        clickRate,
        lastSimulation: u.lastSimulation ?? null,
        trainingsCompleted: 0, // TODO: calculate from UserTraining
        trend: 0, // TODO: calculate 30-day trend
      };
    });

    // Get recent activity
    const recentActivity = await prisma.userHistory.findMany({
      where: { userId: { in: schoolUsers.map((u) => u.id) } },
      orderBy: { timestamp: "desc" },
      take: 50,
      include: { user: { select: { name: true } } },
    });

    return NextResponse.json({
      school: {
        id: school.id,
        name: school.name,
        inviteCode: school.inviteCode,
        frequency: school.frequency,
        totalUsers: schoolUsers.length,
        createdAt: school.createdAt,
      },
      aggregateStats: {
        totalSimulationsSent: totalSent,
        totalSimulationsClicked: totalClicked,
        averageClickRate: avgClickRate,
        usersNeedingAttention,
        mostFailedTemplateId: mostFailedTemplate?.templateId ?? null,
      },
      userPerformance,
      recentActivity: recentActivity.map((activity) => ({
        type: activity.actionType,
        userId: activity.userId,
        userName: activity.user.name,
        timestamp: activity.timestamp,
        details: activity.detail,
      })),
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
