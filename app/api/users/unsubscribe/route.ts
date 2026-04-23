import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";

/**
 * GET /api/users/unsubscribe?token=userId.timestamp.signature
 * Unsubscribes a user from phishing simulations via a signed token link.
 * Token is HMAC-signed and valid for 30 days.
 */
export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${baseUrl}/?error=invalid_token`);
  }

  // Token format: userId.timestamp.signature
  const parts = token.split(".");
  if (parts.length !== 3) {
    return NextResponse.redirect(`${baseUrl}/?error=invalid_token`);
  }

  const [userId, timestamp, signature] = parts;
  if (!userId || !timestamp || !signature) {
    return NextResponse.redirect(`${baseUrl}/?error=invalid_token`);
  }

  // Verify HMAC signature
  const message = `${userId}.${timestamp}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.NEXTAUTH_SECRET || "")
    .update(message)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.redirect(`${baseUrl}/?error=invalid_token`);
  }

  // Check token expiry (30 days)
  const tokenAge = Date.now() - parseInt(timestamp);
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  if (tokenAge > thirtyDaysMs) {
    return NextResponse.redirect(`${baseUrl}/?error=token_expired`);
  }

  // Update user's unsubscribedAt field
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { unsubscribedAt: new Date() },
    });
  } catch {
    return NextResponse.redirect(`${baseUrl}/?error=user_not_found`);
  }

  return NextResponse.redirect(`${baseUrl}/training?unsubscribed=1`);
}
