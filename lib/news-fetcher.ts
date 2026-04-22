import { prisma } from "./db";

interface RSSItem {
  title: string;
  summary: string;
  url: string;
  publishedAt: Date;
  imageUrl?: string;
}

interface FeedConfig {
  url: string;
  source: string;
}

const RSS_FEEDS: FeedConfig[] = [
  {
    url: "https://www.cisa.gov/feeds/alerts.xml",
    source: "CISA Alerts",
  },
  {
    url: "https://krebsonsecurity.com/feed/",
    source: "Krebs on Security",
  },
  {
    url: "https://isc.sans.edu/feeds/daily-stormcast.xml",
    source: "SANS ISC",
  },
  {
    url: "https://www.bleepingcomputer.com/feed/",
    source: "Bleeping Computer",
  },
  {
    url: "https://www.securityweek.com/feed/",
    source: "SecurityWeek",
  },
];

async function parseRSSFeed(feedUrl: string, source: string): Promise<RSSItem[]> {
  try {
    const response = await fetch(feedUrl, {
      next: { revalidate: 3600 },
      headers: {
        "User-Agent": "PhishWise Security News Fetcher",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const text = await response.text();
    const items: RSSItem[] = [];

    const urlMatch = text.match(/<link>([^<]+)<\/link>/g) || [];
    const titleMatch = text.match(/<title>([^<]+)<\/title>/g) || [];
    const descMatch = text.match(/<description>([^<]+)<\/description>/g) || [];
    const pubMatch = text.match(/<pubDate>([^<]+)<\/pubDate>/g) || [];
    const mediaMatch = text.match(/<media:content[^>]*url="([^"]+)"/gi) || [];

    // Parse up to 10 items per feed
    for (let i = 1; i < Math.min(titleMatch.length, 11); i++) {
      const title = titleMatch[i]?.replace(/<\/?title>/g, "")?.trim() || "Untitled";
      const rawSummary = descMatch[i]?.replace(/<\/?description>/g, "")?.trim() || "No summary";

      // Clean HTML tags from summary
      const summary = rawSummary
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&")
        .substring(0, 300);

      const itemUrl = urlMatch[i]?.replace(/<\/?link>/g, "")?.trim() || "";
      const pubDate = pubMatch[i]?.replace(/<\/?pubDate>/g, "")?.trim() || new Date().toISOString();

      // Try to extract image from media elements
      let imageUrl: string | undefined;
      if (i <= mediaMatch.length && mediaMatch[i - 1]) {
        const match = mediaMatch[i - 1].match(/url="([^"]+)"/);
        if (match) {
          imageUrl = match[1];
        }
      }

      if (itemUrl && title !== "Untitled") {
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

export interface NewsFetchResult {
  success: boolean;
  totalFetched: number;
  totalStored: number;
  totalUpdated: number;
  feedResults: Array<{
    source: string;
    status: "success" | "error";
    itemsFound: number;
    itemsStored: number;
    error?: string;
  }>;
  timestamp: Date;
}

// Cybersecurity keywords to filter articles
const SECURITY_KEYWORDS = [
  // Core security terms
  "security", "phishing", "cyber", "malware", "virus", "hack", "attack",
  "breach", "vulnerability", "exploit", "password", "encryption", "threat",

  // Specific threat types
  "cve", "ransomware", "botnet", "ddos", "trojan", "worm", "spyware", "trojan",
  "credential", "authentication", "ssl", "tls", "firewall", "intrusion",
  "incident", "forensics", "penetration", "audit", "compliance", "pci", "hipaa",
  "gdpr", "zero-day", "patch", "update", "security patch", "hotfix",
  "data breach", "spear phishing", "social engineering", "two-factor",
  "mfa", "access control", "privilege escalation", "endpoint", "network security",
  "cloud security", "application security", "api security", "code injection",
  "xss", "sql injection", "buffer overflow", "privilege escalation",
  "lateral movement", "command injection", "cross-site", "csrf", "cors",
  "security advisory", "alert", "warning", "threat intelligence",

  // Vulnerabilities and fixes
  "bug", "bugs", "fix", "fixed", "fixes", "patch management",
  "vulnerability disclosure", "responsible disclosure",

  // Cybercriminals and law enforcement
  "cybercriminal", "hacker arrested", "indicted", "plea", "guilty",
  "threat actor", "apt", "actor", "criminal", "arrested", "arrest",
  "gang", "member", "botmaster", "stolen", "leak", "leaked",

  // Fraud and scams
  "fraud", "fraudster", "scam", "scamming", "phishing attack",

  // Platforms and browsers
  "ios", "android", "windows", "firefox", "chrome", "safari", "edge",
  "browser", "mobile security", "email security",

  // Organizations and compliance
  "nist", "owasp", "sans", "cisa", "fbi", "secret service",
  "data protection", "privacy", "identity", "identity theft",

  // Additional threat-related terms
  "malicious", "compromise", "compromised", "trojanized", "weaponized",
  "backdoor", "rootkit", "webshell", "c2", "command and control",
  "botnet", "botnet takedown", "infrastructure",
  "spoofing", "impersonation", "deepfake",
];

function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&#8216;": "'",
    "&#8217;": "'",
    "&#8220;": '"',
    "&#8221;": '"',
    "&#8212;": "—",
    "&#8211;": "–",
  };

  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, "g"), char);
  }

  // Also handle numeric entities like &#123;
  decoded = decoded.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(parseInt(dec, 10));
  });

  // Handle hex entities like &#x1F;
  decoded = decoded.replace(/&#x([0-9a-f]+);/gi, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });

  return decoded;
}

