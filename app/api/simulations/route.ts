import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * GET /api/simulations
 * Returns simulation history for the authenticated user.
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "10"), 50);
  const offset = parseInt(searchParams.get("offset") ?? "0");

  const simulations = await prisma.simulationEmail.findMany({
    where: { userId: session.user.id },
    orderBy: { sentAt: "desc" },
    take: limit,
    skip: offset,
    include: {
      template: { select: { name: true, subject: true, difficulty: true } },
      campaign: { select: { name: true } },
    },
  });

  const total = await prisma.simulationEmail.count({
    where: { userId: session.user.id },
  });

  return NextResponse.json({ simulations, total });
}

/**
 * POST /api/simulations
 * Records a simulation click event (when user clicks a phishing link).
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { simulationId } = body;

  if (!simulationId) {
    return NextResponse.json(
      { error: "simulationId is required" },
      { status: 400 }
    );
  }

  const simulation = await prisma.simulationEmail.findUnique({
    where: { id: simulationId },
  });

  if (!simulation) {
    return NextResponse.json(
      { error: "Simulation not found" },
      { status: 404 }
    );
  }

  // Mark as clicked
  const updated = await prisma.simulationEmail.update({
    where: { id: simulationId },
    data: { clicked: true },
  });

  // Update user metrics
  await prisma.userMetrics.upsert({
    where: { userId: simulation.userId },
    update: { totalClicked: { increment: 1 }, lastActivity: new Date() },
    create: {
      userId: simulation.userId,
      totalSent: 1,
      totalClicked: 1,
      lastActivity: new Date(),
    },
  });

  return NextResponse.json({
    clicked: true,
    moduleId: updated.templateId,
  });
}
