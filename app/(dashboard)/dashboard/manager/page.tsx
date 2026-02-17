"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
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
} from "lucide-react";

type SchoolUser = {
  id: string;
  name: string | null;
  email: string | null;
  metrics: { totalSent: number; totalClicked: number; totalCompleted: number } | null;
};

type School = {
  id: string;
  name: string;
  inviteCode: string;
};

export default function ManagerDashboard() {
  const { data: session, status, update } = useSession();

  const [school, setSchool] = useState<School | null>(null);
  const [schoolUsers, setSchoolUsers] = useState<SchoolUser[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [schoolName, setSchoolName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [showInvite, setShowInvite] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => {
        setSchool(data.user?.school ?? null);
        setSchoolUsers(data.schoolUsers ?? []);
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
    setSchool(data.school);
    setShowInvite(true);
    setCreating(false);
  }

  function handleCopy() {
    if (!school) return;
    navigator.clipboard.writeText(school.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const totalUsers = schoolUsers.length;
  const totalSimulations = schoolUsers.reduce((s, u) => s + (u.metrics?.totalSent ?? 0), 0);
  const avgClickRate =
    totalUsers > 0
      ? Math.round(
          schoolUsers.reduce((s, u) => {
            const sent = u.metrics?.totalSent ?? 0;
            const clicked = u.metrics?.totalClicked ?? 0;
            return s + (sent > 0 ? (clicked / sent) * 100 : 0);
          }, 0) / totalUsers
        )
      : 0;
  const totalTrainingCompleted = schoolUsers.reduce(
    (s, u) => s + (u.metrics?.totalCompleted ?? 0),
    0
  );

  // No school yet — show create form
  if (!school) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-200">School Overview</h1>
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-200">{school.name}</h1>
          <p className="mt-1 text-gray-400">
            Manage your school&apos;s phishing awareness training
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700">
            Send Simulation
          </button>
          <button
            onClick={() => setShowInvite((v) => !v)}
            className="rounded-md border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800"
          >
            Invite Users
          </button>
        </div>
      </div>

      {/* Invite Code Banner */}
      {showInvite && (
        <Card className="border-primary-700 bg-primary-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Invite Code
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="font-mono text-2xl font-bold tracking-widest text-primary-300">
              {school.inviteCode}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-md border border-gray-600 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-gray-800"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-success-400" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copy
                </>
              )}
            </button>
          </CardContent>
        </Card>
      )}

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
            <div className="text-2xl font-bold text-gray-200">{totalUsers}</div>
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
              {totalSimulations}
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
              {avgClickRate}%
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-phish-blue/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Training Completed
            </CardTitle>
            <BookCheck className="h-4 w-4 text-success-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success-400">
              {totalTrainingCompleted}
            </div>
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
                  <th className="pb-3 pr-4 font-medium text-gray-400">Training Done</th>
                  <th className="pb-3 font-medium text-gray-400">Risk</th>
                </tr>
              </thead>
              <tbody>
                {schoolUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-gray-500">
                      No users in this school yet
                    </td>
                  </tr>
                ) : (
                  schoolUsers.map((user) => {
                    const sent = user.metrics?.totalSent ?? 0;
                    const clicked = user.metrics?.totalClicked ?? 0;
                    const completed = user.metrics?.totalCompleted ?? 0;
                    const clickRate = sent > 0 ? Math.round((clicked / sent) * 100) : 0;
                    return (
                      <tr
                        key={user.id}
                        className="border-b border-gray-700/50 last:border-0"
                      >
                        <td className="py-3 pr-4">
                          <div>
                            <div className="font-medium text-gray-300">
                              {user.name ?? "Unknown"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.email ?? ""}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-gray-400">{sent}</td>
                        <td className="py-3 pr-4 text-gray-400">{clicked}</td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <Progress
                              value={clickRate}
                              className="h-2 w-16 bg-gray-700"
                            />
                            <span className="text-gray-300">{clickRate}%</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-gray-400">{completed}</td>
                        <td className="py-3">
                          {clickRate >= 30 ? (
                            <Badge variant="danger">
                              <ShieldAlert className="mr-1 h-3 w-3" />
                              High
                            </Badge>
                          ) : clickRate >= 15 ? (
                            <Badge variant="warning">Medium</Badge>
                          ) : (
                            <Badge variant="success">Low</Badge>
                          )}
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
    </div>
  );
}
