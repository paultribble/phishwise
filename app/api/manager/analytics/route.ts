import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeRiskScore } from "@/lib/risk-score";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "MANAGER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const manager = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { schoolId: true },
    });

    if (!manager?.schoolId) {
      return NextResponse.json({ error: "No school assigned" }, { status: 404 });
    }

    const [school, schoolUsers, recentHistoryRaw] = await Promise.all([
      prisma.school.findUnique({ where: { id: manager.schoolId } }),
      prisma.user.findMany({
        where: { schoolId: manager.schoolId, role: "USER" },
        include: { metrics: true },
      }),
      prisma.userHistory.findMany({
        where: {
          user: { schoolId: manager.schoolId },
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

    const totalSent = schoolUsers.reduce((s, u) => s + (u.metrics?.totalSent ?? 0), 0);
    const totalClicked = schoolUsers.reduce((s, u) => s + (u.metrics?.totalClicked ?? 0), 0);
    const avgClickRate = totalSent > 0 ? Math.round((totalClicked / totalSent) * 100) : 0;

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Compute real risk scores for each user
    const userPerformance = await Promise.all(
      schoolUsers.map(async (u) => {
        const sent = u.metrics?.totalSent ?? 0;
        const clicked = u.metrics?.totalClicked ?? 0;
        const completed = u.metrics?.totalCompleted ?? 0;
        const rate = sent > 0 ? Math.round((clicked / sent) * 100) : 0;

        // Recent 30-day click data
        const [recentSent, recentClicked] = await Promise.all([
          prisma.simulationEmail.count({ where: { userId: u.id, sentAt: { gte: thirtyDaysAgo } } }),
          prisma.simulationEmail.count({ where: { userId: u.id, sentAt: { gte: thirtyDaysAgo }, clicked: true } }),
        ]);

        // Days since last training
        const lastTraining = await prisma.userTraining.findFirst({
          where: { userId: u.id, completedAt: { not: null } },
          orderBy: { completedAt: "desc" },
          select: { completedAt: true },
        });
        const daysSinceTraining = lastTraining?.completedAt
          ? Math.floor((Date.now() - lastTraining.completedAt.getTime()) / 86400000)
          : 999;

        const riskScore = computeRiskScore({
          totalSent: sent,
          totalClicked: clicked,
          totalCompleted: completed,
          recentSent,
          recentClicked,
          daysSinceLastTraining: daysSinceTraining,
        });

        return {
          userId: u.id,
          name: u.name || "Unknown",
          email: u.email || "",
          totalSent: sent,
          totalClicked: clicked,
          clickRate: rate,
          lastSimulation: u.metrics?.lastActivity?.toISOString() || null,
          trainingsCompleted: completed,
          riskScore,
        };
      })
    );

    const usersAtRisk = userPerformance.filter((u) => u.riskScore >= 60).length;

    const recentActivity = recentHistoryRaw.map((h) => ({
      type: h.actionType,
      userId: h.userId,
      userName: h.user.name || h.user.email || "Unknown",
      timestamp: h.createdAt.toISOString(),
      details: h.detail || "",
    }));

    return NextResponse.json({
      school: {
        id: school?.id,
        name: school?.name,
        inviteCode: school?.inviteCode,
        frequency: school?.frequency,
        totalUsers: schoolUsers.length,
        createdAt: school?.createdAt,
      },
      aggregateStats: {
        totalSimulationsSent: totalSent,
        totalSimulationsClicked: totalClicked,
        averageClickRate: avgClickRate,
        usersNeedingAttention: usersAtRisk,
      },
      userPerformance,
      recentActivity,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
