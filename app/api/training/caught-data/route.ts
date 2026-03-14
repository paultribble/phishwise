import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { error: "Token required" },
      { status: 400 }
    );
  }

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
