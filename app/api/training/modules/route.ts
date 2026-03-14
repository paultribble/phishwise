import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/training/modules
 * Returns all available training modules
 */
export async function GET() {
  try {
    const modules = await prisma.trainingModule.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        description: true,
        orderIndex: true,
        _count: {
          select: { templates: true },
        },
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
