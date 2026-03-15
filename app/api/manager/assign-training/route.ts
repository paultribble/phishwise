import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { errors } from "@/lib/errors";
import { apiLogger } from "@/lib/logger";

const log = apiLogger("/api/manager/assign-training");

const schema = z.object({
  moduleId: z.string().min(1),
  userId: z.string().min(1).optional(),
  userIds: z.array(z.string().min(1)).optional(),
}).refine(
  (data) => data.userId !== undefined || (data.userIds !== undefined && data.userIds.length > 0),
  { message: "userId or userIds (non-empty array) is required" }
);

/**
 * POST /api/manager/assign-training
 * Assigns a training module to multiple users.
 * Requires MANAGER role.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "MANAGER") {
    const e = errors.forbidden("Manager role required");
    return NextResponse.json(e.toJSON(), { status: e.statusCode });
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      log.warn({ userId: session.user.id, error: parsed.error.message }, "Validation failed");
      const e = errors.invalidInput(parsed.error.errors[0]?.message);
      return NextResponse.json(e.toJSON(), { status: e.statusCode });
    }
    const { userId, userIds, moduleId } = parsed.data;

    const usersToAssign = userId ? [userId] : userIds!;

    const trainingModule = await prisma.trainingModule.findUnique({
      where: { id: moduleId },
    });

    if (!trainingModule) {
      const e = errors.notFound("Training module");
      return NextResponse.json(e.toJSON(), { status: e.statusCode });
    }

    let assignedCount = 0;

    for (const assignUserId of usersToAssign) {
      const existing = await prisma.userTraining.findFirst({
        where: { userId: assignUserId, moduleId },
      });
      if (existing) {
        await prisma.userTraining.update({
          where: { id: existing.id },
          data: { assignedAt: new Date() },
        });
      } else {
        await prisma.userTraining.create({
          data: { userId: assignUserId, moduleId },
        });
      }

      await prisma.userHistory.create({
        data: {
          userId: assignUserId,
          actionType: "training_assigned",
          detail: `Assigned module: ${moduleId}`,
        },
      });

      assignedCount++;
    }

    log.info({ managerId: session.user.id, moduleId, assignedCount }, "Training assigned");
    return NextResponse.json({ assigned: assignedCount, moduleId });
  } catch (error) {
    log.error({ error: String(error) }, "Assign training failed");
    const e = errors.internal();
    return NextResponse.json(e.toJSON(), { status: e.statusCode });
  }
}
