"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, redirect } from "next/navigation";
import { Users, Shield, CheckCircle2, Copy, Check } from "lucide-react";

export default function OnboardingPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [view, setView] = useState<"choose" | "join" | "create" | "success">("choose");

  // Join flow
  const [inviteCode, setInviteCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  // Create flow
  const [schoolName, setSchoolName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Success state
  const [createdInviteCode, setCreatedInviteCode] = useState("");
  const [copied, setCopied] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f0f1a]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
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
    await update();
    router.replace("/dashboard/user");
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    const res = await fetch("/api/schools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: schoolName }),
    });
    const data = await res.json();
    if (!res.ok) {
      setCreateError(data.error ?? "Failed to create school");
      setCreating(false);
      return;
    }
    setCreatedInviteCode(data.school?.inviteCode ?? data.inviteCode ?? "");
    await update();
    setView("success");
    setCreating(false);
  }

  function handleCopyCode() {
    navigator.clipboard.writeText(createdInviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-[#0f0f1a] px-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Welcome to PhishWise</h1>
          <p className="mt-2 text-slate-400">
            To get started, join an existing school or create one for your organization.
          </p>
        </div>

        {/* Choice view */}
        {view === "choose" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => setView("join")}
              className="group text-left"
            >
              <div className="relative h-full overflow-hidden rounded-xl border border-white/[0.06] bg-[#1a1a2e]/80 backdrop-blur-sm p-6 transition-colors hover:border-blue-600/40">
                <div className="absolute top-0 left-6 right-6 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.5) 50%, transparent)" }} />
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-900/40 text-blue-400">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">Join a School</h3>
                <p className="mt-1 text-sm text-slate-400">
                  I have an invite code from my manager. I want to participate in phishing awareness training.
                </p>
              </div>
            </button>

            <button
              onClick={() => setView("create")}
              className="group text-left"
            >
              <div className="relative h-full overflow-hidden rounded-xl border border-white/[0.06] bg-[#1a1a2e]/80 backdrop-blur-sm p-6 transition-colors hover:border-emerald-600/40">
                <div className="absolute top-0 left-6 right-6 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.5) 50%, transparent)" }} />
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-900/40 text-emerald-400">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">Create a School</h3>
                <p className="mt-1 text-sm text-slate-400">
                  I&apos;m a manager or educator and want to set up phishing simulations for my organization.
                </p>
              </div>
            </button>
          </div>
        )}

        {/* Join view */}
        {view === "join" && (
          <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#1a1a2e]/80 backdrop-blur-sm">
            <div className="absolute top-0 left-6 right-6 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.5) 50%, transparent)" }} />
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Join a School</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Enter the invite code your manager shared with you.
                </p>
              </div>
              <form onSubmit={handleJoin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-400" htmlFor="invite-code">
                    Invite code
                  </label>
                  <input
                    id="invite-code"
                    type="text"
                    required
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    placeholder="e.g. A3F7C21B"
                    className="w-full rounded-lg border border-white/10 bg-[#252540] px-3 py-2 font-mono text-sm text-white placeholder-slate-500 focus:border-blue-600 focus:outline-none"
                  />
                </div>
                {joinError && <p className="text-sm text-red-400">{joinError}</p>}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setView("choose"); setJoinError(null); }}
                    className="rounded-lg border border-white/10 bg-[#252540] px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-[#2a2a4a]"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={joining}
                    className="flex-1 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow-[0_0_20px_rgba(37,99,235,0.35)] transition-colors hover:bg-blue-600 disabled:opacity-50"
                  >
                    {joining ? "Joining..." : "Join School"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create view */}
        {view === "create" && (
          <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#1a1a2e]/80 backdrop-blur-sm">
            <div className="absolute top-0 left-6 right-6 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.5) 50%, transparent)" }} />
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Create a School</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Give your organization a name. You&apos;ll get an invite code to share with your users.
                </p>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-400" htmlFor="school-name">
                    School name
                  </label>
                  <input
                    id="school-name"
                    type="text"
                    required
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="e.g. University of Arkansas"
                    className="w-full rounded-lg border border-white/10 bg-[#252540] px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-600 focus:outline-none"
                  />
                </div>
                {createError && <p className="text-sm text-red-400">{createError}</p>}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setView("choose"); setCreateError(null); }}
                    className="rounded-lg border border-white/10 bg-[#252540] px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-[#2a2a4a]"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow-[0_0_20px_rgba(37,99,235,0.35)] transition-colors hover:bg-blue-600 disabled:opacity-50"
                  >
                    {creating ? "Creating..." : "Create School"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Success view — shown after school creation */}
        {view === "success" && (
          <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#1a1a2e]/80 backdrop-blur-sm">
            <div className="absolute top-0 left-6 right-6 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.5) 50%, transparent)" }} />
            <div className="p-8 text-center space-y-5">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-900/40">
                <CheckCircle2 className="h-7 w-7 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">School Created!</h2>
                <p className="mt-2 text-sm text-slate-400">
                  You&apos;re now a Manager. Use your invite code to add team members.
                </p>
              </div>
              <div className="mx-auto max-w-xs">
                <p className="mb-2 text-xs font-medium text-slate-500 uppercase tracking-wider">Your Invite Code</p>
                <div className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#252540] px-4 py-3">
                  <span className="font-mono text-xl font-bold tracking-widest text-white">{createdInviteCode}</span>
                  <button
                    onClick={handleCopyCode}
                    className="ml-2 rounded p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                    title="Copy invite code"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                {copied && (
                  <p className="mt-2 text-xs text-emerald-400">Copied to clipboard!</p>
                )}
              </div>
              <button
                onClick={() => router.replace("/dashboard/manager")}
                className="inline-flex items-center rounded-lg bg-blue-700 px-6 py-2.5 text-sm font-medium text-white shadow-[0_0_20px_rgba(37,99,235,0.35)] transition-colors hover:bg-blue-600"
              >
                Continue to Dashboard &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
