import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchAndStoreNews } from "@/lib/news-fetcher";
import { apiLogger } from "@/lib/logger";

const log = apiLogger("/api/news/fetch");

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  // Only admins can manually trigger news fetching
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    const e = { statusCode: 403, message: "Admin access required", code: "ERR_FORBIDDEN" };
    log.warn({ userId: session?.user?.id }, "Unauthorized news fetch attempt");
    return NextResponse.json(e, { status: 403 });
  }

  try {
    log.info({ userId: session.user.id }, "Manual news fetch triggered");

    const result = await fetchAndStoreNews();

    log.info(
      {
        userId: session.user.id,
        fetched: result.totalFetched,
        stored: result.totalStored,
        updated: result.totalUpdated,
      },
      "News fetch completed successfully"
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    log.error({ userId: session.user.id, error: String(error) }, "News fetch failed");
    return NextResponse.json(
      {
        error: "Failed to fetch news",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  // Only admins can check fetch status
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const { getNewsStats } = await import("@/lib/news-fetcher");
    const stats = await getNewsStats();

    return NextResponse.json({
      stats,
      message: "Use POST method to trigger a news fetch",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get news stats" },
      { status: 500 }
    );
  }
}
