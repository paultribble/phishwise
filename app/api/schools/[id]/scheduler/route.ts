import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateSchedulerSchema = z.object({
  enableScheduler: z.boolean(),
});

/**
 * PATCH /api/schools/{id}/scheduler
 * Toggle scheduler for a school
 * Requires MANAGER role
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "MANAGER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const validation = updateSchedulerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { enableScheduler } = validation.data;

    // Verify manager owns this school
    const manager = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { schoolId: true },
    });

    if (manager?.schoolId !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update school
    const school = await prisma.school.update({
      where: { id },
      data: { enableScheduler },
      select: {
        id: true,
        name: true,
        enableScheduler: true,
        frequency: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Scheduler ${enableScheduler ? "enabled" : "disabled"} for ${school.name}`,
        school,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PATCH /api/schools/{id}/scheduler] Error:", error);
    return NextResponse.json(
      { error: "Failed to update scheduler" },
      { status: 500 }
    );
  }
}
