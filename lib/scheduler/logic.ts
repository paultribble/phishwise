import { prisma } from "@/lib/db";
import crypto from "crypto";

const FREQUENCY_MS = {
  daily: 86400000,
  weekly: 604800000,
  biweekly: 1209600000,
  monthly: 2592000000,
};

/**
 * Generates a unique tracking token for a simulation email.
 * Format: tk_${timestamp}_${randomHex}
 */
export function generateTrackingToken(): string {
  const timestamp = Date.now();
  const randomHex = crypto.randomBytes(8).toString("hex");
  return `tk_${timestamp}_${randomHex}`;
}

/**
 * Selects eligible users for a simulation send based on school frequency.
 * Applies ±20% randomization window to determine eligibility.
 */
export async function selectEligibleUsers() {
  const now = new Date();
  const schools = await prisma.school.findMany({ where: { users: { some: {} } } });
  const eligibleUsers = [];

  for (const school of schools) {
    const frequencyMs = FREQUENCY_MS[school.frequency as keyof typeof FREQUENCY_MS] || FREQUENCY_MS.weekly;
    const randomizationWindow = frequencyMs * 0.2;
    const minTime = now.getTime() - frequencyMs - randomizationWindow;
    const maxTime = now.getTime() - frequencyMs + randomizationWindow;

    const users = await prisma.user.findMany({
      where: {
        schoolId: school.id,
        role: "USER",
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    for (const user of users) {
      // Get the user's last simulation from SimulationEmail records
      const lastSim = await prisma.simulationEmail.findFirst({
        where: { userId: user.id },
        orderBy: { sentAt: "desc" },
        select: { sentAt: true },
      });

      // If user has never had a simulation, send them one
      if (!lastSim) {
        eligibleUsers.push({ ...user, schoolId: school.id });
        continue;
      }

      // Check if enough time has passed since last simulation (with ±20% randomization window)
      const lastSimMs = lastSim.sentAt.getTime();
      const timeSinceLastSim = now.getTime() - lastSimMs;

      // User is eligible if time since last sim is within the window
      if (timeSinceLastSim >= minTime && timeSinceLastSim <= maxTime) {
        eligibleUsers.push({ ...user, schoolId: school.id });
      }
    }
  }

  return eligibleUsers;
}

/**
 * Selects a template for a user weighted by click rate history.
 * Avoids templates from the last 5 sent simulations.
 */
export async function selectTemplate(userId: string, recentTemplateIds: string[]) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { metrics: { select: { totalSent: true, totalClicked: true } } },
  });

  if (!user) return null;

  const clickRate = user.metrics && user.metrics.totalSent > 0
    ? user.metrics.totalClicked / user.metrics.totalSent
    : 0;

  // Determine difficulty based on click rate
  let difficulty = 1;
  if (clickRate < 0.2) difficulty = 3;
  else if (clickRate < 0.4) difficulty = 2;

  // Fetch templates of appropriate difficulty, excluding recent ones
  const templates = await prisma.template.findMany({
    where: {
      difficulty,
      isActive: true,
      id: { notIn: recentTemplateIds },
    },
  });

  if (templates.length === 0) {
    // Fallback: get any active template
    const fallback = await prisma.template.findFirst({
      where: { isActive: true },
    });
    return fallback;
  }

  // Randomly select from matching templates
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Gets recent template IDs for a user (last 5 sent simulations).
 */
export async function getRecentTemplateIds(userId: string): Promise<string[]> {
  const recent = await prisma.simulationEmail.findMany({
    where: { userId },
    orderBy: { sentAt: "desc" },
    take: 5,
    select: { templateId: true },
  });
  return recent.map((r) => r.templateId);
}
