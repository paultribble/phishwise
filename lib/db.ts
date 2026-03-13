import { PrismaClient } from "@prisma/client";

/**
 * Auto-detect and set DATABASE_URL based on environment
 * This runs before Prisma client is instantiated
 *
 * Vercel Prisma Postgres creates:
 * - Production: PRISMA_DATABASE_URL
 * - Staging: STAGING_PRISMA_DATABASE_URL
 */
function setupDatabaseUrl() {
  // If DATABASE_URL is already set, use it (highest priority)
  if (process.env.DATABASE_URL) {
    return;
  }

  const environment = process.env.ENVIRONMENT || "development";

  if (environment === "production") {
    // Production (main branch) - use PRISMA_DATABASE_URL from phishwise-prod
    process.env.DATABASE_URL = process.env.PRISMA_DATABASE_URL || "";
  } else if (environment === "staging") {
    // Staging (branch deployments) - use STAGING_PRISMA_DATABASE_URL from phishwise-staging
    process.env.DATABASE_URL = process.env.STAGING_PRISMA_DATABASE_URL || "";
  } else {
    // Development (local) - prefer PRISMA_DATABASE_URL for testing
    process.env.DATABASE_URL = process.env.PRISMA_DATABASE_URL || "";
  }

  if (!process.env.DATABASE_URL) {
    throw new Error(
      `No database URL configured. Set PRISMA_DATABASE_URL or STAGING_PRISMA_DATABASE_URL`
    );
  }
}

// Set up database URL before creating Prisma client
setupDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
