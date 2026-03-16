import fs from "fs";
import path from "path";

/**
 * Email Template Processor
 * Converts MJML templates to HTML with tracking link masking
 */

export interface TemplateOptions {
  phishingLink: string;
  userName?: string;
}

/**
 * Renders an MJML template file to HTML
 * Uses a simple template variable replacement (MJML parsing is done offline)
 * Production should use mjml npm package for proper conversion
 */
export function renderTemplate(
  templateFile: string,
  options: TemplateOptions
): string {
  try {
    const templatePath = path.join(
      process.cwd(),
      "lib/email-templates",
      templateFile
    );

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found: ${templateFile}`);
    }

    let content = fs.readFileSync(templatePath, "utf-8");

    // Simple variable replacement
    // In production, would use mjml npm package to compile MJML to HTML
    content = content.replace(/\{\{PHISHING_LINK\}\}/g, options.phishingLink);

    if (options.userName) {
      content = content.replace(/\{\{USER_NAME\}\}/g, options.userName);
    }

    return content;
  } catch (error) {
    console.error("Template rendering error:", error);
    throw error;
  }
}

/**
 * List available templates organized by category
 */
export const PROFESSIONAL_TEMPLATES = {
  "Credential Harvesting": {
    amazon_account_verify: {
      file: "amazon-account-verify.mjml",
      name: "Amazon Account Verification",
      description: "Suspicious login activity warning",
      spoofedFrom: "security@amazon-account-verify.com",
    },
    microsoft_password_reset: {
      file: "microsoft-password-reset.mjml",
      name: "Microsoft Password Reset",
      description: "Password reset verification code",
      spoofedFrom: "account-security@microsoft-verify.com",
    },
    paypal_payment_issue: {
      file: "paypal-payment-issue.mjml",
      name: "PayPal Payment Issue",
      description: "Payment method declined notification",
      spoofedFrom: "billing@paypal-alerts.com",
    },
  },
  Shipping: {
    ups_delivery_notification: {
      file: "ups-delivery-notification.mjml",
      name: "UPS Delivery Notification",
      description: "Package delivery confirmation",
      spoofedFrom: "notify@ups-tracking.com",
    },
  },
};

/**
 * Generate a masked tracking link that looks legitimate
 * Example: actual="/api/track/click/abc123"
 *          masked="https://verify-account-amazon.example.com/verify?session=xyz&ref=login"
 */
export function generateMaskedLink(
  trackingToken: string,
  templateType: string,
  baseUrl: string
): { displayLink: string; redirectLink: string } {
  // Create a legitimate-looking URL based on template type
  const domainMap: Record<string, string> = {
    amazon_account_verify: "verify-account-amazon.example.com",
    microsoft_password_reset: "account-security-verify.microsoft.example.com",
    paypal_payment_issue: "billing-alerts.paypal.example.com",
    ups_delivery_notification: "tracking.ups.example.com",
  };

  const domain = domainMap[templateType] || "verify-account.example.com";

  // Display link that looks real
  const displayLink = `https://${domain}/verify?session=${trackingToken}&ref=security`;

  // Actual redirect link (server-side, hidden from recipient)
  const redirectLink = `${baseUrl}/api/track/click/${trackingToken}`;

  return { displayLink, redirectLink };
}

/**
 * Convert MJML to HTML using offline compilation
 * In production, this should use the MJML package:
 * const mjml2html = require('mjml');
 * But MJML compilation is heavy, so we use pre-compiled templates
 *
 * For now, return as-is; templates should be pre-compiled to HTML
 */
export function compileTemplate(mjmlContent: string): string {
  // In production environment, would do:
  // const { html } = mjml2html(mjmlContent);
  // For now, return raw MJML (will need pre-compilation step)
  return mjmlContent;
}

export type TemplateCategory = keyof typeof PROFESSIONAL_TEMPLATES;
export type TemplateKey = string;

export interface TemplateMetadata {
  file: string;
  name: string;
  description: string;
  spoofedFrom: string;
}

/**
 * Get template metadata by category and key
 */
export function getTemplate(
  category: TemplateCategory,
  templateKey: TemplateKey
): TemplateMetadata | null {
  const categoryTemplates =
    PROFESSIONAL_TEMPLATES[category] as Record<string, TemplateMetadata>;
  return categoryTemplates?.[templateKey] || null;
}
