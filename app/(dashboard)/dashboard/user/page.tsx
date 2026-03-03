"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";
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
import { Mail, MousePointerClick, BookCheck, TrendingDown, CheckCircle2 } from "lucide-react";

type SimEntry = {
  id: string;
  subject: string;
  sentAt: string;
  clicked: boolean;
  completedAt: string | null;
};

function UserDashboardContent() {
  const searchParams = useSearchParams();
  const { data: session, status, update } = useSession();

  const [stats, setStats] = useState({ totalSent: 0, totalClicked: 0, totalCompleted: 0 });
  const [history, setHistory] = useState<SimEntry[]>([]);
  const [pendingTraining, setPendingTraining] = useState<{ id: string; name: string }[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);

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
      if (userData.pendingTraining) {
        setPendingTraining(userData.pendingTraining);
      }
      setDataLoading(false);
    });
  }, [status]);

  async function handleSendDemoEmail() {
    setSendingEmail(true);
    try {
      const res = await fetch("/api/demo/send-test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.user?.email }),
      });
      if (res.ok) {
        alert("Demo phishing email sent! Check your inbox.");
      } else {
        alert("Failed to send email. Check console for details.");
      }
    } catch {
      alert("Error sending email");
    } finally {
      setSendingEmail(false);
    }
  }

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

      {/* Training Complete Success Banner */}
      {searchParams.get("completed") === "true" && (
        <Card className="border-success-500/50 bg-success-500/10">
          <CardContent className="flex items-center gap-3 py-4">
            <CheckCircle2 className="h-5 w-5 text-success-400" />
            <p className="text-success-300">Training completed! Your progress has been updated.</p>
          </CardContent>
        </Card>
      )}

      {/* Pending Training */}
      {pendingTraining.length > 0 && (
        <Card className="border-warning-500/50 bg-warning-500/10">
          <CardHeader>
            <CardTitle className="text-warning-300">Pending Training</CardTitle>
            <CardDescription className="text-warning-200/80">
              Complete these modules to improve your awareness score
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingTraining.map((mod) => (
              <div key={mod.id} className="flex items-center justify-between rounded-lg border border-warning-500/30 bg-black/20 px-4 py-3">
                <span className="text-gray-200">{mod.name}</span>
                <Link
                  href={`/training/${mod.id}`}
                  className="text-sm font-medium text-warning-400 hover:text-warning-300"
                >
                  Complete Training →
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

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

      {/* Demo Email Send Button */}
      <div className="text-center">
        <button
          onClick={handleSendDemoEmail}
          disabled={sendingEmail}
          className="text-xs text-gray-500 hover:text-gray-400 underline disabled:opacity-50"
        >
          {sendingEmail ? "Sending..." : "Send me a demo phishing email"}
        </button>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
    </div>
  );
}

export default function UserDashboard() {
  return (
    <Suspense fallback={<LoadingState />}>
      <UserDashboardContent />
    </Suspense>
  );
}
