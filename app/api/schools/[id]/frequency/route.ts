import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { errors } from "@/lib/errors";
import { apiLogger } from "@/lib/logger";

const log = apiLogger("/api/schools/[id]/frequency");

const VALID_FREQUENCIES = ["daily", "weekly", "biweekly", "monthly"] as const;
const schema = z.object({
  frequency: z.enum(VALID_FREQUENCIES),
});

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
    const e = errors.forbidden("Manager role required");
    return NextResponse.json(e.toJSON(), { status: e.statusCode });
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      log.warn({ userId: session.user.id, error: parsed.error.message }, "Validation failed");
      const e = errors.invalidFrequency([...VALID_FREQUENCIES]);
      return NextResponse.json(e.toJSON(), { status: e.statusCode });
    }
    const { frequency } = parsed.data;

    const school = await prisma.school.findUnique({
      where: { id: params.id },
    });
    if (!school) {
      const e = errors.notFound("School");
      return NextResponse.json(e.toJSON(), { status: e.statusCode });
    }

    const userSchool = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { schoolId: true },
    });
    if (userSchool?.schoolId !== params.id) {
      const e = errors.schoolMismatch();
      return NextResponse.json(e.toJSON(), { status: e.statusCode });
    }

    const updated = await prisma.school.update({
      where: { id: params.id },
      data: { frequency },
    });

    log.info({ userId: session.user.id, schoolId: params.id, frequency }, "Frequency updated");
    return NextResponse.json({ school: updated });
  } catch (error) {
    log.error({ error: String(error) }, "Update frequency failed");
    const e = errors.internal();
    return NextResponse.json(e.toJSON(), { status: e.statusCode });
  }
}
