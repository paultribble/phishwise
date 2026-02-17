"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Shield } from "lucide-react";

export default function OnboardingPage() {
  const { update } = useSession();
  const router = useRouter();

  const [view, setView] = useState<"choose" | "join" | "create">("choose");

  // Join flow
  const [inviteCode, setInviteCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  // Create flow
  const [schoolName, setSchoolName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

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
    await update();
    router.replace("/dashboard/manager");
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-200">Welcome to PhishWise</h1>
          <p className="mt-2 text-gray-400">
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
              <Card className="h-full cursor-pointer border-gray-700 bg-phish-blue/30 transition-colors hover:border-primary-600 hover:bg-phish-blue/50">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-900/40 text-primary-400">
                    <Users className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-gray-200">Join a School</CardTitle>
                  <CardDescription className="text-gray-400">
                    I have an invite code from my manager. I want to participate in phishing awareness training.
                  </CardDescription>
                </CardHeader>
              </Card>
            </button>

            <button
              onClick={() => setView("create")}
              className="group text-left"
            >
              <Card className="h-full cursor-pointer border-gray-700 bg-phish-blue/30 transition-colors hover:border-success-600 hover:bg-phish-blue/50">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-success-900/40 text-success-400">
                    <Shield className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-gray-200">Create a School</CardTitle>
                  <CardDescription className="text-gray-400">
                    I&apos;m a manager or educator and want to set up phishing simulations for my organization.
                  </CardDescription>
                </CardHeader>
              </Card>
            </button>
          </div>
        )}

        {/* Join view */}
        {view === "join" && (
          <Card className="border-gray-700 bg-phish-blue/30">
            <CardHeader>
              <CardTitle className="text-gray-200">Join a School</CardTitle>
              <CardDescription className="text-gray-400">
                Enter the invite code your manager shared with you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleJoin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-400" htmlFor="invite-code">
                    Invite code
                  </label>
                  <input
                    id="invite-code"
                    type="text"
                    required
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    placeholder="e.g. A3F7C21B"
                    className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 font-mono text-sm text-gray-200 placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                  />
                </div>
                {joinError && <p className="text-sm text-danger-400">{joinError}</p>}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setView("choose"); setJoinError(null); }}
                    className="rounded-md border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={joining}
                    className="flex-1 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
                  >
                    {joining ? "Joining..." : "Join School"}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Create view */}
        {view === "create" && (
          <Card className="border-gray-700 bg-phish-blue/30">
            <CardHeader>
              <CardTitle className="text-gray-200">Create a School</CardTitle>
              <CardDescription className="text-gray-400">
                Give your organization a name. You&apos;ll get an invite code to share with your users.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-400" htmlFor="school-name">
                    School name
                  </label>
                  <input
                    id="school-name"
                    type="text"
                    required
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="e.g. University of Arkansas"
                    className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                  />
                </div>
                {createError && <p className="text-sm text-danger-400">{createError}</p>}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setView("choose"); setCreateError(null); }}
                    className="rounded-md border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
                  >
                    {creating ? "Creating..." : "Create School"}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
