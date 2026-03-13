import { PrismaClient } from "@prisma/client";

/**
 * Auto-detect and set DATABASE_URL based on environment
 * This runs before Prisma client is instantiated
 */
function setupDatabaseUrl() {
  // If DATABASE_URL is already set, use it (highest priority)
  if (process.env.DATABASE_URL) {
    return;
  }

  const environment = process.env.ENVIRONMENT || "development";

  if (environment === "production") {
    // Production (main branch)
    process.env.DATABASE_URL = process.env.DATABASE_URL_PROD || "";
  } else if (environment === "staging") {
    // Staging (branch deployments)
    process.env.DATABASE_URL = process.env.DATABASE_URL_STAGING || "";
  } else {
    // Development (local)
    process.env.DATABASE_URL = process.env.DATABASE_URL_PROD || "";
  }

  if (!process.env.DATABASE_URL) {
    throw new Error(
      `No database URL configured. Set DATABASE_URL, DATABASE_URL_PROD, or DATABASE_URL_STAGING`
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
