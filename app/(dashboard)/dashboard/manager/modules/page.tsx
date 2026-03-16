"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { AmbientBackground } from "@/components/landing/AmbientBackground";
import { BookOpen, ChevronRight, ArrowLeft, Zap } from "lucide-react";

type Module = {
  id: string;
  name: string;
  description: string;
  content: string;
  orderIndex: number;
  _count: {
    templates: number;
  };
};

type User = {
  id: string;
  name: string;
  email: string;
};

export default function ManagerModulesPage() {
  const { data: session, status } = useSession();
  const [modules, setModules] = useState<Module[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;

    Promise.all([
      fetch("/api/training/modules").then((r) => r.json()),
      fetch("/api/manager/analytics").then((r) => r.json()),
    ])
      .then(([modulesData, analyticsData]) => {
        setModules(modulesData.modules || []);
        if (analyticsData.userPerformance) {
          setUsers(
            analyticsData.userPerformance.map((u: any) => ({
              id: u.userId,
              name: u.name,
              email: u.email,
            }))
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load data:", err);
        setError("Failed to load modules and users");
        setLoading(false);
      });
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    redirect("/login");
  }

  async function handleAssignModule() {
    if (!selectedModule || !selectedUser) {
      setError("Please select both a module and a user");
      return;
    }

    setAssigning(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/manager/assign-training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId: selectedModule.id,
          userId: selectedUser.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to assign module");
        return;
      }

      setSuccess(`${selectedModule.name} assigned to ${selectedUser.name}`);
      setSelectedModule(null);
      setSelectedUser(null);

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("An error occurred while assigning the module");
      console.error(err);
    } finally {
      setAssigning(false);
    }
  }

  // Detail view
  if (selectedModule) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] relative overflow-hidden">
        <AmbientBackground variant="subtle" />
        <div className="relative z-10 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl space-y-8">
            {/* Back button */}
            <button
              onClick={() => setSelectedModule(null)}
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Modules
            </button>

            {/* Module Detail Card */}
            <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#1a1a2e]/80 backdrop-blur-sm p-8">
              <div className="absolute top-0 left-6 right-6 h-px pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.5) 50%, transparent)" }} />

              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {selectedModule.name}
                  </h1>
                  <p className="text-slate-300">{selectedModule.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-950/80 border border-blue-800/40">
                    <BookOpen className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] font-semibold text-blue-400">
                      Templates
                    </p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {selectedModule._count.templates}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assignment Form */}
            <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#1a1a2e]/80 backdrop-blur-sm p-8">
              <div className="absolute top-0 left-6 right-6 h-px pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.5) 50%, transparent)" }} />

              <h2 className="text-lg font-semibold text-white mb-6">Assign to User</h2>

              <div className="space-y-4">
                {/* User Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                    Select User
                  </label>
                  <select
                    value={selectedUser?.id || ""}
                    onChange={(e) => {
                      const user = users.find((u) => u.id === e.target.value);
                      setSelectedUser(user || null);
                    }}
                    className="w-full bg-[#252540] border border-white/10 rounded-lg text-gray-200 placeholder-slate-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/50 px-4 py-2.5 text-sm"
                  >
                    <option value="">Choose a user...</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Messages */}
                {error && (
                  <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                    ✓ {success}
                  </div>
                )}

                {/* Button */}
                <button
                  onClick={handleAssignModule}
                  disabled={!selectedUser || assigning}
                  className="w-full bg-blue-700 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold shadow-[0_0_20px_rgba(37,99,235,0.35)] hover:shadow-[0_0_28px_rgba(37,99,235,0.55)] rounded-lg transition-all py-2.5 flex items-center justify-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  {assigning ? "Assigning..." : "Assign Module"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="min-h-screen bg-[#0f0f1a] relative overflow-hidden">
      <AmbientBackground variant="subtle" />
      <div className="relative z-10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white">Training Modules</h1>
            <p className="mt-1 text-slate-400">
              Select a module to view details and assign to users
            </p>
          </div>

          {/* Modules Grid */}
          {modules.length === 0 ? (
            <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#1a1a2e]/80 backdrop-blur-sm p-12 text-center">
              <p className="text-slate-400">No modules available</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {modules.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => setSelectedModule(mod)}
                  className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#1a1a2e]/80 backdrop-blur-sm p-6 text-left hover:border-blue-400/20 hover:bg-[#232338]/80 transition-all group"
                >
                  <div className="absolute top-0 left-6 right-6 h-px pointer-events-none"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.5) 50%, transparent)" }} />

                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-950/80 border border-blue-800/40 group-hover:border-blue-700/60 transition-colors">
                        <BookOpen className="h-5 w-5 text-blue-400" />
                      </div>
                      <ChevronRight className="h-5 w-5 text-blue-400/50 group-hover:text-blue-400 transition-colors" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-white text-lg group-hover:text-blue-400 transition-colors">
                        {mod.name}
                      </h3>
                      <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                        {mod.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <Badge variant="outline" className="bg-blue-950/50 border-blue-800/40 text-blue-300">
                        {mod._count.templates} templates
                      </Badge>
                      <span className="text-xs text-slate-500">
                        Module #{mod.orderIndex}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Info Card */}
          <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#1a1a2e]/80 backdrop-blur-sm p-6">
            <div className="absolute top-0 left-6 right-6 h-px pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.5) 50%, transparent)" }} />

            <h2 className="text-lg font-semibold text-white mb-4">How Assignment Works</h2>
            <div className="space-y-3 text-slate-300 text-sm">
              <p>
                <span className="text-blue-400 font-semibold">1. Select Module:</span> Click any module card to view details and assign it to users.
              </p>
              <p>
                <span className="text-blue-400 font-semibold">2. Choose User:</span> Select a user from your school to assign the training module.
              </p>
              <p>
                <span className="text-blue-400 font-semibold">3. User Completes:</span> When users click phishing emails from this module, they&apos;re redirected to complete training.
              </p>
              <p>
                <span className="text-blue-400 font-semibold">4. Track Progress:</span> Monitor completion in your dashboard analytics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
