export const config = {
  isProduction: process.env.ENVIRONMENT === 'production',
  isStaging: process.env.ENVIRONMENT === 'staging',
  isDevelopment: process.env.ENVIRONMENT === 'development',
  enableScheduler: process.env.ENVIRONMENT !== 'development',
  enableSeedDatabase: process.env.ENVIRONMENT !== 'production',
}
