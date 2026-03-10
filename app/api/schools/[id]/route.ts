import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * PATCH /api/schools/[id]
 * Updates school settings (name, autoAssignTraining, etc).
 * Requires MANAGER role.
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
    const { name, autoAssignTraining } = await req.json();

    // Verify user belongs to this school
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

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (typeof autoAssignTraining === "boolean") updateData.autoAssignTraining = autoAssignTraining;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updated = await prisma.school.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ school: updated });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Update school error:", error);
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/schools/[id]
 * Deletes a school (danger zone).
 * Requires MANAGER role and a confirmation key.
 */
export async function DELETE(
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
    const { confirmationKey } = await req.json();

    // Verify user belongs to this school
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

    const school = await prisma.school.findUnique({
      where: { id: params.id },
    });

    if (!school) {
      return NextResponse.json(
        { error: "School not found" },
        { status: 404 }
      );
    }

    // Simple confirmation (in production, use a more secure mechanism)
    if (confirmationKey !== `DELETE_${params.id}`) {
      return NextResponse.json(
        { error: "Invalid confirmation key" },
        { status: 400 }
      );
    }

    // Delete all related data
    await prisma.simulationEmail.deleteMany({
      where: { campaign: { schoolId: params.id } },
    });

    await prisma.campaign.deleteMany({
      where: { schoolId: params.id },
    });

    await prisma.user.updateMany({
      where: { schoolId: params.id },
      data: { schoolId: null },
    });

    await prisma.school.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "School deleted successfully" });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Delete school error:", error);
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
