import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { school: { select: { id: true, name: true, inviteCode: true } } },
  });

  return NextResponse.json({ school: user?.school ?? null });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.schoolId) {
    return NextResponse.json({ error: "You already belong to a school" }, { status: 409 });
  }

  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "School name is required" }, { status: 400 });
  }

  const inviteCode = crypto.randomBytes(4).toString("hex").toUpperCase();

  const [school] = await prisma.$transaction([
    prisma.school.create({
      data: {
        name,
        inviteCode,
        createdBy: session.user.id,
        users: { connect: { id: session.user.id } },
      },
    }),
    prisma.user.update({
      where: { id: session.user.id },
      data: { role: "MANAGER" },
    }),
  ]);

  return NextResponse.json({ school }, { status: 201 });
}
