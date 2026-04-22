import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);
    const offset = parseInt(searchParams.get("offset") || "0");

    const [news, total] = await Promise.all([
      prisma.newsItem.findMany({
        orderBy: { publishedAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.newsItem.count(),
    ]);

    return NextResponse.json({
      news,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
