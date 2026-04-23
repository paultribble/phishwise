import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  orderIndex: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const trainingModule = await prisma.trainingModule.findUnique({
    where: { id },
    include: {
      _count: { select: { templates: true, userProgress: true } },
    },
  });

  if (!trainingModule) {
    return NextResponse.json({ error: "Module not found" }, { status: 404 });
  }

  return NextResponse.json(trainingModule);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const updateData = parsed.data;
  const cleanData: Record<string, unknown> = {};

  Object.entries(updateData).forEach(([key, value]) => {
    if (key === "videoUrl" && value === "") {
      return;
    }
    cleanData[key] = value;
  });

  const trainingModule = await prisma.trainingModule.update({
    where: { id },
    data: cleanData as Parameters<typeof prisma.trainingModule.update>[0]["data"],
    include: {
      _count: { select: { templates: true, userProgress: true } },
    },
  });

  return NextResponse.json(trainingModule);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await prisma.trainingModule.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
