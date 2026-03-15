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
  const { data: session, status } = useSession();

  const [stats, setStats] = useState({ totalSent: 0, totalClicked: 0, totalCompleted: 0 });
  const [history, setHistory] = useState<SimEntry[]>([]);
  const [pendingTraining, setPendingTraining] = useState<{ id: string; name: string }[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

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
    setEmailFeedback(null);
    try {
      const res = await fetch("/api/demo/send-test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.user?.email }),
      });
      if (res.ok) {
        setEmailFeedback({ type: "success", message: "Check your inbox!" });
      } else {
        setEmailFeedback({ type: "error", message: "Failed to send email. Try again later." });
      }
    } catch {
      setEmailFeedback({ type: "error", message: "Error sending email" });
    } finally {
      setSendingEmail(false);
    }
  }

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
    <div className="min-h-screen bg-[#0f0f1a] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {session.user.name?.split(" ")[0] ?? "User"}
          </h1>
          <p className="mt-1 text-slate-400">
            Here&apos;s your phishing awareness progress
          </p>
        </div>

        {/* Training Complete Success Banner */}
        {searchParams.get("completed") === "true" && (
          <div className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-sm p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <p className="text-emerald-300">Training completed! Your progress has been updated.</p>
            </div>
          </div>
        )}

        {/* Pending Training */}
        {pendingTraining.length > 0 && (
          <div className="relative overflow-hidden rounded-xl border border-amber-500/20 bg-amber-500/10 backdrop-blur-sm">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-amber-300">Pending Training</h2>
              <p className="mt-1 text-sm text-amber-200/70">
                Complete these modules to improve your awareness score
              </p>
              <div className="mt-4 space-y-3">
                {pendingTraining.map((mod) => (
                  <div key={mod.id} className="flex items-center justify-between rounded-lg border border-amber-500/20 bg-black/20 px-4 py-3">
                    <span className="text-slate-200">{mod.name}</span>
                    <Link
                      href={`/training/${mod.id}`}
                      className="text-sm font-medium text-amber-400 hover:text-amber-300"
                    >
                      Complete Training &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Join School — only shown when user has no school */}
        {!session.user.schoolId && (
          <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#1a1a2e]/80 backdrop-blur-sm p-6">
            <div className="absolute top-0 left-6 right-6 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.5) 50%, transparent)" }} />
            <h2 className="text-lg font-semibold text-white">Get Started</h2>
            <p className="mt-1 text-sm text-slate-400">
              Join a school or create one to start your phishing awareness training.
            </p>
            <div className="mt-4">
              <Link
                href="/dashboard/onboarding"
                className="inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_20px_rgba(37,99,235,0.35)] transition-colors hover:bg-blue-600"
              >
                Join or Create a School &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Emails Received", value: stats.totalSent, icon: Mail, iconColor: "text-blue-400", valueColor: "text-white" },
            { label: "Links Clicked", value: stats.totalClicked, icon: MousePointerClick, iconColor: "text-red-400", valueColor: "text-red-400" },
            { label: "Training Completed", value: stats.totalCompleted, icon: BookCheck, iconColor: "text-emerald-400", valueColor: "text-emerald-400" },
            { label: "Click Rate", value: `${clickRate}%`, icon: TrendingDown, iconColor: "text-amber-400", valueColor: "text-white" },
          ].map((stat) => (
            <div key={stat.label} className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#1a1a2e]/80 backdrop-blur-sm p-5">
              <div className="absolute top-0 left-6 right-6 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.5) 50%, transparent)" }} />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">{stat.label}</span>
                <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
              <div className={`mt-2 text-2xl font-bold ${stat.valueColor}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Awareness Score */}
        <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#1a1a2e]/80 backdrop-blur-sm p-6">
          <div className="absolute top-0 left-6 right-6 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.5) 50%, transparent)" }} />
          <h2 className="text-lg font-semibold text-white">Awareness Score</h2>
          <p className="mt-1 text-sm text-slate-400">
            Percentage of simulations you correctly identified as phishing
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Progress</span>
              <span className="font-medium text-white">{completionRate}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Recent Simulations */}
        <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#1a1a2e]/80 backdrop-blur-sm">
          <div className="absolute top-0 left-6 right-6 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.5) 50%, transparent)" }} />
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white">Recent Simulations</h2>
            <p className="mt-1 text-sm text-slate-400">
              Your last 5 phishing simulation results
            </p>
          </div>
          <div className="overflow-x-auto px-6 pb-6">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="pb-3 pr-4 font-medium text-slate-400">Subject</th>
                  <th className="pb-3 pr-4 font-medium text-slate-400">Date</th>
                  <th className="pb-3 pr-4 font-medium text-slate-400">Status</th>
                  <th className="pb-3 font-medium text-slate-400">Training</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-500">
                      No simulations yet
                    </td>
                  </tr>
                ) : (
                  history.map((sim) => (
                    <tr
                      key={sim.id}
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="py-3 pr-4 text-slate-300">{sim.subject}</td>
                      <td className="py-3 pr-4 text-slate-400">{sim.sentAt}</td>
                      <td className="py-3 pr-4">
                        {sim.clicked ? (
                          <Badge variant="danger">Clicked</Badge>
                        ) : (
                          <Badge variant="success">Safe</Badge>
                        )}
                      </td>
                      <td className="py-3">
                        {sim.clicked && sim.completedAt ? (
                          <Badge variant="outline" className="text-emerald-400 border-emerald-500">
                            Completed
                          </Badge>
                        ) : sim.clicked ? (
                          <Badge variant="outline" className="text-amber-400 border-amber-500">
                            Pending
                          </Badge>
                        ) : (
                          <span className="text-slate-500">&mdash;</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Demo Email Send Button with inline feedback */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={handleSendDemoEmail}
            disabled={sendingEmail}
            className="text-xs text-slate-500 hover:text-slate-400 underline disabled:opacity-50"
          >
            {sendingEmail ? "Sending..." : "Send me a demo phishing email"}
          </button>
          {emailFeedback && (
            <span className={`text-xs font-medium ${emailFeedback.type === "success" ? "text-emerald-400" : "text-red-400"}`}>
              {emailFeedback.type === "success" && "\u2713 "}{emailFeedback.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20 bg-[#0f0f1a]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
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
