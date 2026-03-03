import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const MODULE_ID = "module-3-account-password-traps";

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
      where: { token },
    });

    if (!simEmail) {
      return NextResponse.json(
        { error: "Simulation not found" },
        { status: 404 }
      );
    }

    const template = await prisma.template.findUnique({
      where: { id: simEmail.templateId },
    });

    if (!simEmail) {
      return NextResponse.json(
        { error: "Simulation not found" },
        { status: 404 }
      );
    }

    const trainingModule = await prisma.trainingModule.findUnique({
      where: { id: MODULE_ID },
    });

    if (!trainingModule) {
      return NextResponse.json(
        { error: "Module not found" },
        { status: 404 }
      );
    }

    const content = JSON.parse(trainingModule.content);

    return NextResponse.json({
      subject: template?.subject || "Security Alert",
      sender: "security@amaz0n-verify.com",
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
