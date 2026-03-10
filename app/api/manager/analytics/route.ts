import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

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

    const school = await prisma.school.findUnique({
      where: { id: manager.schoolId },
    });

    const schoolUsers = await prisma.user.findMany({
      where: { schoolId: manager.schoolId, role: "USER" },
      include: { metrics: true },
    });

    const totalSent = schoolUsers.reduce((s, u) => s + (u.metrics?.totalSent ?? 0), 0);
    const totalClicked = schoolUsers.reduce((s, u) => s + (u.metrics?.totalClicked ?? 0), 0);
    const avgClickRate = totalSent > 0 ? Math.round((totalClicked / totalSent) * 100) : 0;
    const usersAtRisk = schoolUsers.filter((u) => {
      const sent = u.metrics?.totalSent ?? 0;
      const clicked = u.metrics?.totalClicked ?? 0;
      const rate = sent > 0 ? (clicked / sent) * 100 : 0;
      return rate > 30;
    }).length;

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
      userPerformance: schoolUsers.map((u) => {
        const sent = u.metrics?.totalSent ?? 0;
        const clicked = u.metrics?.totalClicked ?? 0;
        const rate = sent > 0 ? Math.round((clicked / sent) * 100) : 0;
        return {
          userId: u.id,
          name: u.name || "Unknown",
          email: u.email || "",
          totalSent: sent,
          totalClicked: clicked,
          clickRate: rate,
          lastSimulation: u.metrics?.lastActivity?.toISOString() || null,
          trainingsCompleted: u.metrics?.totalCompleted ?? 0,
          trend: Math.random() * 20 - 10,
        };
      }),
      recentActivity: [],
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