function isSecurityRelated(title: string, summary: string): boolean {
  const decodedTitle = decodeHtmlEntities(title);
  const decodedSummary = decodeHtmlEntities(summary);
  const text = (decodedTitle + " " + decodedSummary).toLowerCase();
  return SECURITY_KEYWORDS.some(keyword => text.includes(keyword));
}

export async function fetchAndStoreNews(): Promise<NewsFetchResult> {
  const feedResults: NewsFetchResult["feedResults"] = [];
  let totalFetched = 0;
  let totalStored = 0;
  let totalUpdated = 0;

  for (const feed of RSS_FEEDS) {
    try {
      console.log(`Fetching news from ${feed.source}...`);
      const items = await parseRSSFeed(feed.url, feed.source);

      totalFetched += items.length;
      let feedStored = 0;
      let feedUpdated = 0;

      for (const item of items) {
        try {
          // Filter for security-related content only
          if (!isSecurityRelated(item.title, item.summary)) {
            console.log(`⊘ Skipping non-security article: ${item.title}`);
            continue;
          }

          const result = await prisma.newsItem.upsert({
            where: { url: item.url },
            update: {
              fetchedAt: new Date(),
              imageUrl: item.imageUrl,
            },
            create: {
              title: item.title,
              summary: item.summary,
              url: item.url,
              source: feed.source,
              publishedAt: item.publishedAt,
              imageUrl: item.imageUrl,
              fetchedAt: new Date(),
            },
          });

          if (result) {
            // Check if this was a new creation or update based on timestamps
            const timeSinceCreated = Date.now() - result.fetchedAt.getTime();
            if (timeSinceCreated < 5000) {
              feedStored++;
              totalStored++;
            } else {
              feedUpdated++;
              totalUpdated++;
            }
          }
        } catch (error) {
          console.error(`Failed to upsert news item from ${feed.source}:`, error);
        }
      }

      feedResults.push({
        source: feed.source,
        status: "success",
        itemsFound: items.length,
        itemsStored: feedStored,
      });

      console.log(`✓ ${feed.source}: ${items.length} items found, ${feedStored} stored, ${feedUpdated} updated`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error(`✗ ${feed.source}: ${errorMessage}`);

      feedResults.push({
        source: feed.source,
        status: "error",
        itemsFound: 0,
        itemsStored: 0,
        error: errorMessage,
      });
    }
  }

  const result: NewsFetchResult = {
    success: feedResults.every((f) => f.status === "success"),
    totalFetched,
    totalStored,
    totalUpdated,
    feedResults,
    timestamp: new Date(),
  };

  console.log(`News fetch complete: ${totalFetched} fetched, ${totalStored} new, ${totalUpdated} updated`);

  return result;
}

export async function getLatestNews(limit: number = 20, offset: number = 0) {
  return prisma.newsItem.findMany({
    orderBy: { publishedAt: "desc" },
    take: limit,
    skip: offset,
  });
}

export async function getNewsStats() {
  const [total, lastFetch] = await Promise.all([
    prisma.newsItem.count(),
    prisma.newsItem.findFirst({
      orderBy: { fetchedAt: "desc" },
      select: { fetchedAt: true },
    }),
  ]);

  const sourceStats = await prisma.newsItem.groupBy({
    by: ["source"],
    _count: true,
  });

  return {
    total,
    lastFetchedAt: lastFetch?.fetchedAt,
    sourceStats: sourceStats.map((s) => ({
      source: s.source,
      count: s._count,
    })),
  };
}
