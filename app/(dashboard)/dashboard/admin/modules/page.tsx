"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Plus, X } from "lucide-react";

type ModuleRow = {
  id: string;
  name: string;
  description: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  _count: { templates: number; userProgress: number };
};

export default function AdminModulesPage() {
  const { data: session, status } = useSession();
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    content: "",
    orderIndex: 0,
  });

  const fetchModules = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/modules");
    if (res.ok) {
      const data = await res.json();
      setModules(data.modules);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status === "authenticated") fetchModules();
  }, [status, fetchModules]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    const res = await fetch("/api/admin/modules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, orderIndex: Number(form.orderIndex) }),
    });

    if (res.ok) {
      setShowForm(false);
      setForm({ name: "", description: "", content: "", orderIndex: 0 });
      fetchModules();
    } else {
      const err = await res.json();
      setFormError(err.error ?? "Failed to create module");
    }
    setSubmitting(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Modules</h1>
          <p className="mt-1 text-slate-400">
            Manage training modules shown to users after phishing simulations
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 shrink-0"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "New Module"}
        </button>
      </div>

      {/* Inline form */}
      {showForm && (
        <div className="bg-[#1a1a2e] border border-blue-800/30 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">
            Create New Module
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">
                  Module Name
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="e.g. Spear Phishing Awareness"
                  className="w-full rounded-lg border border-white/[0.08] bg-[#0f0f1a] px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">
                  Display Order
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={form.orderIndex}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      orderIndex: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full rounded-lg border border-white/[0.08] bg-[#0f0f1a] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">
                Description
              </label>
              <input
                required
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Brief summary shown to users"
                className="w-full rounded-lg border border-white/[0.08] bg-[#0f0f1a] px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">
                Content (Markdown or HTML)
              </label>
              <textarea
                required
                rows={8}
                value={form.content}
                onChange={(e) =>
                  setForm((f) => ({ ...f, content: e.target.value }))
                }
                placeholder="Full training module content..."
                className="w-full rounded-lg border border-white/[0.08] bg-[#0f0f1a] px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-colors resize-y"
              />
            </div>

            {formError && (
              <p className="text-sm text-red-400">{formError}</p>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create Module"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-white/[0.08] px-5 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.04]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#1a1a2e] border border-white/[0.06] rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-white/[0.06] text-left">
                  <th className="px-4 py-3 font-medium text-slate-400">
                    Order
                  </th>
                  <th className="px-4 py-3 font-medium text-slate-400">Name</th>
                  <th className="px-4 py-3 font-medium text-slate-400">
                    Description
                  </th>
                  <th className="px-4 py-3 font-medium text-slate-400">
                    Templates
                  </th>
                  <th className="px-4 py-3 font-medium text-slate-400">
                    Users Completed
                  </th>
                  <th className="px-4 py-3 font-medium text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {modules.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      No modules found
                    </td>
                  </tr>
                ) : (
                  modules.map((m) => (
                    <tr
                      key={m.id}
                      className="border-b border-white/[0.04] last:border-0 transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-3 text-slate-400 font-mono text-xs">
                        {m.orderIndex}
                      </td>
                      <td className="px-4 py-3 font-medium text-white">
                        {m.name}
                      </td>
                      <td className="px-4 py-3 text-slate-400 max-w-[260px]">
                        <span className="line-clamp-2">{m.description}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {m._count.templates}
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {m._count.userProgress}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded border ${
                            m.isActive
                              ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/40"
                              : "bg-slate-900/60 text-slate-500 border-slate-700/40"
                          }`}
                        >
                          {m.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
