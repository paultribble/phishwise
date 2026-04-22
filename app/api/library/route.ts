import { NextRequest, NextResponse } from "next/server";
import threatLibrary from "@/data/threat-library.json";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search")?.toLowerCase();

  let filtered = threatLibrary;

  if (category && category !== "All") {
    filtered = filtered.filter((item) => item.category === category);
  }

  if (search) {
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(search) ||
        item.summary.toLowerCase().includes(search) ||
        item.indicators.some((ind) => ind.toLowerCase().includes(search))
    );
  }

  const categories = Array.from(new Set(threatLibrary.map((item) => item.category)));

  return NextResponse.json({
    threats: filtered,
    categories: ["All", ...categories],
    total: filtered.length,
  });
}
