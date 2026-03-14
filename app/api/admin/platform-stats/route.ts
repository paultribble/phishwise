import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [totalUsers, totalSchools, totalSimulations, clickedSimulations] =
    await Promise.all([
      prisma.user.count(),
      prisma.school.count(),
      prisma.simulationEmail.count(),
      prisma.simulationEmail.count({ where: { clicked: true } }),
    ]);

  // Top 5 most-clicked templates
  const topTemplates = await prisma.template.findMany({
    take: 5,
    include: {
      module: { select: { name: true } },
      simulations: { select: { clicked: true } },
    },
    orderBy: { simulations: { _count: "desc" } },
  });

  const topTemplateData = topTemplates.map((t) => ({
    name: t.name,
    module: t.module.name,
    total: t.simulations.length,
    clicked: t.simulations.filter((s) => s.clicked).length,
    clickRate: t.simulations.length
      ? Math.round(
          (t.simulations.filter((s) => s.clicked).length /
            t.simulations.length) *
            100
        )
      : 0,
  }));

  return NextResponse.json({
    totalUsers,
    totalSchools,
    totalSimulations,
    clickRate: totalSimulations
      ? Math.round((clickedSimulations / totalSimulations) * 100)
      : 0,
    topTemplates: topTemplateData,
  });
}
