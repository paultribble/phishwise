"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Send, CheckCircle, XCircle } from "lucide-react";

type ActivityItem = {
  userId: string;
  userName: string | null;
  userEmail: string | null;
  action: string;
  timestamp: string;
};

type SchedulerData = {
  timestamp: string;
  period: string;
  summary: {
    totalSent: number;
    totalClicked: number;
    totalOpened: number;
    clickRate: number;
    openRate: number;
    uniqueUsersSent: number;
  };
  recentActivity: ActivityItem[];
};

type Toast = { id: number; message: string; type: "success" | "error" };

export default function AdminSchedulerPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<SchedulerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [triggerEmail, setTriggerEmail] = useState("");
  const [triggering, setTriggering] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  function addToast(message: string, type: "success" | "error") {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/scheduler-status");
    if (res.ok) {
      const json = await res.json();
      setData(json);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status === "authenticated") fetchStatus();
  }, [status, fetchStatus]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  async function handleTrigger(e: React.FormEvent) {
    e.preventDefault();
    if (!triggerEmail) return;
    setTriggering(true);
    try {
      const res = await fetch("/api/admin/trigger-simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: triggerEmail }),
      });
      const json = await res.json();
      if (res.ok) {
        addToast(`Simulation sent to ${triggerEmail}`, "success");
        setTriggerEmail("");
        fetchStatus();
      } else {
        addToast(json.error ?? "Failed to send simulation", "error");
      }
    } catch {
      addToast("Network error — could not send simulation", "error");
    } finally {
      setTriggering(false);
    }
  }

  const s = data?.summary;

  return (
    <div className="space-y-8">
      {/* Toast container */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-lg pointer-events-auto transition-all ${
              t.type === "success"
                ? "bg-emerald-900/90 border border-emerald-700/60 text-emerald-200"
                : "bg-red-900/90 border border-red-700/60 text-red-200"
            }`}
          >
            {t.type === "success" ? (
              <CheckCircle className="h-4 w-4 shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 shrink-0" />
            )}
            {t.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Scheduler</h1>
        <p className="mt-1 text-slate-400">
          Simulation activity for the last 7 days
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        </div>
      ) : (
        <>
          {/* Stats summary */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Sent (7d)", value: s?.totalSent ?? 0, sub: "simulation emails" },
              { label: "Opened (7d)", value: s?.totalOpened ?? 0, sub: `${s?.openRate ?? 0}% open rate` },
              { label: "Clicked (7d)", value: s?.totalClicked ?? 0, sub: `${s?.clickRate ?? 0}% click rate` },
              { label: "Unique Users", value: s?.uniqueUsersSent ?? 0, sub: "received at least one" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-[#1a1a2e] border border-white/[0.06] rounded-xl p-6"
              >
                <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Manual trigger */}
          <div className="bg-[#1a1a2e] border border-white/[0.06] rounded-xl p-6">
            <h2 className="text-base font-semibold text-white mb-1">
              Trigger Manual Simulation
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              Send a phishing simulation to a specific user by email address.
              The user must be in a school.
            </p>
            <form onSubmit={handleTrigger} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={triggerEmail}
                onChange={(e) => setTriggerEmail(e.target.value)}
                placeholder="user@example.com"
                className="flex-1 rounded-lg border border-white/[0.08] bg-[#0f0f1a] px-4 py-2 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={triggering}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 shrink-0"
              >
                <Send className="h-4 w-4" />
                {triggering ? "Sending..." : "Send Simulation"}
              </button>
            </form>
          </div>

          {/* Recent activity */}
          <div className="bg-[#1a1a2e] border border-white/[0.06] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h2 className="text-base font-semibold text-white">
                Recent Activity
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">
                Last 50 simulation send events
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-white/[0.06] text-left">
                    <th className="px-4 py-3 font-medium text-slate-400">User</th>
                    <th className="px-4 py-3 font-medium text-slate-400">Email</th>
                    <th className="px-4 py-3 font-medium text-slate-400">Action</th>
                    <th className="px-4 py-3 font-medium text-slate-400">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {!data?.recentActivity || data.recentActivity.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-10 text-center text-slate-500"
                      >
                        No recent simulation activity
                      </td>
                    </tr>
                  ) : (
                    data.recentActivity.map((a, i) => (
                      <tr
                        key={i}
                        className="border-b border-white/[0.04] last:border-0 transition-colors hover:bg-white/[0.02]"
                      >
                        <td className="px-4 py-3 font-medium text-white">
                          {a.userName ?? "Unknown"}
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {a.userEmail ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-400 font-mono text-xs">
                          {a.action}
                        </td>
                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                          {new Date(a.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
