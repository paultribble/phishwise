// @ts-nocheck
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { moduleId } = await params;

  const body = await request.json();
  const { passed } = body;

  if (typeof passed !== "boolean") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const trainingModule = await prisma.trainingModule.findUnique({
    where: { id: moduleId },
  });

  if (!trainingModule) {
    return NextResponse.json({ error: "Module not found" }, { status: 404 });
  }

  if (passed) {
    await prisma.userTraining.upsert({
      where: {
        userId_moduleId: {
          userId: session.user.id,
          moduleId: moduleId,
        },
      },
      update: {
        completedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        moduleId: moduleId,
        completedAt: new Date(),
      },
    });

    await prisma.userHistory.create({
      data: {
        userId: session.user.id,
        actionType: "training_completed",
        detail: moduleId,
      },
    });

    await prisma.userMetrics.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        totalCompleted: { increment: 1 },
        lastActivity: new Date(),
      },
      create: {
        userId: session.user.id,
        totalCompleted: 1,
        lastActivity: new Date(),
      },
    });
  }

  return NextResponse.json({ success: true });
}
