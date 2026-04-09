import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { errors } from "@/lib/errors";
import { apiLogger } from "@/lib/logger";

const log = apiLogger("/api/users");

/**
 * GET /api/users
 * Returns user profile and metrics for the authenticated user.
 * Managers can optionally get users for their school.
 */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    const e = errors.unauthorized();
    return NextResponse.json(e.toJSON(), { status: e.statusCode });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        metrics: true,
        school: { select: { id: true, name: true, inviteCode: true, frequency: true } },
      },
    });

    if (!user) {
      const e = errors.notFound("User");
      return NextResponse.json(e.toJSON(), { status: e.statusCode });
    }

    const pendingTraining = await prisma.userTraining.findMany({
      where: {
        userId: session.user.id,
        completedAt: null,
      },
      include: {
        module: {
          select: { id: true, name: true },
        },
      },
    });

    const pendingTrainingFormatted = pendingTraining.map((ut) => ({
      id: ut.module.id,
      name: ut.module.name,
    }));

    if (
      (user.role === "MANAGER" || user.role === "ADMIN") &&
      user.schoolId
    ) {
      const schoolUsers = await prisma.user.findMany({
        where: { schoolId: user.schoolId },
        select: {
          id: true,
          name: true,
          email: true,
          metrics: true,
        },
      });

      return NextResponse.json({ user, schoolUsers, pendingTraining: pendingTrainingFormatted });
    }

    return NextResponse.json({ user, pendingTraining: pendingTrainingFormatted });
  } catch (error) {
    log.error({ error: String(error) }, "Get user failed");
    const e = errors.internal();
    return NextResponse.json(e.toJSON(), { status: e.statusCode });
  }
}
