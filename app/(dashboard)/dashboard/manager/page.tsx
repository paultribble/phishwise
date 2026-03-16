"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Mail,
  MousePointerClick,
  TrendingDown,
  ShieldAlert,
  Copy,
  Check,
  Settings,
  Send,
  Download,
} from "lucide-react";
import { bebas, playfair } from "@/lib/fonts";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type UserPerformance = {
  userId: string;
  name: string;
  email: string;
  totalSent: number;
  totalClicked: number;
  clickRate: number;
  lastSimulation: string | null;
  trainingsCompleted: number;
  trend: number;
};

type AnalyticsData = {
  school: {
    id: string;
    name: string;
    inviteCode: string;
    frequency: string;
    totalUsers: number;
    createdAt: string;
  };
  aggregateStats: {
    totalSimulationsSent: number;
    totalSimulationsClicked: number;
    averageClickRate: number;
    usersNeedingAttention: number;
    mostFailedTemplateId: string | null;
  };
  userPerformance: UserPerformance[];
  recentActivity: Array<{
    type: string;
    userId: string;
    userName: string;
    timestamp: string;
    details: string;
  }>;
};

type School = {
  id: string;
  name: string;
  inviteCode: string;
  frequency: string;
};

export default function ManagerDashboard() {
  const { data: session, status, update } = useSession();

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  const [schoolName, setSchoolName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [showInvite, setShowInvite] = useState(false);
  const [copied, setCopied] = useState(false);

  const [frequency, setFrequency] = useState("weekly");
  const [savingFrequency, setSavingFrequency] = useState(false);

  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [triggeringSimulation, setTriggeringSimulation] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [riskFilter, setRiskFilter] = useState<"all" | "low" | "medium" | "high">("all");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [templates, setTemplates] = useState<
    Array<{
      id: string;
      name: string;
      subject: string;
      difficulty: number;
      fromAddress: string;
      moduleId: string;
      moduleName: string;
    }>
  >([]);
  const [selectedTemplateDetails, setSelectedTemplateDetails] = useState<{
    id: string;
    name: string;
    subject: string;
    body: string;
    fromAddress: string;
    moduleName: string;
  } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [debugOutput, setDebugOutput] = useState<string[]>([]);

  useEffect(() => {
    if (status !== "authenticated") return;

    Promise.all([
      fetch("/api/manager/analytics").then((r) => r.json()),
      fetch("/api/users").then((r) => r.json()),
    ])
      .then(([analyticsData, userData]) => {
        if (analyticsData.school) {
          setAnalytics(analyticsData);
          setFrequency(analyticsData.school.frequency || "weekly");
        }
        setDataLoading(false);
      });
  }, [status]);

  if (status === "loading" || dataLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    redirect("/login");
  }

  async function handleChangeFrequency(newFrequency: string) {
    setSavingFrequency(true);
    try {
      const res = await fetch(`/api/schools/${analytics?.school.id}/frequency`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frequency: newFrequency }),
      });

      if (res.ok) {
        setFrequency(newFrequency);
        setAnalytics((prev) =>
          prev ? { ...prev, school: { ...prev.school, frequency: newFrequency } } : null
        );
      }
    } catch (error) {
      console.error("Failed to update frequency:", error);
    } finally {
      setSavingFrequency(false);
    }
  }

  async function loadTemplates() {
    try {
      const res = await fetch("/api/training/modules");
      const data = await res.json();
      const templateList = data.modules.flatMap((module: any) =>
        (module.templates || []).map((t: any) => ({
          id: t.id,
          name: t.name,
          subject: t.subject,
          difficulty: t.difficulty,
          fromAddress: t.fromAddress,
          moduleId: module.id,
          moduleName: module.name,
        }))
      );
      setTemplates(templateList);
      addDebugLog(`Loaded ${templateList.length} templates from ${data.modules.length} modules`);
    } catch (error) {
      addDebugLog(`Failed to load templates: ${error}`);
    }
  }

  async function loadTemplatePreview(templateId: string) {
    try {
      setPreviewLoading(true);
      const res = await fetch(`/api/templates/${templateId}`);
      const data = await res.json();

      if (res.ok && data.template) {
        setSelectedTemplateDetails({
          id: data.template.id,
          name: data.template.name,
          subject: data.template.subject,
          body: data.template.body,
          fromAddress: data.template.fromAddress || "security@verify-account.com",
          moduleName: data.template.module?.name || "Unknown Module",
        });
      }
    } catch (error) {
      console.error("Failed to load template preview:", error);
    } finally {
      setPreviewLoading(false);
    }
  }

  function addDebugLog(msg: string) {
    const timestamp = new Date().toLocaleTimeString();
    setDebugOutput((prev) => [...prev, `[${timestamp}] ${msg}`]);
  }

  function getFilteredUsers() {
    if (!analytics?.userPerformance) return [];
    return analytics.userPerformance.filter((user) => {
      if (riskFilter === "all") return true;
      const clickRate = user.clickRate;
      if (riskFilter === "low") return clickRate <= 30;
      if (riskFilter === "medium") return clickRate > 30 && clickRate <= 50;
      if (riskFilter === "high") return clickRate > 50;
      return true;
    });
  }

  async function handleTriggerSimulation() {
    setTriggeringSimulation(true);
    setDebugOutput([]);
    addDebugLog("Preparing to send simulations...");

    if (!selectedTemplateId) {
      addDebugLog("ERROR: No template selected");
      setTriggeringSimulation(false);
      return;
    }

    const usersToSend = Array.from(selectedUsers);
    if (usersToSend.length === 0) {
      addDebugLog("ERROR: No users selected");
      setTriggeringSimulation(false);
      return;
    }

    addDebugLog(`Selected ${usersToSend.length} user(s) to receive simulation`);
    addDebugLog(`Template ID: ${selectedTemplateId}`);

    try {
      addDebugLog("Sending simulations to API...");
      const res = await fetch("/api/simulations/send-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIds: usersToSend,
          templateId: selectedTemplateId,
          debug: true,
        }),
      });

      const data = await res.json();
      addDebugLog(`API Response Status: ${res.status}`);

      if (data.debug?.logs) {
        data.debug.logs.forEach((log: string) => addDebugLog(log));
      }

      if (res.ok) {
        addDebugLog(`✅ Successfully sent to ${data.sent} user(s)`);
        if (data.failed > 0) {
          addDebugLog(`⚠️ Failed to send to ${data.failed} user(s)`);
        }
      } else {
        addDebugLog(`ERROR: ${data.error || "Failed to send simulations"}`);
      }
    } catch (error) {
      addDebugLog(`ERROR: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setTriggeringSimulation(false);
    }
  }

  async function handleCreateSchool(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    const res = await fetch("/api/schools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: schoolName }),
    });
    const data = await res.json();
    if (!res.ok) {
      setCreateError(data.error ?? "Failed to create school");
      setCreating(false);
      return;
    }
    await update();
    // Reload analytics
    const analyticsRes = await fetch("/api/manager/analytics");
    const analyticsData = await analyticsRes.json();
    if (analyticsData.school) {
      setAnalytics(analyticsData);
      setFrequency(analyticsData.school.frequency || "weekly");
    }
    setShowInvite(true);
    setCreating(false);
  }

  function handleCopy() {
    if (!analytics?.school) return;
    navigator.clipboard.writeText(analytics.school.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const glassCard = "rounded-xl border border-white/[0.06] bg-[#1a1a2e]/80 backdrop-blur-sm";

  // No analytics loaded yet — show create form
  if (!analytics) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back,{" "}
            <span className={`${bebas.className} tracking-widest text-4xl`}>
              {session?.user?.name ?? "Manager"}
            </span>
          </h1>
          <p className="mt-1 text-slate-300">
            Manage your school&apos;s phishing awareness training
          </p>
        </div>
        <Card className={glassCard}>
          <CardHeader>
            <CardTitle className="text-white">Create Your School</CardTitle>
            <CardDescription className="text-slate-300">
              Give your school a name to get started. You&apos;ll receive an invite code to share with users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleCreateSchool}
              className="flex flex-col gap-4 sm:flex-row sm:items-end"
            >
              <div className="flex-1 space-y-1">
                <label
                  className="text-sm font-medium text-slate-300"
                  htmlFor="school-name"
                >
                  School name
                </label>
                <input
                  id="school-name"
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="e.g. University of Arkansas"
                  className="w-full rounded-md border border-white/10 bg-[#252540] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={creating}
                className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow-[0_0_15px_rgba(29,78,216,0.3)] transition-colors hover:bg-blue-600 disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create School"}
              </button>
            </form>
            {createError && (
              <p className="mt-2 text-sm text-red-400">{createError}</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare chart data
  const userChartData = analytics?.userPerformance.map((u) => ({
    name: u.name,
    clickRate: u.clickRate,
  })) || [];

  const trendChartData = [
    { week: "Week 1", clickRate: 45 },
    { week: "Week 2", clickRate: 42 },
    { week: "Week 3", clickRate: 48 },
    { week: "Week 4", clickRate: 41 },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f1a] space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back,{" "}
                <span className={`${bebas.className} tracking-widest text-4xl`}>
                  {session?.user?.name ?? "Manager"}
                </span>
              </h1>
              <p className="mt-1 text-slate-300">
                <span className={`${playfair.className} text-white`}>
                  {analytics?.school.name}
                </span>
                {" "}&mdash; phishing awareness overview
              </p>
            </div>
            <div className="flex gap-2 shrink-0 flex-wrap">
              <button
                onClick={() => window.location.href = "/api/manager/export"}
                className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow-[0_0_15px_rgba(29,78,216,0.3)] transition-colors hover:bg-blue-600"
              >
                <Download className="mr-1 inline h-4 w-4" />
                Export Report (CSV)
              </button>
              <button
                onClick={() => {
                  setShowTriggerModal(true);
                  loadTemplates();
                  setDebugOutput([]);
                }}
                className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow-[0_0_15px_rgba(29,78,216,0.3)] transition-colors hover:bg-blue-600"
              >
                <Send className="mr-1 inline h-4 w-4" />
                Send Simulation
              </button>
              <Link
                href="/dashboard/manager/settings"
                className="rounded-md border border-white/[0.06] bg-[#1a1a2e]/80 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-[#252540]"
              >
                <Settings className="mr-1 inline h-4 w-4" />
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* School Snapshot Card */}
      <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#1a1a2e]/80 backdrop-blur-sm p-6">
        <div className="absolute top-0 left-6 right-6 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.5) 50%, transparent)" }} />
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] font-semibold text-blue-400 mb-2">
              School Overview
            </p>
            <p className={`text-2xl font-bold text-white ${playfair.className}`}>
              {analytics?.school.name}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.06]">
            <div>
              <p className="text-xs text-slate-500 mb-1">Invite Code</p>
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono text-emerald-400 bg-black/30 px-2 py-1 rounded">
                  {analytics?.school.inviteCode}
                </code>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded hover:bg-white/10 cursor-pointer transition-colors"
                  title="Copy invite code"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-slate-400" />}
                </button>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Total Members</p>
              <p className="text-xl font-bold text-white">{analytics?.school.totalUsers ?? 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div>
        <h2 className="mb-4 text-xs uppercase tracking-[0.18em] font-semibold text-blue-400">
          School Performance
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className={`${glassCard} p-5 relative overflow-hidden`}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Simulations Sent</span>
              <Mail className="h-4 w-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {analytics?.aggregateStats.totalSimulationsSent ?? 0}
            </div>
          </div>
        </div>

        <div className={`${glassCard} p-5 relative overflow-hidden`}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Simulations Clicked</span>
              <MousePointerClick className="h-4 w-4 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-red-400">
              {analytics?.aggregateStats.totalSimulationsClicked ?? 0}
            </div>
          </div>
        </div>

        <div className={`${glassCard} p-5 relative overflow-hidden`}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Avg Click Rate</span>
              <TrendingDown className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400">
              {analytics?.aggregateStats.averageClickRate ?? 0}%
            </div>
          </div>
        </div>

        <div className={`${glassCard} p-5 relative overflow-hidden`}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Users at Risk</span>
              <ShieldAlert className="h-4 w-4 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-red-400">
              {analytics?.aggregateStats.usersNeedingAttention ?? 0}
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Team Performance Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs uppercase tracking-[0.18em] font-semibold text-blue-400">
            Team Performance
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowTriggerModal(true);
                loadTemplates();
                setDebugOutput([]);
              }}
              className="text-sm px-3 py-1.5 rounded border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors cursor-pointer"
            >
              <Send className="mr-1 inline h-3 w-3" />
              Send Simulation
            </button>
          </div>
        </div>

        <div className={glassCard}>
          <div className="p-6 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">User Performance</h3>
                <p className="mt-1 text-sm text-slate-300">
                  Click rates and training completion for all users
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead className="sticky top-0 bg-[#1a1a2e] border-b border-white/[0.06]">
                <tr className="text-left">
                  <th className="px-6 py-3 font-medium text-slate-300">User</th>
                  <th className="px-6 py-3 font-medium text-slate-300">Sent</th>
                  <th className="px-6 py-3 font-medium text-slate-300">Clicked</th>
                  <th className="px-6 py-3 font-medium text-slate-300">Click Rate</th>
                  <th className="px-6 py-3 font-medium text-slate-300">Training</th>
                  <th className="px-6 py-3 font-medium text-slate-300">Risk</th>
                </tr>
              </thead>
              <tbody>
                {!analytics?.userPerformance || analytics.userPerformance.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No users in this school yet
                    </td>
                  </tr>
                ) : (
                  analytics.userPerformance.map((user) => {
                    let riskColor = "text-emerald-400";
                    let riskLabel = "Low";
                    if (user.clickRate > 50) {
                      riskColor = "text-red-400";
                      riskLabel = "High";
                    } else if (user.clickRate > 30) {
                      riskColor = "text-amber-400";
                      riskLabel = "Medium";
                    }

                    return (
                      <tr
                        key={user.userId}
                        className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-6 py-3">
                          <div>
                            <div className="font-medium text-white">{user.name}</div>
                            <div className="text-xs text-slate-400">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-slate-300">{user.totalSent}</td>
                        <td className="px-6 py-3 text-slate-300">{user.totalClicked}</td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <Progress
                              value={user.clickRate}
                              className="h-2 w-16 bg-gray-700"
                            />
                            <span className={riskColor}>
                              {user.clickRate}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-slate-300">
                          {user.trainingsCompleted}
                        </td>
                        <td className="px-6 py-3">
                          <Badge variant={riskLabel === "Low" ? "success" : riskLabel === "Medium" ? "warning" : "danger"}>
                            {riskLabel}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Frequency Control */}
      <div className={glassCard}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white">Simulation Frequency</h3>
          <p className="mt-1 text-sm text-slate-300">
            How often users in this school receive phishing simulations
          </p>
        </div>
        <div className="px-6 pb-6 flex items-center gap-4">
          <select
            value={frequency}
            onChange={(e) => handleChangeFrequency(e.target.value)}
            disabled={savingFrequency}
            className="rounded-md border border-white/10 bg-[#252540] px-3 py-2 text-sm text-white focus:border-blue-600 focus:outline-none disabled:opacity-50"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          {savingFrequency && <span className="text-sm text-slate-300">Updating...</span>}
        </div>
      </div>

      {/* Analytics & Insights Section */}
      <div>
        <h2 className="mb-4 text-xs uppercase tracking-[0.18em] font-semibold text-blue-400">
          Analytics & Insights
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
        {/* Click Rate Trend */}
        <div className={glassCard}>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white">Click Rate Trend</h3>
            <p className="mt-1 text-sm text-slate-300">
              Weekly average click rate over time
            </p>
          </div>
          <div className="px-6 pb-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="week" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "0.75rem" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="clickRate"
                  stroke="#DC2626"
                  dot={{ fill: "#DC2626" }}
                  name="Click Rate %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Comparison */}
        <div className={glassCard}>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white">User Comparison</h3>
            <p className="mt-1 text-sm text-slate-300">
              Click rates by user
            </p>
          </div>
          <div className="px-6 pb-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userChartData.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "0.75rem" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Bar dataKey="clickRate" fill="#1D4ED8" name="Click Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        </div>
      </div>

      {/* Advanced Trigger Simulation Modal */}
      {showTriggerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`${glassCard} w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6`}>
            <div>
              <h3 className="text-lg font-semibold text-white">Send Phishing Simulation</h3>
              <p className="mt-1 text-sm text-slate-300">
                Target users and select an email template for realistic phishing tests
              </p>
            </div>

            {/* Template Selection - Grouped by Module */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Template (grouped by module)
              </label>
              <select
                value={selectedTemplateId}
                onChange={(e) => {
                  setSelectedTemplateId(e.target.value);
                  if (e.target.value) {
                    loadTemplatePreview(e.target.value);
                  } else {
                    setSelectedTemplateDetails(null);
                  }
                }}
                className="w-full rounded-md border border-white/10 bg-[#252540] px-3 py-2 text-sm text-white focus:border-blue-600 focus:outline-none"
              >
                <option value="">-- Select a template --</option>
                {Array.from(new Map(templates.map((t) => [t.moduleId, t.moduleName])).entries()).map(
                  ([moduleId, moduleName]) => (
                    <optgroup key={moduleId} label={moduleName}>
                      {templates
                        .filter((t) => t.moduleId === moduleId)
                        .map((t) => {
                          const difficultyColors = {
                            1: "🟢",
                            2: "🟡",
                            3: "🟠",
                            4: "🔴",
                            5: "🔴🔴",
                          };
                          const diffLabel =
                            difficultyColors[t.difficulty as keyof typeof difficultyColors] ||
                            `Level ${t.difficulty}`;
                          return (
                            <option key={t.id} value={t.id}>
                              {t.name} • {diffLabel} • From: {t.fromAddress || "noreply@phishwise.app"}
                            </option>
                          );
                        })}
                    </optgroup>
                  )
                )}
              </select>
            </div>

            {/* Email Preview */}
            {selectedTemplateDetails && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Preview
                </label>
                <div className={`${glassCard} p-4 border-l-4 border-blue-500`}>
                  {previewLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] font-semibold text-blue-400 mb-1">
                          From
                        </p>
                        <p className="text-sm text-white font-mono">
                          {selectedTemplateDetails.fromAddress}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] font-semibold text-blue-400 mb-1">
                          Subject
                        </p>
                        <p className="text-sm text-white">{selectedTemplateDetails.subject}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] font-semibold text-blue-400 mb-1">
                          Module
                        </p>
                        <p className="text-sm text-slate-300">{selectedTemplateDetails.moduleName}</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/[0.06]">
                        <p className="text-xs uppercase tracking-[0.18em] font-semibold text-blue-400 mb-2">
                          Preview
                        </p>
                        <div className="bg-[#0f0f1a] rounded border border-white/[0.06] p-3 max-h-48 overflow-y-auto">
                          <div className="text-sm text-slate-300 whitespace-pre-wrap font-mono text-xs leading-relaxed">
                            {selectedTemplateDetails.body}
                          </div>
                          <div className="mt-3 text-center">
                            <a
                              href="#"
                              onClick={(e) => e.preventDefault()}
                              className="inline-block px-3 py-1 bg-blue-700 text-white text-xs font-semibold rounded hover:bg-blue-600 transition-colors"
                            >
                              [Click Here - Tracking Link]
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Risk Category Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Filter by Risk Level
              </label>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                {(["all", "low", "medium", "high"] as const).map((risk) => (
                  <button
                    key={risk}
                    onClick={() => {
                      setRiskFilter(risk);
                      setSelectedUsers(new Set());
                      setSelectAll(false);
                    }}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      riskFilter === risk
                        ? "bg-blue-700 text-white shadow-[0_0_15px_rgba(29,78,216,0.3)]"
                        : "border border-white/[0.06] bg-[#1a1a2e]/80 text-slate-300 hover:bg-[#252540]"
                    }`}
                  >
                    {risk.charAt(0).toUpperCase() + risk.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Select All Toggle */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={(e) => {
                    setSelectAll(e.target.checked);
                    if (e.target.checked) {
                      const userIds = new Set(getFilteredUsers().map((u) => u.userId));
                      setSelectedUsers(userIds);
                    } else {
                      setSelectedUsers(new Set());
                    }
                  }}
                  className="h-4 w-4 rounded border-white/10 bg-[#252540] accent-blue-600"
                />
                <span className="text-sm font-medium text-slate-300">
                  Select all {getFilteredUsers().length} user(s) in this risk category
                </span>
              </label>
            </div>

            {/* User List */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Users ({selectedUsers.size} selected)
              </label>
              <div className="max-h-64 overflow-y-auto rounded-md border border-white/[0.06] bg-[#252540] p-3 space-y-2">
                {getFilteredUsers().length === 0 ? (
                  <p className="text-sm text-slate-400">No users in this risk category</p>
                ) : (
                  getFilteredUsers().map((user) => (
                    <label key={user.userId} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white/5 rounded">
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(user.userId)}
                        onChange={(e) => {
                          const newSet = new Set(selectedUsers);
                          if (e.target.checked) {
                            newSet.add(user.userId);
                          } else {
                            newSet.delete(user.userId);
                          }
                          setSelectedUsers(newSet);
                        }}
                        className="h-4 w-4 rounded border-white/10 bg-[#252540] accent-blue-600"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">{user.name}</div>
                        <div className="text-xs text-slate-400">{user.email}</div>
                      </div>
                      <Badge
                        variant={
                          user.clickRate <= 30
                            ? "success"
                            : user.clickRate <= 50
                            ? "warning"
                            : "danger"
                        }
                      >
                        {user.clickRate}%
                      </Badge>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Debug Output */}
            {debugOutput.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Debug Output
                </label>
                <div className="max-h-48 overflow-y-auto rounded-md border border-white/[0.06] bg-[#0f0f1a] p-3 font-mono text-xs space-y-1">
                  {debugOutput.map((log, i) => (
                    <div
                      key={i}
                      className={
                        log.includes("ERROR") || log.includes("❌")
                          ? "text-red-400"
                          : log.includes("✅")
                          ? "text-emerald-400"
                          : log.includes("⚠️")
                          ? "text-amber-400"
                          : "text-slate-300"
                      }
                    >
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  loadTemplates();
                  handleTriggerSimulation();
                }}
                disabled={triggeringSimulation || selectedUsers.size === 0 || !selectedTemplateId}
                className="flex-1 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow-[0_0_15px_rgba(29,78,216,0.3)] transition-colors hover:bg-blue-600 disabled:opacity-50"
              >
                {triggeringSimulation
                  ? "Sending..."
                  : `Send to ${selectedUsers.size} User${selectedUsers.size !== 1 ? "s" : ""}`}
              </button>
              <button
                onClick={() => {
                  setShowTriggerModal(false);
                  setSelectedUsers(new Set());
                  setSelectAll(false);
                  setDebugOutput([]);
                  setSelectedTemplateId("");
                }}
                disabled={triggeringSimulation}
                className="flex-1 rounded-md border border-white/[0.06] bg-[#1a1a2e]/80 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-[#252540] disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
