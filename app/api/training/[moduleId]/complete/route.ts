import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { errors } from "@/lib/errors";
import { apiLogger } from "@/lib/logger";

const log = apiLogger("/api/training/[moduleId]/complete");

const schema = z.object({
  passed: z.boolean(),
  score: z.number().int().min(0).max(100).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    const e = errors.unauthorized();
    return NextResponse.json(e.toJSON(), { status: e.statusCode });
  }

  const { moduleId } = await params;

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      log.warn({ userId: session.user.id, error: parsed.error.message }, "Validation failed");
      const e = errors.invalidInput(parsed.error.errors[0]?.message);
      return NextResponse.json(e.toJSON(), { status: e.statusCode });
    }
    const { passed, score } = parsed.data;

    const trainingModule = await prisma.trainingModule.findUnique({
      where: { id: moduleId },
    });

    if (!trainingModule) {
      const e = errors.notFound("Training module");
      return NextResponse.json(e.toJSON(), { status: e.statusCode });
    }

    if (passed) {
      log.info({ userId: session.user.id, moduleId, score }, "Training module completed");

      const existingTraining = await prisma.userTraining.findFirst({
        where: { userId: session.user.id, moduleId },
      });
      if (existingTraining) {
        await prisma.userTraining.update({
          where: { id: existingTraining.id },
          data: { completedAt: new Date() },
        });
      } else {
        await prisma.userTraining.create({
          data: {
            userId: session.user.id,
            moduleId,
            completedAt: new Date(),
          },
        });
      }

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
  } catch (error) {
    log.error({ error: String(error) }, "Training completion failed");
    const e = errors.internal();
    return NextResponse.json(e.toJSON(), { status: e.statusCode });
  }
}
