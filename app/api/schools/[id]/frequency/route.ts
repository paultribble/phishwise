import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const VALID_FREQUENCIES = ["daily", "weekly", "biweekly", "monthly"];

/**
 * PATCH /api/schools/[id]/frequency
 * Updates the simulation frequency for a school.
 * Requires MANAGER role and user must belong to the school.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "MANAGER") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  try {
    const { frequency } = await req.json();

    if (!frequency || !VALID_FREQUENCIES.includes(frequency)) {
      return NextResponse.json(
        { error: `Invalid frequency. Must be one of: ${VALID_FREQUENCIES.join(", ")}` },
        { status: 400 }
      );
    }

    // Verify user belongs to this school
    const school = await prisma.school.findUnique({
      where: { id: params.id },
    });

    if (!school) {
      return NextResponse.json(
        { error: "School not found" },
        { status: 404 }
      );
    }

    const userSchool = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { schoolId: true },
    });

    if (userSchool?.schoolId !== params.id) {
      return NextResponse.json(
        { error: "You do not belong to this school" },
        { status: 403 }
      );
    }

    // Update frequency
    const updated = await prisma.school.update({
      where: { id: params.id },
      data: { frequency },
    });

    return NextResponse.json({ school: updated });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Update frequency error:", error);
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
