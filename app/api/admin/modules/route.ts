import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().min(1, "Content is required"),
  orderIndex: z.number().int().min(0),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const modules = await prisma.trainingModule.findMany({
    include: {
      _count: { select: { templates: true, userProgress: true } },
    },
    orderBy: { orderIndex: "asc" },
  });

  return NextResponse.json({ modules });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const trainingModule = await prisma.trainingModule.create({
    data: parsed.data,
    include: {
      _count: { select: { templates: true, userProgress: true } },
    },
  });

  return NextResponse.json(trainingModule, { status: 201 });
}
