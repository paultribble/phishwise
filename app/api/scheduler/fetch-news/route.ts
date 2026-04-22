import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const SCHEDULER_SECRET = process.env.SCHEDULER_SECRET;

const RSS_FEEDS = [
  {
    url: "https://www.cisa.gov/feeds/alerts.xml",
    source: "CISA Alerts",
  },
  {
    url: "https://krebsonsecurity.com/feed/",
    source: "Krebs on Security",
  },
  {
    url: "https://news.ycombinator.com/rss",
    source: "Hacker News",
  },
  {
    url: "https://isc.sans.edu/feeds/daily-stormcast.xml",
    source: "SANS ISC Stormcast",
  },
];

async function parseRSSFeed(url: string, source: string) {
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const text = await response.text();
    const items: Array<{
      title: string;
      summary: string;
      url: string;
      publishedAt: Date;
      imageUrl?: string;
    }> = [];

    const urlMatch = text.match(/<link>([^<]+)<\/link>/g) || [];
    const titleMatch = text.match(/<title>([^<]+)<\/title>/g) || [];
    const descMatch = text.match(/<description>([^<]+)<\/description>/g) || [];
    const pubMatch = text.match(/<pubDate>([^<]+)<\/pubDate>/g) || [];

    // Extract media URLs (RSS image elements)
    const mediaMatch = text.match(/<media:content[^>]*url="([^"]+)"/gi) || [];
    const imageMatch = text.match(/<image><url>([^<]+)<\/url>/gi) || [];

    for (let i = 1; i < Math.min(titleMatch.length, 5); i++) {
      const title = titleMatch[i]?.replace(/<\/?title>/g, "") || "Untitled";
      const summary = (descMatch[i]?.replace(/<\/?description>/g, "") || "No summary").substring(0, 300);
      const itemUrl = urlMatch[i]?.replace(/<\/?link>/g, "") || "";
      const pubDate = pubMatch[i]?.replace(/<\/?pubDate>/g, "") || new Date().toISOString();

      // Try to extract image from media elements or use a placeholder
      let imageUrl: string | undefined;
      if (i <= mediaMatch.length) {
        const match = mediaMatch[i - 1]?.match(/url="([^"]+)"/);
        if (match) imageUrl = match[1];
      }

      if (itemUrl) {
        items.push({
          title,
          summary,
          url: itemUrl,
          publishedAt: new Date(pubDate),
          imageUrl,
        });
      }
    }

    return items;
  } catch (error) {
    console.error(`Error parsing ${source} RSS feed:`, error);
    return [];
  }
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const secret = authHeader?.replace("Bearer ", "");

  if (!SCHEDULER_SECRET || secret !== SCHEDULER_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const allItems: Array<{
      title: string;
      summary: string;
      url: string;
      source: string;
      publishedAt: Date;
      imageUrl?: string;
    }> = [];

    for (const feed of RSS_FEEDS) {
      const items = await parseRSSFeed(feed.url, feed.source);
      allItems.push(
        ...items.map((item) => ({
          ...item,
          source: feed.source,
        }))
      );
    }

    let upsertedCount = 0;
    for (const item of allItems) {
      try {
        await prisma.newsItem.upsert({
          where: { url: item.url },
          update: { fetchedAt: new Date() },
          create: {
            title: item.title,
            summary: item.summary,
            url: item.url,
            source: item.source,
            publishedAt: item.publishedAt,
            imageUrl: item.imageUrl,
            fetchedAt: new Date(),
          },
        });
        upsertedCount++;
      } catch (error) {
        console.error(`Failed to upsert news item ${item.url}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Fetched and stored ${upsertedCount} news items`,
      itemsProcessed: allItems.length,
    });
  } catch (error) {
    console.error("News fetch scheduler failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
