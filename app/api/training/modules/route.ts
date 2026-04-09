import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/training/modules
 * Returns all available training modules with their email templates
 * Used by manager dashboard for simulation template selection
 */
export async function GET() {
  try {
    const modules = await prisma.trainingModule.findMany({
      where: { isActive: true },
      include: {
        templates: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            subject: true,
            difficulty: true,
            fromAddress: true,
          },
          orderBy: { name: "asc" },
        },
        _count: { select: { templates: true } },
      },
      orderBy: { orderIndex: "asc" },
    });

    return NextResponse.json({ modules }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/training/modules] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch modules" },
      { status: 500 }
    );
  }
}
