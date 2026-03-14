import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const simEmail = await prisma.simulationEmail.findUnique({
      where: { trackingToken: token },
      include: {
        template: {
          include: { module: true },
        },
      },
    });

    if (!simEmail) {
      console.error("Simulation email not found for token:", token);
      return NextResponse.redirect(new URL("/", req.url));
    }

    const moduleId = simEmail.template.module.id;

    if (!simEmail.clicked) {
      await prisma.simulationEmail.update({
        where: { id: simEmail.id },
        data: {
          clicked: true,
          clickedAt: new Date(),
        },
      });

      await prisma.userHistory.create({
        data: {
          userId: simEmail.userId,
          actionType: "simulation_clicked",
          detail: `Clicked simulation email: ${simEmail.template.name}`,
        },
      });

      await prisma.userMetrics.upsert({
        where: { userId: simEmail.userId },
        update: {
          totalClicked: { increment: 1 },
          lastActivity: new Date(),
        },
        create: {
          userId: simEmail.userId,
          totalClicked: 1,
        },
      });

      const existingTraining = await prisma.userTraining.findFirst({
        where: {
          userId: simEmail.userId,
          moduleId,
        },
      });

      if (!existingTraining) {
        await prisma.userTraining.create({
          data: {
            userId: simEmail.userId,
            moduleId,
            assignedAt: new Date(),
            completedAt: null,
          },
        });
      }
    }

    return NextResponse.redirect(
      new URL(`/training/${moduleId}/caught?token=${token}`, req.url)
    );
  } catch (error) {
    console.error("Track endpoint error:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}
