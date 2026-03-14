"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Plus, X, Star } from "lucide-react";

type TemplateRow = {
  id: string;
  name: string;
  subject: string;
  body: string;
  fromAddress: string | null;
  difficulty: number;
  isActive: boolean;
  createdAt: string;
  module: { id: string; name: string };
  _count: { simulations: number };
};

type ModuleOption = { id: string; name: string };

function DifficultyStars({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-3.5 w-3.5 ${
            n <= value ? "text-amber-400 fill-amber-400" : "text-slate-700"
          }`}
        />
      ))}
    </span>
  );
}

export default function AdminTemplatesPage() {
  const { data: session, status } = useSession();
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [modules, setModules] = useState<ModuleOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [moduleFilter, setModuleFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    subject: "",
    body: "",
    moduleId: "",
    difficulty: 1,
    fromAddress: "",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [tRes, mRes] = await Promise.all([
      fetch("/api/admin/templates"),
      fetch("/api/admin/modules"),
    ]);
    if (tRes.ok) {
      const td = await tRes.json();
      setTemplates(td.templates);
    }
    if (mRes.ok) {
      const md = await mRes.json();
      setModules(md.modules.map((m: { id: string; name: string }) => ({ id: m.id, name: m.name })));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status === "authenticated") fetchData();
  }, [status, fetchData]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const filtered = templates.filter((t) => {
    if (moduleFilter && t.module.id !== moduleFilter) return false;
    if (activeFilter === "active" && !t.isActive) return false;
    if (activeFilter === "inactive" && t.isActive) return false;
    return true;
  });

  async function handleDeactivate(id: string) {
    await fetch(`/api/admin/templates/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: false }),
    });
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: false } : t))
    );
  }

  async function handleActivate(id: string) {
    await fetch(`/api/admin/templates/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: true }),
    });
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: true } : t))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    const res = await fetch("/api/admin/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        difficulty: Number(form.difficulty),
        fromAddress: form.fromAddress || undefined,
      }),
    });

    if (res.ok) {
      setShowForm(false);
      setForm({ name: "", subject: "", body: "", moduleId: "", difficulty: 1, fromAddress: "" });
      fetchData();
    } else {
      const err = await res.json();
      setFormError(err.error ?? "Failed to create template");
    }
    setSubmitting(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Templates</h1>
          <p className="mt-1 text-slate-400">
            Manage phishing email templates used in simulations
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 shrink-0"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "New Template"}
        </button>
      </div>

      {/* Inline form */}
      {showForm && (
        <div className="bg-[#1a1a2e] border border-blue-800/30 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">
            Create New Template
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">
                  Template Name
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. IT Password Reset"
                  className="w-full rounded-lg border border-white/[0.08] bg-[#0f0f1a] px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">
                  Module
                </label>
                <select
                  required
                  value={form.moduleId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, moduleId: e.target.value }))
                  }
                  className="w-full rounded-lg border border-white/[0.08] bg-[#0f0f1a] px-3 py-2 text-sm text-slate-300 focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="">Select module...</option>
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">
                  Email Subject
                </label>
                <input
                  required
                  value={form.subject}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, subject: e.target.value }))
                  }
                  placeholder="e.g. Urgent: Verify your account"
                  className="w-full rounded-lg border border-white/[0.08] bg-[#0f0f1a] px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">
                  From Address (optional)
                </label>
                <input
                  type="email"
                  value={form.fromAddress}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fromAddress: e.target.value }))
                  }
                  placeholder="security@verify-account.com"
                  className="w-full rounded-lg border border-white/[0.08] bg-[#0f0f1a] px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Difficulty radio */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">
                Difficulty
              </label>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <label key={n} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="difficulty"
                      value={n}
                      checked={form.difficulty === n}
                      onChange={() => setForm((f) => ({ ...f, difficulty: n }))}
                      className="accent-blue-500"
                    />
                    <span className="text-sm text-slate-300">{n}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">
                Email Body (HTML or plain text)
              </label>
              <textarea
                required
                rows={6}
                value={form.body}
                onChange={(e) =>
                  setForm((f) => ({ ...f, body: e.target.value }))
                }
                placeholder="Compose the phishing email body here..."
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
                {submitting ? "Creating..." : "Create Template"}
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

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="rounded-lg border border-white/[0.08] bg-[#1a1a2e] px-4 py-2 text-sm text-slate-300 focus:border-blue-500 focus:outline-none transition-colors"
        >
          <option value="">All modules</option>
          {modules.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value)}
          className="rounded-lg border border-white/[0.08] bg-[#1a1a2e] px-4 py-2 text-sm text-slate-300 focus:border-blue-500 focus:outline-none transition-colors"
        >
          <option value="all">All status</option>
          <option value="active">Active only</option>
          <option value="inactive">Inactive only</option>
        </select>
      </div>

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
                  <th className="px-4 py-3 font-medium text-slate-400">Name</th>
                  <th className="px-4 py-3 font-medium text-slate-400">Module</th>
                  <th className="px-4 py-3 font-medium text-slate-400">Difficulty</th>
                  <th className="px-4 py-3 font-medium text-slate-400">From</th>
                  <th className="px-4 py-3 font-medium text-slate-400">Simulations</th>
                  <th className="px-4 py-3 font-medium text-slate-400">Status</th>
                  <th className="px-4 py-3 font-medium text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      No templates match the current filters
                    </td>
                  </tr>
                ) : (
                  filtered.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b border-white/[0.04] last:border-0 transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-3 font-medium text-white">
                        {t.name}
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {t.module.name}
                      </td>
                      <td className="px-4 py-3">
                        <DifficultyStars value={t.difficulty} />
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {t.fromAddress ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {t._count.simulations}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded border ${
                            t.isActive
                              ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/40"
                              : "bg-slate-900/60 text-slate-500 border-slate-700/40"
                          }`}
                        >
                          {t.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            t.isActive
                              ? handleDeactivate(t.id)
                              : handleActivate(t.id)
                          }
                          className={`rounded px-2 py-1 text-xs font-medium border transition-colors ${
                            t.isActive
                              ? "text-amber-400 border-amber-900/40 hover:bg-amber-950/40"
                              : "text-emerald-400 border-emerald-900/40 hover:bg-emerald-950/40"
                          }`}
                        >
                          {t.isActive ? "Deactivate" : "Activate"}
                        </button>
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
