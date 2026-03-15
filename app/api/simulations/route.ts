import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { errors } from "@/lib/errors";
import { apiLogger } from "@/lib/logger";

const log = apiLogger("/api/simulations");

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
  offset: z.coerce.number().int().min(0).default(0),
});

const postSchema = z.object({
  simulationId: z.string().min(1, "simulationId is required"),
});

/**
 * GET /api/simulations
 * Returns simulation history for the authenticated user.
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    const e = errors.unauthorized();
    return NextResponse.json(e.toJSON(), { status: e.statusCode });
  }

  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    limit: searchParams.get("limit") ?? undefined,
    offset: searchParams.get("offset") ?? undefined,
  });
  if (!parsed.success) {
    log.warn({ userId: session.user.id, error: parsed.error.message }, "Invalid query params");
    const e = errors.invalidInput("limit/offset");
    return NextResponse.json(e.toJSON(), { status: e.statusCode });
  }
  const { limit, offset } = parsed.data;

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
  try {
    const body = await request.json();
    const parsed = postSchema.safeParse(body);
    if (!parsed.success) {
      log.warn({ error: parsed.error.message }, "Validation failed");
      const e = errors.invalidInput("simulationId");
      return NextResponse.json(e.toJSON(), { status: e.statusCode });
    }
    const { simulationId } = parsed.data;

    const simulation = await prisma.simulationEmail.findUnique({
      where: { id: simulationId },
    });
    if (!simulation) {
      const e = errors.notFound("Simulation");
      return NextResponse.json(e.toJSON(), { status: e.statusCode });
    }

    const updated = await prisma.simulationEmail.update({
      where: { id: simulationId },
      data: { clicked: true },
    });

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

    log.info({ simulationId, userId: simulation.userId }, "Simulation click recorded");
    return NextResponse.json({ clicked: true, moduleId: updated.templateId });
  } catch (error) {
    log.error({ error: String(error) }, "Simulation POST failed");
    const e = errors.internal();
    return NextResponse.json(e.toJSON(), { status: e.statusCode });
  }
}
