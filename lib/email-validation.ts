/**
 * Email configuration validation utilities
 * Use these to verify email settings are correct before sending
 */

export interface EmailConfigStatus {
  provider: 'resend' | 'sendgrid' | 'none';
  isConfigured: boolean;
  hasValidUrl: boolean;
  issues: string[];
}

/**
 * Check if email configuration is valid
 */
export function validateEmailConfig(): EmailConfigStatus {
  const issues: string[] = [];

  // Check provider
  const hasResend = !!process.env.RESEND_API_KEY;
  const hasSendGrid = !!process.env.SENDGRID_API_KEY;

  if (!hasResend && !hasSendGrid) {
    issues.push(
      'No email provider configured. Set RESEND_API_KEY or SENDGRID_API_KEY in .env.local'
    );
  }

  const provider = hasSendGrid ? 'sendgrid' : hasResend ? 'resend' : 'none';

  // Check NEXTAUTH_URL
  const nextrauthUrl = process.env.NEXTAUTH_URL;
  const hasValidUrl = !!nextrauthUrl && (nextrauthUrl.startsWith('http://') || nextrauthUrl.startsWith('https://'));

  if (!hasValidUrl) {
    issues.push(
      `NEXTAUTH_URL is missing or invalid. Current: "${nextrauthUrl}". Should be http://localhost:3000 or https://yourdomain.com`
    );
  }

  return {
    provider,
    isConfigured: hasResend || hasSendGrid,
    hasValidUrl,
    issues,
  };
}

/**
 * Get human-readable email config status for logging
 */
export function getEmailConfigMessage(): string {
  const config = validateEmailConfig();

  if (config.isConfigured && config.hasValidUrl) {
    return `✅ Email configured (${config.provider}), NEXTAUTH_URL: ${process.env.NEXTAUTH_URL}`;
  }

  if (!config.isConfigured) {
    return '⚠️  Email provider not configured. Emails will log to console only.';
  }

  return `⚠️  Email configuration issue: ${config.issues.join(', ')}`;
}

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate reset/magic token format (should be 64-char hex)
 */
export function isValidToken(token: string): boolean {
  return /^[a-f0-9]{64}$/.test(token);
}

/**
 * Validate that a URL link is properly formed
 */
export function isValidEmailLink(link: string, expectedBase?: string): boolean {
  try {
    const url = new URL(link);

    // Check protocol
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false;
    }

    // Check base URL if provided
    if (expectedBase) {
      const expected = new URL(expectedBase);
      if (url.origin !== expected.origin) {
        return false;
      }
    }

    // Check for token parameter
    const token = url.searchParams.get('token');
    if (!token || !isValidToken(token)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
