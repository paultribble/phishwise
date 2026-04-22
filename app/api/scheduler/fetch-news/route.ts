import { NextRequest, NextResponse } from "next/server";
import { fetchAndStoreNews } from "@/lib/news-fetcher";
import { apiLogger } from "@/lib/logger";

const log = apiLogger("/api/scheduler/fetch-news");

const SCHEDULER_SECRET = process.env.SCHEDULER_SECRET;

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const secret = authHeader?.replace("Bearer ", "");

  if (!SCHEDULER_SECRET || secret !== SCHEDULER_SECRET) {
    log.warn({}, "Unauthorized scheduler access attempt");
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    log.info({}, "Scheduled news fetch started");

    const result = await fetchAndStoreNews();

    log.info(
      {
        totalFetched: result.totalFetched,
        totalStored: result.totalStored,
        totalUpdated: result.totalUpdated,
      },
      "Scheduled news fetch completed"
    );

    return NextResponse.json({
      ...result,
      message: `Fetched ${result.totalFetched} items, stored ${result.totalStored} new, updated ${result.totalUpdated}`,
    });
  } catch (error) {
    log.error({ error: String(error) }, "Scheduled news fetch failed");
    return NextResponse.json(
      {
        error: "Failed to fetch news",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
