import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.schoolId) {
    return NextResponse.json({ error: "You are already a member of a school" }, { status: 409 });
  }

  const body = await request.json();
  const code = typeof body.inviteCode === "string" ? body.inviteCode.trim().toUpperCase() : "";
  if (!code) {
    return NextResponse.json({ error: "inviteCode is required" }, { status: 400 });
  }

  const school = await prisma.school.findUnique({
    where: { inviteCode: code },
    select: { id: true, name: true },
  });
  if (!school) {
    return NextResponse.json({ error: "Invalid invite code" }, { status: 404 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { schoolId: school.id },
  });

  return NextResponse.json({ school });
}
