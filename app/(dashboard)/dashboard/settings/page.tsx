"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { User, Lock, School, Copy, Check, Eye, EyeOff, Radio } from "lucide-react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 inline-flex items-center gap-1 rounded-md bg-[#252540] px-2 py-1 text-xs text-slate-300 hover:bg-[#2f2f50] transition-colors"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-green-400" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          Copy
        </>
      )}
    </button>
  );
}

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-xl border border-white/[0.06] bg-[#1a1a2e]/80 backdrop-blur-sm p-6 ${className}`}
    >
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { data: session, status } = useSession();

  // Profile state
  const [name, setName] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // School state
  const [schoolData, setSchoolData] = useState<{
    name: string;
    inviteCode: string;
    frequency?: string;
  } | null>(null);

  // Simulation preferences state
  const [simulationFrequencyOverride, setSimulationFrequencyOverride] = useState<string | null>(null);
  const [unsubscribedAt, setUnsubscribedAt] = useState<string | null>(null);
  const [simMessage, setSimMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [simLoading, setSimLoading] = useState(false);

  const fetchUserData = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        if (data.user?.school) {
          setSchoolData(data.user.school);
        }
        setSimulationFrequencyOverride(data.user?.simulationFrequencyOverride || null);
        setUnsubscribedAt(data.user?.unsubscribedAt || null);
      }
    } catch {
      // Silently fail — supplementary data
    }
  }, []);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
    if (session?.user?.id) {
      fetchUserData();
    }
  }, [session, fetchUserData]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    redirect("/login");
  }

  const handleProfileSave = async () => {
    if (!name.trim()) return;
    setProfileSaving(true);
    setProfileMessage(null);

    try {
      const res = await fetch("/api/users/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (res.ok) {
        setProfileMessage({ type: "success", text: "Name updated successfully." });
      } else {
        const data = await res.json();
        setProfileMessage({
          type: "error",
          text: data.error || "Failed to update name.",
        });
      }
    } catch {
      setProfileMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordMessage(null);

    if (newPassword.length < 8) {
      setPasswordMessage({
        type: "error",
        text: "New password must be at least 8 characters.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setPasswordSaving(true);

    try {
      const res = await fetch("/api/users/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (res.ok) {
        setPasswordMessage({ type: "success", text: "Password changed successfully." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const data = await res.json();
        setPasswordMessage({
          type: "error",
          text: data.error || "Failed to change password.",
        });
      }
    } catch {
      setPasswordMessage({
        type: "error",
        text: "Network error. Please try again.",
      });
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleFrequencyChange = async (value: string | null) => {
    setSimLoading(true);
    setSimMessage(null);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ simulationFrequencyOverride: value }),
      });
      if (!res.ok) throw new Error("Failed to update frequency");
      const data = await res.json();
      setSimulationFrequencyOverride(data.user?.simulationFrequencyOverride ?? null);
      setSimMessage({ type: "success", text: "Simulation frequency updated." });
      setTimeout(() => setSimMessage(null), 3000);
    } catch {
      setSimMessage({ type: "error", text: "Failed to update frequency." });
    } finally {
      setSimLoading(false);
    }
  };

  const handleSubscriptionToggle = async () => {
    setSimLoading(true);
    setSimMessage(null);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeSimulations: !!unsubscribedAt }),
      });
      if (!res.ok) throw new Error("Failed to update subscription");
      const data = await res.json();
      setUnsubscribedAt(data.user?.unsubscribedAt ?? null);
      setSimMessage({
        type: "success",
        text: unsubscribedAt ? "Simulations resumed." : "Simulations paused.",
      });
      setTimeout(() => setSimMessage(null), 3000);
    } catch {
      setSimMessage({ type: "error", text: "Failed to update subscription." });
    } finally {
      setSimLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="mt-1 text-slate-300">
            Manage your account preferences
          </p>
        </div>

        {/* Profile Section */}
        <GlassCard>
          <div className="mb-4 flex items-center gap-3">
            <User className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Profile</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Name
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 rounded-lg border border-white/10 bg-[#252540] px-3 py-2 text-white placeholder-slate-500 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600/50"
                  placeholder="Your name"
                />
                <button
                  onClick={handleProfileSave}
                  disabled={profileSaving || !name.trim()}
                  className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow-[0_0_20px_rgba(37,99,235,0.35)] transition-colors hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {profileSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Email
              </label>
              <div className="rounded-lg border border-white/10 bg-[#252540]/50 px-3 py-2 text-slate-400">
                {session.user.email ?? ""}
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Email cannot be changed here.
              </p>
            </div>

            {profileMessage && (
              <p
                className={`text-sm ${
                  profileMessage.type === "success"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {profileMessage.text}
              </p>
            )}
          </div>
        </GlassCard>

        {/* Change Password Section */}
        <GlassCard>
          <div className="mb-4 flex items-center gap-3">
            <Lock className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">
              Change Password
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#252540] px-3 py-2 pr-10 text-white placeholder-slate-500 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600/50"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#252540] px-3 py-2 pr-10 text-white placeholder-slate-500 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600/50"
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {newPassword.length > 0 && newPassword.length < 8 && (
                <p className="mt-1 text-xs text-red-400">
                  Must be at least 8 characters
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#252540] px-3 py-2 text-white placeholder-slate-500 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600/50"
                placeholder="Confirm new password"
              />
              {confirmPassword.length > 0 &&
                newPassword !== confirmPassword && (
                  <p className="mt-1 text-xs text-red-400">
                    Passwords do not match
                  </p>
                )}
            </div>

            <button
              onClick={handlePasswordChange}
              disabled={
                passwordSaving ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword
              }
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow-[0_0_20px_rgba(37,99,235,0.35)] transition-colors hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {passwordSaving ? "Changing..." : "Change Password"}
            </button>

            {passwordMessage && (
              <p
                className={`text-sm ${
                  passwordMessage.type === "success"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {passwordMessage.text}
              </p>
            )}
          </div>
        </GlassCard>

        {/* Simulation Preferences Section */}
        <GlassCard>
          <div className="mb-6 flex items-center gap-3">
            <Radio className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">
              Simulation Preferences
            </h2>
          </div>

          <div className="space-y-6">
            {/* Frequency Override */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Simulation Frequency
              </label>
              <select
                value={simulationFrequencyOverride || ""}
                onChange={(e) => handleFrequencyChange(e.target.value || null)}
                disabled={simLoading}
                className="w-full rounded-lg border border-white/10 bg-[#252540] px-3 py-2 text-white placeholder-slate-500 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600/50 disabled:opacity-50"
              >
                <option value="">Use school default</option>
                <option value="weekly">Weekly</option>
                <option value="random">Random</option>
                <option value="off">Opt out (pause simulations)</option>
              </select>
              <p className="mt-2 text-xs text-gray-400">
                Your school is set to &ldquo;{schoolData?.frequency || "weekly"}&rdquo; frequency. You can override it here.
              </p>
            </div>

            {/* Subscription Status */}
            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-300">Simulation Status:</span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      unsubscribedAt
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {unsubscribedAt ? "Paused" : "Active"}
                  </span>
                </div>
                <button
                  onClick={handleSubscriptionToggle}
                  disabled={simLoading}
                  className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow-[0_0_15px_rgba(29,78,216,0.3)] transition-colors hover:bg-blue-600 disabled:opacity-50"
                >
                  {unsubscribedAt ? "Resume Simulations" : "Pause Simulations"}
                </button>
              </div>
              <p className="mt-3 text-xs text-gray-400">
                {unsubscribedAt
                  ? "You will not receive new simulations until you resume."
                  : "You are enrolled to receive phishing awareness simulations."}
              </p>
            </div>
          </div>

          {/* Feedback Message */}
          {simMessage && (
            <div className="mt-6 rounded-lg border border-white/10 p-3">
              <p className={`text-sm ${simMessage.type === "success" ? "text-green-400" : "text-red-400"}`}>
                {simMessage.text}
              </p>
            </div>
          )}
        </GlassCard>

        {/* School Section */}
        <GlassCard>
          <div className="mb-4 flex items-center gap-3">
            <School className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">School</h2>
          </div>

          {session.user.role === "MANAGER" || session.user.role === "ADMIN" ? (
            schoolData ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-[#252540] px-4 py-3">
                  <div>
                    <p className="text-xs text-slate-400">School Name</p>
                    <p className="text-sm font-medium text-white">
                      {schoolData.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-[#252540] px-4 py-3">
                  <div>
                    <p className="text-xs text-slate-400">Invite Code</p>
                    <p className="font-mono text-sm font-medium text-blue-400">
                      {schoolData.inviteCode}
                    </p>
                  </div>
                  <CopyButton text={schoolData.inviteCode} />
                </div>
                <p className="text-xs text-slate-500">
                  Share this code with users so they can join your school.
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center py-4">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
              </div>
            )
          ) : session.user.schoolId ? (
            <p className="text-sm text-slate-300">
              You are enrolled in a school. Contact your manager for details.
            </p>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-300">
                You are not enrolled in a school yet.
              </p>
              <Link
                href="/dashboard/onboarding"
                className="inline-block rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow-[0_0_20px_rgba(37,99,235,0.35)] transition-colors hover:bg-blue-600"
              >
                Join a School
              </Link>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
