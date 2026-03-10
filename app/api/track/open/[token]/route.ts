import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/track/open/[token]
 * Returns a 1x1 transparent GIF and marks the simulation as opened.
 * This is called by the tracking pixel injected into phishing emails.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  const token = params.token;

  if (!token || !token.startsWith("tk_")) {
    // Return GIF silently for invalid tokens
    const gif = Buffer.from([
      0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0xff, 0xff, 0xff,
      0x00, 0x00, 0x00, 0x21, 0xf9, 0x04, 0x01, 0x0a, 0x00, 0x01, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x4c, 0x01, 0x00, 0x3b,
    ]);
    return new NextResponse(gif, { headers: { "Content-Type": "image/gif" } });
  }

  try {
    const simEmail = await prisma.simulationEmail.findUnique({
      where: { token },
    });

    if (simEmail && !simEmail.opened) {
      await prisma.simulationEmail.update({
        where: { id: simEmail.id },
        data: {
          opened: true,
          openedAt: new Date(),
        },
      });

      await prisma.userMetrics.upsert({
        where: { userId: simEmail.userId },
        update: { lastActivity: new Date() },
        create: { userId: simEmail.userId },
      });
    }
  } catch (error) {
    console.error("Open tracking error:", error);
  }

  // Return 1x1 transparent GIF
  const gif = Buffer.from([
    0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0xff, 0xff, 0xff,
    0x00, 0x00, 0x00, 0x21, 0xf9, 0x04, 0x01, 0x0a, 0x00, 0x01, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00,
    0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x4c, 0x01, 0x00, 0x3b,
  ]);

  return new NextResponse(gif, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
