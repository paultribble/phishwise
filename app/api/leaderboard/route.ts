import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!session.user.schoolId) {
    return NextResponse.json({ leaderboard: [], userRank: null });
  }

  const schoolUsers = await prisma.user.findMany({
    where: { schoolId: session.user.schoolId, role: "USER" },
    include: { metrics: true },
  });

  const scored = schoolUsers.map((u) => {
    const sent = u.metrics?.totalSent ?? 0;
    const clicked = u.metrics?.totalClicked ?? 0;
    const completed = u.metrics?.totalCompleted ?? 0;

    const awarenessScore = sent > 0 ? ((sent - clicked) / sent) * 70 : 0;
    const trainingScore = Math.min(completed * 5, 30);
    const totalScore = Math.min(Math.round(awarenessScore + trainingScore), 100);

    const initials = (u.name ?? u.email ?? "?")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return {
      userId: u.id,
      name: u.name || u.email?.split("@")[0] || "User",
      avatarInitials: initials,
      totalScore,
      awarenessScore: Math.round(awarenessScore),
      trainingScore,
      isCurrentUser: u.id === session.user.id,
    };
  });

  scored.sort((a, b) => b.totalScore - a.totalScore);

  const ranked = scored.map((u, i) => ({ ...u, rank: i + 1 }));
  const userRank = ranked.find((u) => u.isCurrentUser) ?? null;

  return NextResponse.json({ leaderboard: ranked, userRank });
}
