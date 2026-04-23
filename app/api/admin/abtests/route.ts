import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  controlTemplateId: z.string().min(1),
  variantTemplateId: z.string().min(1),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tests = await prisma.aBTest.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Attach click-rate stats for each group
  const enriched = await Promise.all(
    tests.map(async (test) => {
      const [controlSims, variantSims] = await Promise.all([
        prisma.simulationEmail.findMany({
          where: { abTestId: test.id, abTestGroup: "control" },
          select: { clicked: true },
        }),
        prisma.simulationEmail.findMany({
          where: { abTestId: test.id, abTestGroup: "variant" },
          select: { clicked: true },
        }),
      ]);

      const controlClicks = controlSims.filter((s) => s.clicked).length;
      const variantClicks = variantSims.filter((s) => s.clicked).length;

      return {
        ...test,
        control: {
          total: controlSims.length,
          clicks: controlClicks,
          clickRate: controlSims.length > 0 ? Math.round((controlClicks / controlSims.length) * 100) : 0,
        },
        variant: {
          total: variantSims.length,
          clicks: variantClicks,
          clickRate: variantSims.length > 0 ? Math.round((variantClicks / variantSims.length) * 100) : 0,
        },
      };
    })
  );

  return NextResponse.json({ tests: enriched });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
  }

  const { name, description, controlTemplateId, variantTemplateId } = parsed.data;

  // Verify templates exist
  const [control, variant] = await Promise.all([
    prisma.template.findUnique({ where: { id: controlTemplateId } }),
    prisma.template.findUnique({ where: { id: variantTemplateId } }),
  ]);

  if (!control || !variant) {
    return NextResponse.json({ error: "One or both templates not found" }, { status: 404 });
  }

  const test = await prisma.aBTest.create({
    data: { name, description, controlTemplateId, variantTemplateId },
  });

  return NextResponse.json({ test }, { status: 201 });
}
