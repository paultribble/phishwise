import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

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

    const schoolUsers = await prisma.user.findMany({
      where: { schoolId: manager.schoolId, role: "USER" },
      include: { metrics: true },
    });

    const headers = [
      "Name",
      "Email",
      "Simulations Sent",
      "Links Clicked",
      "Click Rate (%)",
      "Trainings Completed",
      "Last Activity",
    ];

    const rows = schoolUsers.map((u) => {
      const sent = u.metrics?.totalSent ?? 0;
      const clicked = u.metrics?.totalClicked ?? 0;
      const rate = sent > 0 ? Math.round((clicked / sent) * 100) : 0;
      const lastActivity = u.metrics?.lastActivity
        ? u.metrics.lastActivity.toISOString().split("T")[0]
        : "N/A";

      return [
        escapeCsvField(u.name || "Unknown"),
        escapeCsvField(u.email || ""),
        String(sent),
        String(clicked),
        String(rate),
        String(u.metrics?.totalCompleted ?? 0),
        lastActivity,
      ].join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    const today = new Date().toISOString().split("T")[0];

    logger.info('CSV export downloaded', { route: '/api/manager/export', schoolId: manager.schoolId, userCount: schoolUsers.length });
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="phishwise-report-${today}.csv"`,
      },
    });
  } catch (error) {
    logger.error("Export error", { route: '/api/manager/export', error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 });
  }
}

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
