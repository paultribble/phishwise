"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FlaskConical, Plus, X, Trophy, Pause, Check } from "lucide-react";

type ABTest = {
  id: string;
  name: string;
  description: string | null;
  controlTemplateId: string;
  variantTemplateId: string;
  status: string;
  startedAt: string;
  endedAt: string | null;
  control: { total: number; clicks: number; clickRate: number };
  variant: { total: number; clicks: number; clickRate: number };
};

type Template = {
  id: string;
  name: string;
  moduleName: string;
};

const glassCard = "rounded-xl border border-white/[0.06] bg-[#1a1a2e]/80 backdrop-blur-sm";

export default function ABTestsPage() {
  const { data: session, status } = useSession();
  const [tests, setTests] = useState<ABTest[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    controlTemplateId: "",
    variantTemplateId: "",
  });

  useEffect(() => {
    if (status !== "authenticated") return;
    Promise.all([
      fetch("/api/admin/abtests").then((r) => r.json()),
      fetch("/api/training/modules").then((r) => r.json()),
    ]).then(([abData, modData]) => {
      if (abData.tests) setTests(abData.tests);
      if (modData.modules) {
        const tList: Template[] = [];
        for (const mod of modData.modules) {
          for (const t of mod.templates || []) {
            tList.push({ id: t.id, name: t.name, moduleName: mod.name });
          }
        }
        setTemplates(tList);
      }
      setLoading(false);
    });
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-[#060a10] min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  async function handleCreate() {
    if (!form.name || !form.controlTemplateId || !form.variantTemplateId) return;
    setCreating(true);
    const res = await fetch("/api/admin/abtests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok && data.test) {
      setTests((prev) => [{ ...data.test, control: { total: 0, clicks: 0, clickRate: 0 }, variant: { total: 0, clicks: 0, clickRate: 0 } }, ...prev]);
      setShowCreate(false);
      setForm({ name: "", description: "", controlTemplateId: "", variantTemplateId: "" });
    }
    setCreating(false);
  }

  async function handleUpdateStatus(id: string, status: string) {
    await fetch(`/api/admin/abtests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setTests((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }

  const getWinner = (test: ABTest) => {
    if (test.control.total < 5 || test.variant.total < 5) return null;
    if (test.control.clickRate < test.variant.clickRate) return "control";
    if (test.variant.clickRate < test.control.clickRate) return "variant";
    return "tie";
  };

  return (
    <div className="min-h-screen bg-[#060a10]">
      <div className="relative z-10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-8">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FlaskConical className="h-5 w-5 text-cyan-400" />
                <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">Admin</span>
              </div>
              <h1 className="text-3xl font-bold text-white">A/B Template Testing</h1>
              <p className="mt-1 text-slate-400">Compare two phishing templates to see which is more effective</p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Test
            </button>
          </div>

          {/* Create Modal */}
          {showCreate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <div className={`${glassCard} w-full max-w-lg p-6 space-y-5`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Create A/B Test</h3>
                  <button onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Test Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Amazon vs PayPal urgency"
                      className="w-full rounded-lg border border-white/10 bg-[#111827] px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Description (optional)</label>
                    <input
                      type="text"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-[#111827] px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Control Template (A)</label>
                      <select
                        value={form.controlTemplateId}
                        onChange={(e) => setForm({ ...form, controlTemplateId: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-[#111827] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                      >
                        <option value="">-- Select --</option>
                        {templates.map((t) => (
                          <option key={t.id} value={t.id}>{t.name} ({t.moduleName})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Variant Template (B)</label>
                      <select
                        value={form.variantTemplateId}
                        onChange={(e) => setForm({ ...form, variantTemplateId: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-[#111827] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                      >
                        <option value="">-- Select --</option>
                        {templates.map((t) => (
                          <option key={t.id} value={t.id}>{t.name} ({t.moduleName})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleCreate}
                    disabled={creating || !form.name || !form.controlTemplateId || !form.variantTemplateId}
                    className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
                  >
                    {creating ? "Creating..." : "Create Test"}
                  </button>
                  <button
                    onClick={() => setShowCreate(false)}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tests List */}
          {tests.length === 0 ? (
            <div className={`${glassCard} p-12 text-center`}>
              <FlaskConical className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-lg font-semibold text-slate-300">No A/B tests yet</p>
              <p className="text-sm text-slate-500 mt-1">Create a test to compare two phishing templates</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tests.map((test) => {
                const winner = getWinner(test);
                const isExpanded = expandedId === test.id;
                const chartData = [
                  { name: "Control (A)", clickRate: test.control.clickRate, total: test.control.total },
                  { name: "Variant (B)", clickRate: test.variant.clickRate, total: test.variant.total },
                ];

                return (
                  <div key={test.id} className={glassCard}>
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-white">{test.name}</h3>
                            <Badge
                              variant={test.status === "active" ? "success" : test.status === "paused" ? "warning" : "secondary"}
                            >
                              {test.status}
                            </Badge>
                            {winner && winner !== "tie" && (
                              <div className="flex items-center gap-1 text-xs text-amber-400">
                                <Trophy className="h-3.5 w-3.5" />
                                {winner === "control" ? "Control wins" : "Variant wins"}
                              </div>
                            )}
                          </div>
                          {test.description && <p className="text-sm text-slate-400">{test.description}</p>}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {test.status === "active" && (
                            <button
                              onClick={() => handleUpdateStatus(test.id, "paused")}
                              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 transition-colors"
                            >
                              <Pause className="h-3.5 w-3.5" /> Pause
                            </button>
                          )}
                          {test.status === "paused" && (
                            <button
                              onClick={() => handleUpdateStatus(test.id, "active")}
                              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 transition-colors"
                            >
                              <Check className="h-3.5 w-3.5" /> Resume
                            </button>
                          )}
                          {test.status !== "ended" && (
                            <button
                              onClick={() => handleUpdateStatus(test.id, "ended")}
                              className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/20 transition-colors"
                            >
                              End Test
                            </button>
                          )}
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : test.id)}
                            className="text-xs text-blue-400 hover:text-blue-300 px-2"
                          >
                            {isExpanded ? "Hide results" : "View results"}
                          </button>
                        </div>
                      </div>

                      {/* Summary row */}
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        {["control", "variant"].map((group) => {
                          const data = group === "control" ? test.control : test.variant;
                          const isWinner = winner === group;
                          return (
                            <div
                              key={group}
                              className={`rounded-lg border p-4 ${isWinner ? "border-amber-500/30 bg-amber-500/5" : "border-white/[0.04] bg-white/[0.02]"}`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs uppercase tracking-wide text-slate-400">
                                  {group === "control" ? "A — Control" : "B — Variant"}
                                </span>
                                {isWinner && <Trophy className="h-3.5 w-3.5 text-amber-400" />}
                              </div>
                              <div className="text-2xl font-bold text-white">{data.clickRate}%</div>
                              <div className="text-xs text-slate-500">{data.clicks} clicks / {data.total} sent</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Expanded chart */}
                    {isExpanded && (
                      <div className="border-t border-white/[0.06] px-6 pb-6 pt-4">
                        <h4 className="text-sm font-medium text-slate-300 mb-4">Click Rate Comparison</h4>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={chartData} barSize={48}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e3058" />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" unit="%" />
                            <Tooltip
                              contentStyle={{ backgroundColor: "#0c1220", border: "1px solid #1e3058", borderRadius: "8px" }}
                              formatter={(v: number) => [`${v}%`, "Click Rate"]}
                            />
                            <Bar dataKey="clickRate" name="Click Rate %" fill="#2563eb" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                        <p className="text-xs text-slate-500 mt-3">
                          {test.control.total + test.variant.total < 10
                            ? "Need at least 5 sends per group to declare a winner."
                            : winner === "tie"
                            ? "Both templates perform similarly — no clear winner yet."
                            : `${winner === "control" ? "Control (A)" : "Variant (B)"} template has a lower click rate — recommend using it.`}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
