"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
  BookCheck,
  ShieldAlert,
  Copy,
  Check,
  Settings,
  Send,
  Award,
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
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
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

  const cardClass = "bg-phish-blue/20 border border-gray-700 rounded-lg backdrop-blur-sm";

  // No analytics loaded yet — show create form
  if (!analytics) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-200">
            Welcome back,{" "}
            <span className={`${bebas.className} tracking-widest text-4xl`}>
              {session?.user?.name ?? "Manager"}
            </span>
          </h1>
          <p className="mt-1 text-gray-400">
            Manage your school&apos;s phishing awareness training
          </p>
        </div>
        <Card className="border-gray-700 bg-phish-blue/30">
          <CardHeader>
            <CardTitle className="text-gray-200">Create Your School</CardTitle>
            <CardDescription className="text-gray-400">
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
                  className="text-sm font-medium text-gray-400"
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
                  className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={creating}
                className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create School"}
              </button>
            </form>
            {createError && (
              <p className="mt-2 text-sm text-danger-400">{createError}</p>
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-200">
                Welcome back,{" "}
                <span className={`${bebas.className} tracking-widest text-4xl`}>
                  {session?.user?.name ?? "Manager"}
                </span>
              </h1>
              <p className="mt-1 text-gray-400">
                <span className={`${playfair.className} text-gray-300`}>
                  {analytics?.school.name}
                </span>
                {" "}— phishing awareness overview
              </p>
            </div>
            <div className="flex gap-2 shrink-0 flex-wrap">
              <Link
                href="/training/module-3-account-password-traps"
                className="rounded-md bg-success-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-success-700"
              >
                Training Module
              </Link>
              <button
                onClick={() => setShowTriggerModal(true)}
                className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                <Send className="mr-1 inline h-4 w-4" />
                Send Simulation
              </button>
              <Link
                href="/dashboard/manager/settings"
                className="rounded-md border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800"
              >
                <Settings className="mr-1 inline h-4 w-4" />
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-700 bg-phish-blue/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-primary-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-200">
              {analytics?.school.totalUsers ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-phish-blue/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Simulations Sent
            </CardTitle>
            <Mail className="h-4 w-4 text-primary-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-200">
              {analytics?.aggregateStats.totalSimulationsSent ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-phish-blue/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Avg Click Rate
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-warning-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning-400">
              {analytics?.aggregateStats.averageClickRate ?? 0}%
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-phish-blue/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Users at Risk
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-danger-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-danger-400">
              {analytics?.aggregateStats.usersNeedingAttention ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Frequency Control */}
      <Card className="border-gray-700 bg-phish-blue/30">
        <CardHeader>
          <CardTitle className="text-gray-200">Simulation Frequency</CardTitle>
          <CardDescription className="text-gray-400">
            How often users in this school receive phishing simulations
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <select
            value={frequency}
            onChange={(e) => handleChangeFrequency(e.target.value)}
            disabled={savingFrequency}
            className="rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-gray-200 focus:border-primary-500 focus:outline-none disabled:opacity-50"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          {savingFrequency && <span className="text-sm text-gray-400">Updating...</span>}
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Click Rate Trend */}
        <Card className="border-gray-700 bg-phish-blue/30">
          <CardHeader>
            <CardTitle className="text-gray-200">Click Rate Trend</CardTitle>
            <CardDescription className="text-gray-400">
              Weekly average click rate over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="week" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #4B5563" }}
                  labelStyle={{ color: "#D1D5DB" }}
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
          </CardContent>
        </Card>

        {/* User Comparison */}
        <Card className="border-gray-700 bg-phish-blue/30">
          <CardHeader>
            <CardTitle className="text-gray-200">User Comparison</CardTitle>
            <CardDescription className="text-gray-400">
              Click rates by user
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userChartData.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #4B5563" }}
                  labelStyle={{ color: "#D1D5DB" }}
                />
                <Bar dataKey="clickRate" fill="#1D4ED8" name="Click Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* User Performance Table */}
      <Card className="border-gray-700 bg-phish-blue/30">
        <CardHeader>
          <CardTitle className="text-gray-200">User Performance</CardTitle>
          <CardDescription className="text-gray-400">
            Click rates and training completion for all users in your school
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-gray-700 text-left">
                  <th className="pb-3 pr-4 font-medium text-gray-400">User</th>
                  <th className="pb-3 pr-4 font-medium text-gray-400">Sent</th>
                  <th className="pb-3 pr-4 font-medium text-gray-400">Clicked</th>
                  <th className="pb-3 pr-4 font-medium text-gray-400">Click Rate</th>
                  <th className="pb-3 pr-4 font-medium text-gray-400">Training</th>
                  <th className="pb-3 font-medium text-gray-400">Risk</th>
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
                    let riskColor = "text-success-400";
                    let riskLabel = "Low";
                    if (user.clickRate > 50) {
                      riskColor = "text-danger-400";
                      riskLabel = "High";
                    } else if (user.clickRate > 30) {
                      riskColor = "text-warning-400";
                      riskLabel = "Medium";
                    }

                    return (
                      <tr
                        key={user.userId}
                        className="border-b border-gray-700/50 last:border-0"
                      >
                        <td className="py-3 pr-4">
                          <div>
                            <div className="font-medium text-gray-300">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-gray-400">{user.totalSent}</td>
                        <td className="py-3 pr-4 text-gray-400">{user.totalClicked}</td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <Progress
                              value={user.clickRate}
                              className="h-2 w-16 bg-gray-700"
                            />
                            <span
                              className={`${riskColor} text-gray-300`}
                            >
                              {user.clickRate}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-gray-400">
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
        </CardContent>
      </Card>

      {/* Trigger Simulation Modal */}
      {showTriggerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md border-gray-700 bg-gray-950">
            <CardHeader>
              <CardTitle className="text-gray-200">Send Simulation</CardTitle>
              <CardDescription className="text-gray-400">
                Send a phishing simulation to a specific user
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-400">User Email</label>
                <input
                  type="email"
                  value={triggerUserEmail}
                  onChange={(e) => setTriggerUserEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-gray-200"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleTriggerSimulation}
                  disabled={triggeringSimulation}
                  className="flex-1 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
                >
                  {triggeringSimulation ? "Sending..." : "Send"}
                </button>
                <button
                  onClick={() => setShowTriggerModal(false)}
                  className="flex-1 rounded-md border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800"
                >
                  Cancel
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
