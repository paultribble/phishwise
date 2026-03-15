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
  Users,
  Mail,
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

  const [triggerUserEmail, setTriggerUserEmail] = useState("");
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [triggeringSimulation, setTriggeringSimulation] = useState(false);

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

  async function handleTriggerSimulation() {
    setTriggeringSimulation(true);
    try {
      const res = await fetch("/api/admin/trigger-simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: triggerUserEmail }),
      });

      if (res.ok) {
        alert(`Simulation sent to ${triggerUserEmail}`);
        setTriggerUserEmail("");
        setShowTriggerModal(false);
      } else {
        alert("Failed to send simulation");
      }
    } catch (error) {
      alert("Error sending simulation");
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
                onClick={() => setShowTriggerModal(true)}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className={`${glassCard} p-5 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between pb-2">
            <p className="text-xs uppercase tracking-[0.18em] font-semibold text-blue-400">
              Total Users
            </p>
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {analytics?.school.totalUsers ?? 0}
          </div>
        </div>

        <div className={`${glassCard} p-5 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between pb-2">
            <p className="text-xs uppercase tracking-[0.18em] font-semibold text-blue-400">
              Simulations Sent
            </p>
            <Mail className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {analytics?.aggregateStats.totalSimulationsSent ?? 0}
          </div>
        </div>

        <div className={`${glassCard} p-5 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between pb-2">
            <p className="text-xs uppercase tracking-[0.18em] font-semibold text-blue-400">
              Avg Click Rate
            </p>
            <TrendingDown className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">
            {analytics?.aggregateStats.averageClickRate ?? 0}%
          </div>
        </div>

        <div className={`${glassCard} p-5 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between pb-2">
            <p className="text-xs uppercase tracking-[0.18em] font-semibold text-blue-400">
              Users at Risk
            </p>
            <ShieldAlert className="h-4 w-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400">
            {analytics?.aggregateStats.usersNeedingAttention ?? 0}
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

      {/* Charts Section */}
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

      {/* User Performance Table */}
      <div className={glassCard}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white">User Performance</h3>
          <p className="mt-1 text-sm text-slate-300">
            Click rates and training completion for all users in your school
          </p>
        </div>
        <div className="px-6 pb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-white/[0.06] text-left">
                  <th className="pb-3 pr-4 font-medium text-slate-300">User</th>
                  <th className="pb-3 pr-4 font-medium text-slate-300">Sent</th>
                  <th className="pb-3 pr-4 font-medium text-slate-300">Clicked</th>
                  <th className="pb-3 pr-4 font-medium text-slate-300">Click Rate</th>
                  <th className="pb-3 pr-4 font-medium text-slate-300">Training</th>
                  <th className="pb-3 font-medium text-slate-300">Risk</th>
                </tr>
              </thead>
              <tbody>
                {!analytics?.userPerformance || analytics.userPerformance.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-gray-500">
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
                        className="border-b border-white/[0.03] last:border-0"
                      >
                        <td className="py-3 pr-4">
                          <div>
                            <div className="font-medium text-white">{user.name}</div>
                            <div className="text-xs text-slate-400">{user.email}</div>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-slate-300">{user.totalSent}</td>
                        <td className="py-3 pr-4 text-slate-300">{user.totalClicked}</td>
                        <td className="py-3 pr-4">
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
                        <td className="py-3 pr-4 text-slate-300">
                          {user.trainingsCompleted}
                        </td>
                        <td className="py-3">
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

      {/* Trigger Simulation Modal */}
      {showTriggerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className={`${glassCard} w-full max-w-md p-6 space-y-4`}>
            <div>
              <h3 className="text-lg font-semibold text-white">Send Simulation</h3>
              <p className="mt-1 text-sm text-slate-300">
                Send a phishing simulation to a specific user
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">User Email</label>
              <input
                type="email"
                value={triggerUserEmail}
                onChange={(e) => setTriggerUserEmail(e.target.value)}
                placeholder="user@example.com"
                className="mt-1 w-full rounded-md border border-white/10 bg-[#252540] px-3 py-2 text-sm text-white focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleTriggerSimulation}
                disabled={triggeringSimulation}
                className="flex-1 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow-[0_0_15px_rgba(29,78,216,0.3)] transition-colors hover:bg-blue-600 disabled:opacity-50"
              >
                {triggeringSimulation ? "Sending..." : "Send"}
              </button>
              <button
                onClick={() => setShowTriggerModal(false)}
                className="flex-1 rounded-md border border-white/[0.06] bg-[#1a1a2e]/80 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-[#252540]"
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
