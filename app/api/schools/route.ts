import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import crypto from "crypto";
import { errors } from "@/lib/errors";
import { apiLogger } from "@/lib/logger";

const log = apiLogger("/api/schools");
const createSchema = z.object({ name: z.string().min(1).max(200) });

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    const e = errors.unauthorized();
    return NextResponse.json(e.toJSON(), { status: e.statusCode });
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
    const e = errors.unauthorized();
    return NextResponse.json(e.toJSON(), { status: e.statusCode });
  }
  if (session.user.schoolId) {
    const e = errors.alreadyInSchool();
    return NextResponse.json(e.toJSON(), { status: e.statusCode });
  }

  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      log.warn({ userId: session.user.id, error: parsed.error.message }, "Validation failed");
      const e = errors.invalidInput("name");
      return NextResponse.json(e.toJSON(), { status: e.statusCode });
    }
    const name = parsed.data.name.trim();

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

    log.info({ userId: session.user.id, schoolId: school.id }, "School created");
    return NextResponse.json({ school }, { status: 201 });
  } catch (error) {
    log.error({ error: String(error) }, "Create school failed");
    const e = errors.internal();
    return NextResponse.json(e.toJSON(), { status: e.statusCode });
  }
}
