"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "MANAGER" | "ADMIN";
  schoolId: string | null;
  createdAt: string;
  school: { name: string } | null;
  metrics: {
    totalSent: number;
    totalClicked: number;
    totalCompleted: number;
  } | null;
  _count: { simulations: number };
};

type UsersResponse = {
  users: UserRow[];
  total: number;
  page: number;
  pages: number;
};

function RoleBadge({ role }: { role: string }) {
  const colors: Record<string, string> = {
    USER: "bg-blue-950/60 text-blue-400 border-blue-800/40",
    MANAGER: "bg-amber-950/60 text-amber-400 border-amber-800/40",
    ADMIN: "bg-red-950/60 text-red-400 border-red-800/40",
  };
  return (
    <span
      className={`px-2 py-0.5 text-xs font-medium rounded border ${
        colors[role] ?? colors.USER
      }`}
    >
      {role}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-white/[0.04]">
      {[...Array(8)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-white/[0.06] rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<UsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "25" });
    if (roleFilter) params.set("role", roleFilter);
    if (debouncedSearch) params.set("search", debouncedSearch);

    const res = await fetch(`/api/admin/users?${params}`);
    if (res.ok) {
      const json = await res.json();
      setData(json);
    }
    setLoading(false);
  }, [page, roleFilter, debouncedSearch]);

  useEffect(() => {
    if (status === "authenticated") fetchUsers();
  }, [status, fetchUsers]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [roleFilter, debouncedSearch]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  async function handleRoleChange(userId: string, newRole: string) {
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    fetchUsers();
  }

  async function handleDelete(userId: string, userEmail: string) {
    if (
      !window.confirm(
        `Delete ${userEmail}? This cannot be undone and will remove all their simulation history.`
      )
    )
      return;

    const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    if (res.ok) {
      fetchUsers();
    } else {
      const err = await res.json();
      alert(err.error ?? "Failed to delete user");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <p className="mt-1 text-slate-400">
          {data ? `${data.total} total users` : "Loading..."}
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-white/[0.08] bg-[#1a1a2e] px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-white/[0.08] bg-[#1a1a2e] px-4 py-2 text-sm text-slate-300 focus:border-blue-500 focus:outline-none transition-colors"
        >
          <option value="">All roles</option>
          <option value="USER">User</option>
          <option value="MANAGER">Manager</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#1a1a2e] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-white/[0.06] text-left">
                <th className="px-4 py-3 font-medium text-slate-400">User</th>
                <th className="px-4 py-3 font-medium text-slate-400">Email</th>
                <th className="px-4 py-3 font-medium text-slate-400">Role</th>
                <th className="px-4 py-3 font-medium text-slate-400">School</th>
                <th className="px-4 py-3 font-medium text-slate-400">
                  Sims Sent
                </th>
                <th className="px-4 py-3 font-medium text-slate-400">
                  Click Rate
                </th>
                <th className="px-4 py-3 font-medium text-slate-400">
                  Joined
                </th>
                <th className="px-4 py-3 font-medium text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              ) : !data?.users || data.users.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-slate-500"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                data.users.map((user) => {
                  const sent = user.metrics?.totalSent ?? 0;
                  const clicked = user.metrics?.totalClicked ?? 0;
                  const clickRate = sent > 0 ? Math.round((clicked / sent) * 100) : 0;

                  return (
                    <tr
                      key={user.id}
                      className="border-b border-white/[0.04] last:border-0 transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-blue-900/60 border border-blue-800/40 flex items-center justify-center text-xs font-medium text-blue-300 shrink-0">
                            {user.name
                              ? user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)
                              : user.email[0].toUpperCase()}
                          </div>
                          <span className="font-medium text-white truncate max-w-[120px]">
                            {user.name ?? "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-400 max-w-[180px] truncate">
                        {user.email}
                      </td>
                      <td className="px-4 py-3">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {user.school?.name ?? <span className="text-slate-600">None</span>}
                      </td>
                      <td className="px-4 py-3 text-slate-400">{sent}</td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            clickRate > 50
                              ? "text-red-400"
                              : clickRate > 25
                              ? "text-amber-400"
                              : "text-emerald-400"
                          }
                        >
                          {sent > 0 ? `${clickRate}%` : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <select
                            defaultValue={user.role}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value)
                            }
                            className="rounded border border-white/[0.08] bg-[#0f0f1a] px-2 py-1 text-xs text-slate-300 focus:border-blue-500 focus:outline-none transition-colors"
                          >
                            <option value="USER">User</option>
                            <option value="MANAGER">Manager</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                          <button
                            onClick={() => handleDelete(user.id, user.email)}
                            className="rounded px-2 py-1 text-xs font-medium text-red-400 border border-red-900/40 transition-colors hover:bg-red-950/40"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06]">
            <span className="text-sm text-slate-400">
              Page {data.page} of {data.pages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex items-center gap-1 rounded-lg border border-white/[0.08] px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-white/[0.04] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
                disabled={page >= data.pages}
                className="flex items-center gap-1 rounded-lg border border-white/[0.08] px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-white/[0.04] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
