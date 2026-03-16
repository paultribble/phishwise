/**
 * URL Masking for Phishing Simulation
 *
 * Generates masked URLs that look legitimate to recipients but
 * redirect to PhishWise tracking endpoints
 */

export interface MaskedURLResult {
  /** URL displayed to recipient (looks legitimate) */
  displayUrl: string;
  /** Actual tracking token for redirect */
  trackingToken: string;
}

export function generateMaskedURL(
  templateType: string,
  trackingToken: string
): MaskedURLResult {
  // Map template types to realistic-looking masked domains
  const maskedDomainMap: Record<string, string> = {
    // Credential Harvesting
    amazon_account_verify: "secure-verify.amazon.example.com",
    amazon_account_confirm: "account-confirm.amazon.example.com",
    microsoft_password_reset: "account-security-center.microsoft.example.com",
    microsoft_account_verify: "verify.microsoft.example.com",
    paypal_payment_issue: "resolution-center.paypal.example.com",
    paypal_account_confirm: "account-verify.paypal.example.com",

    // Shipping/Phishing
    ups_delivery_notification: "tracking-status.ups.example.com",
    fedex_delivery_pending: "delivery-confirm.fedex.example.com",

    // Banking
    bank_account_verify: "secure-banking.chase.example.com",
    bank_fraud_alert: "fraud-protection.wellsfargo.example.com",

    // Default
    default: "verify-account.example.com",
  };

  const maskedDomain = maskedDomainMap[templateType] || maskedDomainMap.default;

  // Generate realistic query parameters
  const displayUrl = `https://${maskedDomain}/verify?session=${trackingToken}&device=auto&ref=email`;

  return {
    displayUrl,
    trackingToken,
  };
}

/**
 * URL masking strategies (more variations for realism)
 */
export const URL_MASKING_STRATEGIES = {
  amazon: [
    "secure-verify.amazon.example.com/confirm",
    "account-security.amazon.example.com/verify",
    "login.amazon.example.com/signin/success",
  ],
  microsoft: [
    "account.microsoft.example.com/security/verify",
    "verify.microsoft.example.com/account",
    "login.microsoftonline.example.com/signin",
  ],
  paypal: [
    "www.paypal.example.com/signin",
    "resolution.paypal.example.com/case",
    "billing.paypal.example.com/update",
  ],
  ups: [
    "www.ups.example.com/track",
    "tracking.ups.example.com/status",
    "delivery.ups.example.com/confirm",
  ],
  default: [
    "verify-account.example.com/confirm",
    "secure-verify.example.com/account",
    "account-security.example.com/verify",
  ],
};

/**
 * Get URL masking strategy by template category
 */
export function getURLMaskingStrategy(category: string): string[] {
  return (
    URL_MASKING_STRATEGIES[category as keyof typeof URL_MASKING_STRATEGIES] ||
    URL_MASKING_STRATEGIES.default
  );
}

/**
 * Generate a random masked URL from the strategy
 */
export function getRandomMaskedURL(
  category: string,
  trackingToken: string
): string {
  const strategy = getURLMaskingStrategy(category);
  const randomPath = strategy[Math.floor(Math.random() * strategy.length)];
  return `https://${randomPath}?token=${trackingToken}&ref=email`;
}
