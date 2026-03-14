import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import * as bcryptjs from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = schema.parse(body);

    const record = await prisma.authToken.findUnique({ where: { token } });

    if (
      !record ||
      record.type !== "reset" ||
      record.usedAt ||
      record.expiresAt < new Date()
    ) {
      return NextResponse.json(
        { error: "This link is invalid or has expired." },
        { status: 400 }
      );
    }

    const hash = await bcryptjs.hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { email: record.email },
        data: { password: hash },
      }),
      prisma.authToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
