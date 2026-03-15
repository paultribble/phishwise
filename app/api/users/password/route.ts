import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { z } from "zod";
import * as bcryptjs from "bcryptjs";

const passwordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8),
});

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = passwordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!user?.password) {
      return NextResponse.json(
        { error: "No password set for this account" },
        { status: 400 }
      );
    }

    const isValid = await bcryptjs.compare(
      result.data.currentPassword,
      user.password
    );

    if (!isValid) {
      logger.warn('Password change failed - wrong current password', { route: '/api/users/password', userId: session.user.id });
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    const hashedPassword = await bcryptjs.hash(result.data.newPassword, 12);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    logger.info('Password changed', { route: '/api/users/password', userId: session.user.id });
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Password update error", { route: '/api/users/password', userId: session.user.id, error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500 }
    );
  }
}
