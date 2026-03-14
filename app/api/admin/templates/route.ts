import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  moduleId: z.string().min(1, "Module is required"),
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
  difficulty: z.number().int().min(1).max(5),
  fromAddress: z.string().email().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const templates = await prisma.template.findMany({
    include: {
      module: { select: { id: true, name: true } },
      _count: { select: { simulations: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ templates });
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

  const { moduleId, name, subject, body: emailBody, difficulty, fromAddress } =
    parsed.data;

  const trainingModule = await prisma.trainingModule.findUnique({
    where: { id: moduleId },
  });
  if (!trainingModule) {
    return NextResponse.json({ error: "Module not found" }, { status: 404 });
  }

  const template = await prisma.template.create({
    data: {
      moduleId,
      name,
      subject,
      body: emailBody,
      difficulty,
      fromAddress: fromAddress ?? "security@verify-account.com",
    },
    include: {
      module: { select: { id: true, name: true } },
      _count: { select: { simulations: true } },
    },
  });

  return NextResponse.json(template, { status: 201 });
}
