import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

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
    const { userIds, moduleId } = await req.json();

    if (!Array.isArray(userIds) || !moduleId) {
      return NextResponse.json(
        { error: "userIds (array) and moduleId (string) are required" },
        { status: 400 }
      );
    }

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

    for (const userId of userIds) {
      // Upsert UserTraining record
      await prisma.userTraining.upsert({
        where: {
          userId_moduleId: { userId, moduleId },
        },
        update: { assignedAt: new Date() },
        create: {
          userId,
          moduleId,
        },
      });

      // Create history record
      await prisma.userHistory.create({
        data: {
          userId,
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
