"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Building2, Mail, ShieldAlert } from "lucide-react";

type TopTemplate = {
  name: string;
  module: string;
  total: number;
  clicked: number;
  clickRate: number;
};

type PlatformStats = {
  totalUsers: number;
  totalSchools: number;
  totalSimulations: number;
  clickRate: number;
  topTemplates: TopTemplate[];
};

function StatCard({
  label,
  value,
  subtitle,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-[#1a1a2e] border border-white/[0.06] rounded-xl p-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-400">{label}</p>
        <Icon className="h-5 w-5 text-blue-400" />
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
    </div>
  );
}

export default function AdminOverview() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/admin/platform-stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Platform Overview</h1>
        <p className="mt-1 text-slate-400">
          System-wide metrics across all schools and users
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Users"
          value={stats?.totalUsers ?? 0}
          subtitle="All roles combined"
          icon={Users}
        />
        <StatCard
          label="Total Schools"
          value={stats?.totalSchools ?? 0}
          subtitle="Active organizations"
          icon={Building2}
        />
        <StatCard
          label="Simulations Sent"
          value={stats?.totalSimulations ?? 0}
          subtitle="All time"
          icon={Mail}
        />
        <StatCard
          label="Platform Click Rate"
          value={`${stats?.clickRate ?? 0}%`}
          subtitle="Users who clicked a phishing link"
          icon={ShieldAlert}
        />
      </div>

      {/* Top clicked templates */}
      <div className="bg-[#1a1a2e] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-base font-semibold text-white">
            Top Clicked Templates
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Templates with the highest click-through rates
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-white/[0.06] text-left">
                <th className="px-6 py-3 font-medium text-slate-400">
                  Template
                </th>
                <th className="px-6 py-3 font-medium text-slate-400">
                  Module
                </th>
                <th className="px-6 py-3 font-medium text-slate-400">
                  Total Sent
                </th>
                <th className="px-6 py-3 font-medium text-slate-400">
                  Clicked
                </th>
                <th className="px-6 py-3 font-medium text-slate-400">
                  Click Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {!stats?.topTemplates || stats.topTemplates.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No simulation data yet
                  </td>
                </tr>
              ) : (
                stats.topTemplates.map((t, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/[0.04] last:border-0 transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-3 font-medium text-white">
                      {t.name}
                    </td>
                    <td className="px-6 py-3 text-slate-400">{t.module}</td>
                    <td className="px-6 py-3 text-slate-400">{t.total}</td>
                    <td className="px-6 py-3 text-slate-400">{t.clicked}</td>
                    <td className="px-6 py-3">
                      <span
                        className={
                          t.clickRate > 50
                            ? "text-red-400"
                            : t.clickRate > 25
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }
                      >
                        {t.clickRate}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-base font-semibold text-white mb-3">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/admin/users"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Manage Users
          </Link>
          <Link
            href="/dashboard/admin/templates"
            className="rounded-lg bg-[#1a1a2e] border border-white/[0.06] px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.04]"
          >
            Manage Templates
          </Link>
          <Link
            href="/dashboard/admin/modules"
            className="rounded-lg bg-[#1a1a2e] border border-white/[0.06] px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.04]"
          >
            Manage Modules
          </Link>
          <Link
            href="/dashboard/admin/scheduler"
            className="rounded-lg bg-[#1a1a2e] border border-white/[0.06] px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.04]"
          >
            Scheduler
          </Link>
        </div>
      </div>
    </div>
  );
}
