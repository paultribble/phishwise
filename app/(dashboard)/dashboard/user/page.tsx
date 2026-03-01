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
import { Mail, MousePointerClick, BookCheck, TrendingDown } from "lucide-react";

type SimEntry = {
  id: string;
  subject: string;
  sentAt: string;
  clicked: boolean;
  completedAt: string | null;
};

export default function UserDashboard() {
  const { data: session, status, update } = useSession();

  const [stats, setStats] = useState({ totalSent: 0, totalClicked: 0, totalCompleted: 0 });
  const [history, setHistory] = useState<SimEntry[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [inviteCode, setInviteCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joinSuccess, setJoinSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    Promise.all([
      fetch("/api/users").then((r) => r.json()),
      fetch("/api/simulations?limit=5").then((r) => r.json()),
    ]).then(([userData, simData]) => {
      if (userData.metrics) setStats(userData.metrics);
      if (simData.simulations) {
        setHistory(
          simData.simulations.map((s: { id: string; template: { subject: string }; sentAt: string; clicked: boolean; completedAt: string | null }) => ({
            id: s.id,
            subject: s.template.subject,
            sentAt: new Date(s.sentAt).toLocaleDateString(),
            clicked: s.clicked,
            completedAt: s.completedAt,
          }))
        );
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

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setJoining(true);
    setJoinError(null);
    const res = await fetch("/api/schools/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inviteCode }),
    });
    const data = await res.json();
    if (!res.ok) {
      setJoinError(data.error ?? "Failed to join school");
      setJoining(false);
      return;
    }
    setJoinSuccess(`Joined ${data.school.name}!`);
    setJoining(false);
    await update();
  }

  const clickRate = stats.totalSent > 0 ? Math.round((stats.totalClicked / stats.totalSent) * 100) : 0;
  const completionRate =
    stats.totalSent > 0
      ? Math.round(
          ((stats.totalSent - stats.totalClicked) /
            stats.totalSent) *
            100
        )
      : 0;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-gray-200">
          Welcome back, {session.user.name?.split(" ")[0] ?? "User"}
        </h1>
        <p className="mt-1 text-gray-400">
          Here&apos;s your phishing awareness progress
        </p>
      </div>
      /*<div className="min-h-screen flex flex-col">


      {/* Join School — only shown when user has no school */}
      {!session.user.schoolId && (
        <Card className="border-gray-700 bg-phish-blue/30">
          <CardHeader>
            <CardTitle className="text-gray-200">Join a School</CardTitle>
            <CardDescription className="text-gray-400">
              Enter an invite code from your manager to join a school.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {joinSuccess ? (
              <p className="text-sm text-success-400">{joinSuccess}</p>
            ) : (
              <form
                onSubmit={handleJoin}
                className="flex flex-col gap-4 sm:flex-row sm:items-end"
              >
                <div className="flex-1 space-y-1">
                  <label
                    className="text-sm font-medium text-gray-400"
                    htmlFor="invite-code"
                  >
                    Invite code
                  </label>
                  <input
                    id="invite-code"
                    type="text"
                    required
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    placeholder="e.g. A3F7C21B"
                    className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm font-mono text-gray-200 placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={joining}
                  className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
                >
                  {joining ? "Joining..." : "Join School"}
                </button>
              </form>
            )}
            {joinError && (
              <p className="mt-2 text-sm text-danger-400">{joinError}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-700 bg-phish-blue/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Emails Received
            </CardTitle>
            <Mail className="h-4 w-4 text-primary-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-200">
              {stats.totalSent}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-phish-blue/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Links Clicked
            </CardTitle>
            <MousePointerClick className="h-4 w-4 text-danger-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-danger-400">
              {stats.totalClicked}
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
              {stats.totalCompleted}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-phish-blue/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Click Rate
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-warning-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-200">
              {clickRate}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Awareness Score */}
      <Card className="border-gray-700 bg-phish-blue/30">
        <CardHeader>
          <CardTitle className="text-gray-200">Awareness Score</CardTitle>
          <CardDescription className="text-gray-400">
            Percentage of simulations you correctly identified as phishing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <span className="font-medium text-gray-200">{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="bg-gray-700" />
        </CardContent>
      </Card>
      {/* new stuff from sarah */}
<div className="min-h-screen flex flex-col">
      {/* header */}
      <header className="border-b border-gray-700 bg-phish-navy/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-end gap-1 leading-none"
            >
            <span className={`text-4xl tracking-widest text-gray-200 ${bebas.className}`}>
                PHISH
            </span>
            <span className={`text-5xl italic text-gray-400 ${playfair.className}`}>
                WISE
            </span>
        </Link>

          <nav className="flex gap-6 items-center">
            <Link href="/learn-more" className="text-gray-300 hover:text-white transition-colors">
              Learn More
            </Link>
            <Link href="/dashboard/user" className="text-gray-300 hover:text-white transition-colors">
              User
            </Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Top row */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-200">
                Welcome back, {mockUser.name}
              </h1>
              <p className="mt-1 text-gray-400">
                Here&apos;s your phishing awareness progress
              </p>
            </div>

            {/* Logo Icon */}
            <div className={`${cardClass} p-3 flex items-center justify-center`}>
                <Image
                    src="/logo.png"  
                    alt="PhishWise logo"
                    width={48}
                    height={48}
                    className="object-contain"
                />
            </div>
          </div>
          
            {/* analytics  */}
        <section className={`${cardClass} p-8 space-y-6`}>
            <div>
            <p className="text-sm uppercase tracking-wider text-gray-400">Analytics</p>
            <h2 className="text-xl font-semibold text-gray-200 mt-1">User Progress</h2>
            </div>

            {/* mini chart placeholder */}
            <div className="rounded-lg border border-gray-700 bg-black/20 p-6 flex items-center justify-center">
            <div className="text-gray-500 text-sm">Chart placeholder</div>
            </div>

            {/* summary */}
            <div className="pt-2 border-t border-gray-700">
            <p className="text-sm uppercase tracking-wider text-gray-400 mt-4">Summary</p>
            <p className="text-gray-300 mt-2">
                Awareness Score: <span className="font-semibold">{safeRate}%</span>
            </p>
            <p className="text-gray-400 text-sm mt-2">
                Emails: {mockStats.totalSent} · Clicks: {mockStats.totalClicked} · Training Completed:{" "}
                {mockStats.totalCompleted}
            </p>
            </div>
        </section>

        {/* columns */}
        <div className="grid gap-8 lg:grid-cols-2 items-start">
        {/* LEFT column: Next Hit + Recent Activity */}
        <div className="space-y-8">
            {/* next hit */}
            <section className={`${cardClass} p-8`}>
            <p className="text-sm uppercase tracking-wider text-gray-400">Next Hit</p>
            <div className="mt-4 space-y-2 text-gray-200">
                <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Date</span>
                <span>{mockNextHit.date}</span>
                </div>
                <div className="flex justify-between pt-2">
                <span className="text-gray-400">Method</span>
                <span>{mockNextHit.method}</span>
                </div>
            </div>
            </section>

            {/* recent activity */}
            <section className={`${cardClass} p-8`}>
            <p className="text-sm uppercase tracking-wider text-gray-400">User Summary</p>
            <h2 className="text-xl font-semibold text-gray-200 mt-1">Recent Simulations</h2>

            <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                <thead>
                    <tr className="text-left border-b border-gray-700">
                    <th className="py-2 pr-4 text-gray-400 font-medium">Subject</th>
                    <th className="py-2 pr-4 text-gray-400 font-medium">Date</th>
                    <th className="py-2 text-gray-400 font-medium">Clicked</th>
                    </tr>
                </thead>
                <tbody>
                    {mockHistory.map((h) => (
                    <tr key={h.id} className="border-b border-gray-700/50 last:border-0">
                        <td className="py-3 pr-4 text-gray-300">{h.subject}</td>
                        <td className="py-3 pr-4 text-gray-400">{h.sentAt}</td>
                        <td className="py-3 text-gray-300">{h.clicked ? "Yes" : "No"}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </section>
        </div>

        {/* RIGHT column: Associated Users */}
        <div className="space-y-8">
            <section className={`${cardClass} p-8`}>
            <p className="text-sm uppercase tracking-wider text-gray-400">Associated Users</p>
            <h2 className="text-xl font-semibold text-gray-200 mt-1">Your Team / Group</h2>

            <div className="mt-6 space-y-4">
                {mockAssociatedUsers.map((u) => (
                <div
                    key={u.id}
                    className="flex items-center justify-between rounded-lg border border-gray-700 bg-black/20 px-4 py-3"
                >
                    <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gray-600/40 border border-gray-700" />
                    <div className="leading-tight">
                        <div className="text-gray-200 font-medium">{u.name}</div>
                        <div className="text-gray-400 text-xs">{u.email}</div>
                    </div>
                    </div>

                    <span className="text-xs uppercase tracking-wider text-gray-400 border border-gray-700 rounded-md px-2 py-1">
                    {u.role}
                    </span>
                </div>
                ))}
            </div>
            </section>
        </div>
        </div>
          </div>
          {/* end new stuff */}
      {/* Recent Simulations */}
      <Card className="border-gray-700 bg-phish-blue/30">
        <CardHeader>
          <CardTitle className="text-gray-200">Recent Simulations</CardTitle>
          <CardDescription className="text-gray-400">
            Your last 5 phishing simulation results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-gray-700 text-left">
                  <th className="pb-3 pr-4 font-medium text-gray-400">
                    Subject
                  </th>
                  <th className="pb-3 pr-4 font-medium text-gray-400">Date</th>
                  <th className="pb-3 pr-4 font-medium text-gray-400">
                    Status
                  </th>
                  <th className="pb-3 font-medium text-gray-400">Training</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-500">
                      No simulations yet
                    </td>
                  </tr>
                ) : (
                  history.map((sim) => (
                    <tr
                      key={sim.id}
                      className="border-b border-gray-700/50 last:border-0"
                    >
                      <td className="py-3 pr-4 text-gray-300">{sim.subject}</td>
                      <td className="py-3 pr-4 text-gray-400">{sim.sentAt}</td>
                      <td className="py-3 pr-4">
                        {sim.clicked ? (
                          <Badge variant="danger">Clicked</Badge>
                        ) : (
                          <Badge variant="success">Safe</Badge>
                        )}
                      </td>
                      <td className="py-3">
                        {sim.clicked && sim.completedAt ? (
                          <Badge variant="outline" className="text-success-400 border-success-500">
                            Completed
                          </Badge>
                        ) : sim.clicked ? (
                          <Badge variant="outline" className="text-warning-400 border-warning-500">
                            Pending
                          </Badge>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
