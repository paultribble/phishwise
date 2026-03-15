import { NextRequest, NextResponse } from "next/server";
import { validateEmailConfig, getEmailConfigMessage, isValidToken } from "@/lib/email-validation";

/**
 * Debug endpoint to check email configuration
 * Available only in development
 * Usage: curl http://localhost:3000/api/debug/email-config
 */
export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 403 }
    );
  }

  const config = validateEmailConfig();

  return NextResponse.json({
    status: config.isConfigured && config.hasValidUrl ? "healthy" : "warning",
    message: getEmailConfigMessage(),
    details: {
      emailProvider: {
        configured: config.isConfigured,
        type: config.provider,
        resendKey: process.env.RESEND_API_KEY ? "***set***" : "not set",
        sendgridKey: process.env.SENDGRID_API_KEY ? "***set***" : "not set",
      },
      auth: {
        nextAuthUrl: process.env.NEXTAUTH_URL || "not set",
        valid: config.hasValidUrl,
      },
      issues: config.issues.length > 0 ? config.issues : ["none"],
    },
    tokenSampleValid: isValidToken("a".repeat(64)),
    timestamp: new Date().toISOString(),
  });
}
