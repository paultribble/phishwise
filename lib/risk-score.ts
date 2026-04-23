interface RiskInputs {
  totalSent: number;
  totalClicked: number;
  totalCompleted: number;
  recentSent: number;
  recentClicked: number;
  daysSinceLastTraining: number;
}

/**
 * Computes a risk score from 0–100.
 * Higher = more likely to click a phishing email.
 *
 * Weights:
 *   40% overall click rate
 *   40% recent (30-day) click rate
 *   10% training recency penalty (grows after 30 days idle)
 *  -30% max completion bonus (5% per module completed)
 *  +10% baseline (nobody is zero risk)
 */
export function computeRiskScore(inputs: RiskInputs): number {
  const {
    totalSent,
    totalClicked,
    totalCompleted,
    recentSent,
    recentClicked,
    daysSinceLastTraining,
  } = inputs;

  const overallClickRate = totalSent > 0 ? totalClicked / totalSent : 0;
  const recentClickRate = recentSent > 0 ? recentClicked / recentSent : overallClickRate;

  // Training recency penalty: 0 for <= 30 days, up to 1.0 at 120 days
  const trainingPenalty = Math.max(0, (daysSinceLastTraining - 30) / 90);

  // Completion bonus: 5% per module, capped at 30%
  const completionBonus = Math.min(totalCompleted * 0.05, 0.3);

  const raw =
    overallClickRate * 0.4 +
    recentClickRate * 0.4 +
    trainingPenalty * 0.1 -
    completionBonus +
    0.1;

  // Clamp to [0, 1] and convert to 0–100
  return Math.round(Math.min(1, Math.max(0, raw)) * 100);
}

export function getRiskLabel(score: number): "low" | "medium" | "high" {
  if (score < 30) return "low";
  if (score < 60) return "medium";
  return "high";
}

export function getRiskColor(score: number): string {
  if (score < 30) return "#10b981";
  if (score < 60) return "#f59e0b";
  return "#ef4444";
}
