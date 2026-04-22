import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const test = await prisma.aBTest.findUnique({ where: { id: params.id } });
  if (!test) {
    return NextResponse.json({ error: "Test not found" }, { status: 404 });
  }

  const sims = await prisma.simulationEmail.findMany({
    where: { abTestId: params.id },
    select: { abTestGroup: true, clicked: true, sentAt: true },
    orderBy: { sentAt: "asc" },
  });

  const control = sims.filter((s) => s.abTestGroup === "control");
  const variant = sims.filter((s) => s.abTestGroup === "variant");

  const calcStats = (group: typeof sims) => ({
    total: group.length,
    clicks: group.filter((s) => s.clicked).length,
    clickRate: group.length > 0 ? Math.round((group.filter((s) => s.clicked).length / group.length) * 100) : 0,
  });

  // Cumulative click rates over time (daily buckets)
  const buckets = new Map<string, { control: number; variant: number; controlTotal: number; variantTotal: number }>();
  for (const s of sims) {
    const day = s.sentAt.toISOString().split("T")[0];
    if (!buckets.has(day)) {
      buckets.set(day, { control: 0, variant: 0, controlTotal: 0, variantTotal: 0 });
    }
    const b = buckets.get(day)!;
    if (s.abTestGroup === "control") {
      b.controlTotal++;
      if (s.clicked) b.control++;
    } else {
      b.variantTotal++;
      if (s.clicked) b.variant++;
    }
  }

  const timeline = Array.from(buckets.entries()).map(([date, b]) => ({
    date,
    controlClickRate: b.controlTotal > 0 ? Math.round((b.control / b.controlTotal) * 100) : 0,
    variantClickRate: b.variantTotal > 0 ? Math.round((b.variant / b.variantTotal) * 100) : 0,
  }));

  return NextResponse.json({
    test,
    control: calcStats(control),
    variant: calcStats(variant),
    timeline,
    winner:
      control.length >= 5 && variant.length >= 5
        ? calcStats(control).clickRate < calcStats(variant).clickRate
          ? "control"
          : calcStats(variant).clickRate < calcStats(control).clickRate
          ? "variant"
          : "tie"
        : null,
  });
}
