import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { ApiError, errors } from "@/lib/errors";
import { apiLogger } from "@/lib/logger";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const log = apiLogger("/api/schools/join");
const schema = z.object({ inviteCode: z.string().min(1).max(50) });

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

  // Rate limit: 10 join attempts per hour per IP
  const ip = getClientIp(request);
  const { success } = await checkRateLimit(`join_ip_${ip}`, 10, 3600000);
  if (!success) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later" },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      log.warn({ userId: session.user.id, error: parsed.error.message }, "Validation failed");
      const e = errors.invalidInvite();
      return NextResponse.json(e.toJSON(), { status: e.statusCode });
    }
    const code = parsed.data.inviteCode.trim().toUpperCase();

    const school = await prisma.school.findUnique({
      where: { inviteCode: code },
      select: { id: true, name: true },
    });
    if (!school) {
      log.warn({ userId: session.user.id, inviteCode: code }, "Invalid invite code");
      const e = errors.invalidInvite();
      return NextResponse.json(e.toJSON(), { status: e.statusCode });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { schoolId: school.id },
    });

    log.info({ userId: session.user.id, schoolId: school.id }, "User joined school");
    return NextResponse.json({ school });
  } catch (error) {
    log.error({ error: String(error) }, "Join school failed");
    const e = errors.internal();
    return NextResponse.json(e.toJSON(), { status: e.statusCode });
  }
}
