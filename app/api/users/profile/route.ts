import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { z } from "zod";

const VALID_FREQUENCY_OVERRIDES = ["weekly", "random", "off"] as const;

const profileSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  simulationFrequencyOverride: z
    .enum(VALID_FREQUENCY_OVERRIDES)
    .nullable()
    .optional(),
  resumeSimulations: z.boolean().optional(),
});

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = profileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, simulationFrequencyOverride, resumeSimulations } = result.data;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(simulationFrequencyOverride !== undefined && {
          simulationFrequencyOverride,
        }),
        ...(resumeSimulations !== undefined && {
          unsubscribedAt: resumeSimulations ? null : new Date(),
        }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        schoolId: true,
        unsubscribedAt: true,
        simulationFrequencyOverride: true,
      },
    });

    const updatedFields = [
      name !== undefined && "name",
      simulationFrequencyOverride !== undefined && "simulationFrequencyOverride",
      resumeSimulations !== undefined && "unsubscribedAt",
    ].filter(Boolean);

    logger.info('Profile updated', { route: '/api/users/profile', userId: session.user.id, fields: updatedFields });
    return NextResponse.json({ success: true, user });
  } catch (error) {
    logger.error("Profile update error", { route: '/api/users/profile', userId: session.user.id, error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
