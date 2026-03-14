// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

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
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid request body" },
        { status: 400 }
      );
    }
    const { userId, userIds, moduleId } = parsed.data;

    // Support both single user (userId) and batch (userIds)
    const usersToAssign = userId ? [userId] : userIds!;

    // Verify module exists
    const trainingModule = await prisma.trainingModule.findUnique({
      where: { id: moduleId },
    });

    if (!trainingModule) {
      return NextResponse.json(
        { error: "Training module not found" },
        { status: 404 }
      );
    }

    let assignedCount = 0;

    for (const assignUserId of usersToAssign) {
      // Upsert UserTraining record
      await prisma.userTraining.upsert({
        where: {
          userId_moduleId: { userId: assignUserId, moduleId },
        },
        update: { assignedAt: new Date() },
        create: {
          userId: assignUserId,
          moduleId,
        },
      });

      // Create history record
      await prisma.userHistory.create({
        data: {
          userId: assignUserId,
          actionType: "training_assigned",
          detail: `Assigned module: ${moduleId}`,
        },
      });

      assignedCount++;
    }

    return NextResponse.json({
      assigned: assignedCount,
      moduleId,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Assign training error:", error);
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
