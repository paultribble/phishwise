import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { TrainingModuleContent } from "@/types/training";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { moduleId } = await params;

  try {
    const trainingModule = await prisma.trainingModule.findUnique({
      where: { id: moduleId },
    });

    if (!trainingModule) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    const userTraining = await prisma.userTraining.findUnique({
      where: {
        userId_moduleId: {
          userId: session.user.id,
          moduleId: moduleId,
        },
      },
    });

    const incompleteAssignment = await prisma.userTraining.findFirst({
      where: {
        userId: session.user.id,
        moduleId: moduleId,
        completedAt: null,
      },
    });

    let content: TrainingModuleContent;
    try {
      content = JSON.parse(trainingModule.content);
    } catch (parseError) {
      console.error("[GET /api/training/[moduleId]] JSON parse error:", parseError);
      return NextResponse.json(
        { error: "Invalid module content format" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      module: {
        id: trainingModule.id,
        name: trainingModule.name,
        description: trainingModule.description,
        content,
      },
      userStatus: userTraining
        ? {
            completed: !!userTraining.completedAt,
            completedAt: userTraining.completedAt,
            assignedAt: userTraining.assignedAt,
          }
        : null,
      isRequired: !!incompleteAssignment,
    });
  } catch (error) {
    console.error("[GET /api/training/[moduleId]] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch module" },
      { status: 500 }
    );
  }
}
