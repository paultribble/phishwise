"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Search, Filter, ExternalLink, RefreshCw } from "lucide-react";
import {
  Mail,
  Key,
  Target,
  AlertTriangle,
  Bug,
  MessageSquare,
  Phone,
  Droplet,
  Crown,
  Shield,
  Copy,
  FileQuestion,
  Gift,
  Users,
  LockOpen,
  Trash2,
  Eye,
  QrCode,
  CreditCard,
  FileText,
  HelpCircle,
  Search as SearchIcon,
  UserCheck,
  Heart,
  Trophy,
  Zap,
  Globe,
  AlertCircle,
  MapPin,
} from "lucide-react";

type ThreatItem = {
  id: string;
  category: string;
  title: string;
  summary: string;
  indicators: string[];
  color: string;
  icon: keyof typeof iconMap;
};

type NewsItem = {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
};

const iconMap = {
  Mail,
  Key,
  Target,
  AlertTriangle,
  Bug,
  MessageSquare,
  Phone,
  Droplet,
  Crown,
  Shield,
  Copy,
  FileQuestion,
  Gift,
  Users,
  LockOpen,
  Trash2,
  Eye,
  QrCode,
  CreditCard,
  FileText,
  HelpCircle,
  Search: SearchIcon,
  UserCheck,
  Heart,
  Trophy,
  Zap,
  Globe,
  AlertCircle,
  MapPin,
};

