import { prisma } from "@/lib/db";

export interface AchievementDef {
  id: string;
  label: string;
  desc: string;
  icon: string;
  color: string;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first_catch",
    label: "First Catch",
    desc: "Reported your first phishing email",
    icon: "🎣",
    color: "#22d3ee",
  },
  {
    id: "training_master",
    label: "Training Master",
    desc: "Completed all assigned training modules",
    icon: "🎓",
    color: "#10b981",
  },
  {
    id: "quick_learner",
    label: "Quick Learner",
    desc: "Completed a module within 24h of assignment",
    icon: "⚡",
    color: "#f59e0b",
  },
  {
    id: "perfect_score",
    label: "Perfect Score",
    desc: "Answered a quiz correctly on first attempt",
    icon: "💯",
    color: "#8b5cf6",
  },
  {
    id: "zero_clicks",
    label: "Zero Clicks",
    desc: "Never clicked a phishing link (3+ simulations sent)",
    icon: "🛡️",
    color: "#2563eb",
  },
  {
    id: "security_champ",
    label: "Security Champion",
    desc: "Completed 5 or more training modules",
    icon: "🏆",
    color: "#f59e0b",
  },
];

export async function checkAndAwardAchievements(userId: string, options?: { firstAttempt?: boolean; justCaught?: boolean }) {
  const [metrics, trainings, history] = await Promise.all([
    prisma.userMetrics.findUnique({ where: { userId } }),
    prisma.userTraining.findMany({ where: { userId } }),
    prisma.userHistory.findMany({
      where: { userId, actionType: "caught_phishing" },
    }),
  ]);

  if (!metrics) return;

  const toAward: string[] = [];

  // first_catch — reported a phishing email
  if (options?.justCaught || history.length > 0) {
    toAward.push("first_catch");
  }

  // training_master — all assigned modules completed
  if (trainings.length > 0 && trainings.every((t) => t.completedAt)) {
    toAward.push("training_master");
  }

  // quick_learner — any module completed within 24h of assignment
  const hasQuickCompletion = trainings.some((t) => {
    if (!t.completedAt) return false;
    const diffMs = t.completedAt.getTime() - t.assignedAt.getTime();
    return diffMs <= 24 * 60 * 60 * 1000;
  });
  if (hasQuickCompletion) toAward.push("quick_learner");

  // perfect_score — first attempt correct quiz
  if (options?.firstAttempt) {
    toAward.push("perfect_score");
  }

  // zero_clicks — never clicked, 3+ sent
  if (metrics.totalClicked === 0 && metrics.totalSent >= 3) {
    toAward.push("zero_clicks");
  }

  // security_champ — 5+ completed
  if (metrics.totalCompleted >= 5) {
    toAward.push("security_champ");
  }

  if (toAward.length === 0) return;

  // Upsert — ignore duplicates via @@unique constraint
  await Promise.all(
    toAward.map((achievementId) =>
      prisma.userAchievement.upsert({
        where: { userId_achievementId: { userId, achievementId } },
        update: {},
        create: { userId, achievementId },
      })
    )
  );
}
