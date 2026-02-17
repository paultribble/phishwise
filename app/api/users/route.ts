import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * GET /api/users
 * Returns user profile and metrics for the authenticated user.
 * Managers can optionally get users for their school.
 */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      metrics: true,
      school: { select: { id: true, name: true, inviteCode: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // If manager, include school members
  if (
    (user.role === "MANAGER" || user.role === "ADMIN") &&
    user.schoolId
  ) {
    const schoolUsers = await prisma.user.findMany({
      where: { schoolId: user.schoolId },
      select: {
        id: true,
        name: true,
        email: true,
        metrics: true,
      },
    });

    return NextResponse.json({ user, schoolUsers });
  }

  return NextResponse.json({ user });
}