export default function LearnPage() {
  const { data: session, status } = useSession();
  const [tab, setTab] = useState<"library" | "news">("library");
  const [threats, setThreats] = useState<ThreatItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(false);
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;

    Promise.all([fetchLibrary(), fetchNews()]).then(() => setLoading(false));
  }, [status]);

  async function fetchLibrary(category = "All", search = "") {
    try {
      const params = new URLSearchParams();
      if (category !== "All") params.append("category", category);
      if (search) params.append("search", search);

      const res = await fetch(`/api/library?${params}`);
      const data = await res.json();
      setThreats(data.threats);
      setCategories(data.categories);
    } catch (error) {
      console.error("Failed to fetch library:", error);
    }
  }

  async function fetchNews() {
    try {
      setNewsLoading(true);
      const res = await fetch("/api/news?limit=20");
      const data = await res.json();
      setNews(data.news);
      setLastFetchedAt(new Date());
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setNewsLoading(false);
    }
  }

  async function handleCategoryChange(category: string) {
    setSelectedCategory(category);
    await fetchLibrary(category, searchQuery);
  }

  async function handleSearch() {
    await fetchLibrary(selectedCategory, searchQuery);
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-[#060a10] min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#060a10] relative">
      {/* Atmospheric background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5" />
      </div>

      <div className="relative z-10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Header */}
          <div className="space-y-2 mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-100 to-cyan-300 bg-clip-text text-transparent">
              Security Knowledge Hub
            </h1>
            <p className="text-slate-400">
              Learn about common threats, scams, and security best practices
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-slate-700 pb-4 items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setTab("library")}
                className={`px-6 py-2 font-medium transition-colors ${
                  tab === "library"
                    ? "border-b-2 border-cyan-400 text-cyan-300"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                Threat Library
              </button>
              <button
                onClick={() => setTab("news")}
                className={`px-6 py-2 font-medium transition-colors ${
                  tab === "news"
                    ? "border-b-2 border-cyan-400 text-cyan-300"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                Security News
              </button>
            </div>
            {tab === "news" && (
              <div className="flex items-center gap-3">
                {lastFetchedAt && (
                  <span className="text-xs text-slate-500">
                    Updated {lastFetchedAt.toLocaleTimeString()}
                  </span>
                )}
                <button
                  onClick={() => fetchNews()}
                  disabled={newsLoading}
                  className="p-2 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Refresh news"
                >
                  <RefreshCw className={`h-4 w-4 ${newsLoading ? "animate-spin" : ""}`} />
                </button>
              </div>
            )}
          </div>

          {/* Threat Library Tab */}
          {tab === "library" && (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search threats, scams, indicators..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                      }}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                    />
                    <Search className="absolute right-3 top-3.5 h-5 w-5 text-slate-500" />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="rounded-lg bg-cyan-600 px-6 py-3 text-sm font-medium text-white hover:bg-cyan-500 transition-colors"
                  >
                    Search
                  </button>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 flex-wrap">
                  <Filter className="h-5 w-5 text-slate-500 my-auto" />
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === cat
                          ? "bg-cyan-600/40 border border-cyan-400 text-cyan-300"
                          : "bg-slate-900/50 border border-slate-700 text-slate-300 hover:border-slate-600"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Threat Cards Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {threats.map((threat) => {
                  const Icon = iconMap[threat.icon];
                  const isExpanded = expandedId === threat.id;

                  return (
                    <div
                      key={threat.id}
                      className="rounded-lg border border-slate-700 bg-slate-900/50 overflow-hidden hover:border-slate-600 transition-colors group"
                    >
                      {/* Gradient Header with Icon */}
                      <div
                        className={`h-24 bg-gradient-to-br ${threat.color} relative overflow-hidden p-4 flex items-end`}
                      >
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute inset-0 bg-dot-pattern" />
                        </div>
                        <div className="relative flex items-end gap-3 w-full">
                          {Icon && (
                            <Icon className="h-8 w-8 text-white/80 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-xs uppercase tracking-widest text-white/70">
                              {threat.category}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-3">
                        <h3 className="font-semibold text-white line-clamp-2">
                          {threat.title}
                        </h3>

                        <p className="text-sm text-slate-400 line-clamp-2">
                          {threat.summary}
                        </p>

                        <button
                          onClick={() =>
                            setExpandedId(isExpanded ? null : threat.id)
                          }
                          className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                        >
                          {isExpanded ? "Show less" : "View details"}
                        </button>

                        {isExpanded && (
                          <div className="pt-3 border-t border-slate-700 space-y-2">
                            <p className="text-xs font-semibold text-slate-300 uppercase">
                              Red Flags
                            </p>
                            <ul className="space-y-1">
                              {threat.indicators.slice(0, 4).map((ind, i) => (
                                <li
                                  key={i}
                                  className="text-xs text-slate-400 flex gap-2"
                                >
                                  <span className="text-red-400 mt-0.5">•</span>
                                  {ind}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {threats.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-400">No threats found matching your search.</p>
                </div>
              )}
            </div>
          )}

          {/* Security News Tab */}
          {tab === "news" && (
            <div className="space-y-6">
              {news.length === 0 ? (
                <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-8 text-center">
                  <p className="text-slate-400">
                    Security news will be loaded and cached daily. Check back soon!
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {news.map((item) => {
                    const sourceColors: Record<string, { bg: string; accent: string }> = {
                      "CISA": { bg: "from-blue-600 to-blue-800", accent: "blue" },
                      "Krebs on Security": { bg: "from-red-600 to-red-800", accent: "red" },
                      "Hacker News": { bg: "from-orange-600 to-orange-800", accent: "orange" },
                      "SANS ISC": { bg: "from-purple-600 to-purple-800", accent: "purple" },
                    };
                    const colors = sourceColors[item.source] || { bg: "from-cyan-600 to-cyan-800", accent: "cyan" };
                    const publishDate = new Date(item.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });

                    return (
                      <a
                        key={item.id}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative overflow-hidden rounded-lg border border-slate-700 bg-slate-950 transition-all duration-300 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20"
                      >
                        {/* Preview Header with Image or Gradient */}
                        <div
                          className={`relative h-32 overflow-hidden bg-gradient-to-br ${colors.bg}`}
                        >
                          {item.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Globe className="h-12 w-12 text-white/40" />
                            </div>
                          )}

                          {/* Source Badge */}
                          <div className="absolute top-2 right-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/20">
                            <span className={`text-xs font-bold uppercase tracking-wider text-${colors.accent}-300`}>
                              {item.source}
                            </span>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-4 space-y-3">
                          {/* Title */}
                          <h3 className="font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 text-sm leading-tight">
                            {item.title}
                          </h3>

                          {/* Summary */}
                          <p className="text-xs text-slate-400 line-clamp-2">
                            {item.summary}
                          </p>

                          {/* Footer with Date and Link Arrow */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                            <span className="text-xs text-slate-500">{publishDate}</span>
                            <ExternalLink className="h-4 w-4 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
