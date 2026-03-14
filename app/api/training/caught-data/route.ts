import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const querySchema = z.object({ token: z.string().min(1).max(200) });

export async function GET(req: NextRequest) {
  const rawToken = req.nextUrl.searchParams.get("token");

  const parsed = querySchema.safeParse({ token: rawToken });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Token required" },
      { status: 400 }
    );
  }
  const token = parsed.data.token;

  try {
    const simEmail = await prisma.simulationEmail.findUnique({
      where: { trackingToken: token },
      include: { template: { include: { module: true } } },
    });

    if (!simEmail) {
      return NextResponse.json(
        { error: "Simulation not found" },
        { status: 404 }
      );
    }

    const trainingModule = simEmail.template.module;
    const content = JSON.parse(trainingModule.content);

    return NextResponse.json({
      subject: simEmail.template.subject || "Security Alert",
      sender: simEmail.template.fromAddress || "security@verify-account.com",
      redFlags: content.redFlags || [],
    });
  } catch (error) {
    console.error("Caught data API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
