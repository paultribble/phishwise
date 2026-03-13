/**
 * Environment configuration loader
 * Auto-detects if running on production (main) or staging (branch deployment)
 * and selects the appropriate database connection string
 */

export function getEnvironmentConfig() {
  const environment = process.env.ENVIRONMENT || "development";
  const isDevelopment = environment === "development";
  const isProduction = environment === "production";
  const isStaging = environment === "staging";

  // Get database URL based on environment
  let databaseUrl: string;

  if (isProduction) {
    databaseUrl = process.env.DATABASE_URL_PROD || process.env.DATABASE_URL || "";
  } else if (isStaging) {
    databaseUrl = process.env.DATABASE_URL_STAGING || process.env.DATABASE_URL || "";
  } else {
    // Development: prefer DATABASE_URL, fallback to PROD for local testing
    databaseUrl = process.env.DATABASE_URL || process.env.DATABASE_URL_PROD || "";
  }

  if (!databaseUrl) {
    throw new Error(
      `No database URL configured. Set DATABASE_URL, DATABASE_URL_PROD, or DATABASE_URL_STAGING`
    );
  }

  return {
    environment,
    isDevelopment,
    isProduction,
    isStaging,
    databaseUrl,
  };
}

// Validate on module load
if (process.env.NODE_ENV === "production") {
  try {
    getEnvironmentConfig();
  } catch (error) {
    console.error("[ENV] Configuration error:", error);
    throw error;
  }
}
