"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Settings,
  Copy,
  Check,
  AlertTriangle,
  RotateCw,
  Send,
} from "lucide-react";

type School = {
  id: string;
  name: string;
  inviteCode: string;
  frequency: string;
  autoAssignTraining: boolean;
  enableScheduler: boolean;
};

export default function ManagerSettings() {
  const { data: session, status } = useSession();
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);

  const [schoolName, setSchoolName] = useState("");
  const [frequency, setFrequency] = useState("weekly");
  const [autoAssignTraining, setAutoAssignTraining] = useState(false);
  const [enableScheduler, setEnableScheduler] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirming, setDeleteConfirming] = useState(false);
  const [copied, setCopied] = useState(false);

  // Invite members state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSending, setInviteSending] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;

    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => {
        if (data.user?.school) {
          setSchool(data.user.school);
          setSchoolName(data.user.school.name);
          setFrequency(data.user.school.frequency || "weekly");
          setAutoAssignTraining(data.user.school.autoAssignTraining || false);
          setEnableScheduler(data.user.school.enableScheduler !== false);
        }
        setLoading(false);
      });
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!session || !school) {
    redirect("/login");
  }

  const glassCard = "rounded-xl border border-white/[0.06] bg-[#1a1a2e]/80 backdrop-blur-sm";
  const inputClass = "w-full rounded-md border border-white/10 bg-[#252540] px-3 py-2 text-sm text-white focus:border-blue-600 focus:outline-none";
  const btnPrimary = "rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow-[0_0_15px_rgba(29,78,216,0.3)] transition-colors hover:bg-blue-600 disabled:opacity-50";

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!school) return;

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const updatePromises = [];

    if (schoolName !== school.name) {
      updatePromises.push(
        fetch(`/api/schools/${school.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: schoolName }),
        })
      );
    }

    if (frequency !== school.frequency) {
      updatePromises.push(
        fetch(`/api/schools/${school.id}/frequency`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ frequency }),
        })
      );
    }

    if (autoAssignTraining !== school.autoAssignTraining) {
      updatePromises.push(
        fetch(`/api/schools/${school.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ autoAssignTraining }),
        })
      );
    }

    if (enableScheduler !== school.enableScheduler) {
      updatePromises.push(
        fetch(`/api/schools/${school.id}/scheduler`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enableScheduler }),
        })
      );
    }

    try {
      const results = await Promise.all(updatePromises);
      const failed = results.filter((r) => !r.ok);

      if (failed.length > 0) {
        setSaveError("Failed to save some settings");
      } else {
        setSaveSuccess(true);
        setSchool((prev) =>
          prev
            ? { ...prev, name: schoolName, frequency, autoAssignTraining, enableScheduler }
            : null
        );
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!school) return;
    setDeleteConfirming(true);

    try {
      const res = await fetch(`/api/schools/${school.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmationKey: `DELETE_${school.id}` }),
      });

      if (!res.ok) {
        setSaveError("Failed to delete school");
        setDeleteConfirming(false);
        return;
      }

      redirect("/dashboard/manager");
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Unknown error");
      setDeleteConfirming(false);
    }
  }

  function handleCopyInvite() {
    if (!school) return;
    navigator.clipboard.writeText(school.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleRegenerateInvite() {
    if (!school) return;
    alert("Regenerate invite code feature coming soon");
  }

  async function handleSendInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setInviteSending(true);
    setInviteSuccess(null);
    setInviteError(null);

    try {
      const res = await fetch("/api/manager/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim() }),
      });

      if (res.ok) {
        setInviteSuccess(inviteEmail.trim());
        setInviteEmail("");
      } else {
        const data = await res.json().catch(() => ({}));
        setInviteError(data.error || "Failed to send invitation");
      }
    } catch (error) {
      setInviteError("Network error. Please try again.");
    } finally {
      setInviteSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] space-y-8">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6 text-blue-400" />
        <h1 className="text-3xl font-bold text-white">School Settings</h1>
      </div>

      {/* School Settings Card */}
      <div className={`${glassCard} p-6`}>
        <p className="text-xs uppercase tracking-[0.18em] font-semibold text-blue-400 mb-1">School Information</p>
        <p className="text-sm text-slate-300 mb-4">Manage your school name and invite code</p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-300">School Name</label>
            <p className="mt-1 text-white font-medium">{school.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">Invite Code</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="text"
                value={school.inviteCode}
                readOnly
                className={inputClass + " flex-1"}
              />
              <button
                onClick={handleCopyInvite}
                className={btnPrimary + " flex items-center gap-2"}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          <button
            onClick={handleRegenerateInvite}
            className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300"
          >
            <RotateCw className="h-4 w-4" />
            Regenerate Code
          </button>
        </div>
      </div>

      {/* Invite Members Card */}
      <div className={`${glassCard} p-6`}>
        <p className="text-xs uppercase tracking-[0.18em] font-semibold text-blue-400 mb-1">Invite Members</p>
        <p className="text-sm text-slate-300 mb-4">Send email invitations to join your school</p>

        <form onSubmit={handleSendInvite} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1">
            <label className="text-sm font-medium text-slate-300">Email Address</label>
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => {
                setInviteEmail(e.target.value);
                setInviteSuccess(null);
                setInviteError(null);
              }}
              placeholder="user@example.com"
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={inviteSending}
            className={btnPrimary + " flex items-center gap-2"}
          >
            <Send className="h-4 w-4" />
            {inviteSending ? "Sending..." : "Send Invite"}
          </button>
        </form>

        {inviteSuccess && (
          <p className="mt-3 text-sm text-emerald-400">
            &#10003; Invitation sent to {inviteSuccess}
          </p>
        )}
        {inviteError && (
          <p className="mt-3 text-sm text-red-400">
            {inviteError}
          </p>
        )}
      </div>

      {/* Settings Form */}
      <div className={`${glassCard} p-6`}>
        <p className="text-xs uppercase tracking-[0.18em] font-semibold text-blue-400 mb-1">Configuration</p>
        <p className="text-sm text-slate-300 mb-4">Adjust simulation and training settings</p>

        <form onSubmit={handleSave} className="space-y-6">
          {/* School Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              School Name
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Simulation Frequency */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Simulation Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className={inputClass}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <p className="text-xs text-slate-400">
              Determines how often users in this school receive phishing simulations
            </p>
          </div>

          {/* Auto-Assign Training */}
          <div className="flex items-center gap-3">
            <input
              id="auto-assign"
              type="checkbox"
              checked={autoAssignTraining}
              onChange={(e) => setAutoAssignTraining(e.target.checked)}
              className="h-4 w-4 cursor-pointer rounded border-white/10 bg-[#252540] text-blue-600"
            />
            <label htmlFor="auto-assign" className="text-sm font-medium text-slate-300">
              Auto-assign training on first failure
            </label>
          </div>

          {/* Enable Scheduler */}
          <div className="flex items-center gap-3">
            <input
              id="enable-scheduler"
              type="checkbox"
              checked={enableScheduler}
              onChange={(e) => setEnableScheduler(e.target.checked)}
              className="h-4 w-4 cursor-pointer rounded border-white/10 bg-[#252540] text-blue-600"
            />
            <label htmlFor="enable-scheduler" className="text-sm font-medium text-slate-300">
              Enable automated phishing simulations
            </label>
          </div>

          {saveSuccess && (
            <div className="rounded-md border border-emerald-600/50 bg-emerald-600/10 p-3 text-sm text-emerald-400">
              &#10003; Settings saved successfully
            </div>
          )}

          {saveError && (
            <div className="rounded-md border border-red-600/50 bg-red-600/10 p-3 text-sm text-red-400">
              {saveError}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className={btnPrimary}
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 backdrop-blur-sm p-6">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <p className="text-xs uppercase tracking-[0.18em] font-semibold text-red-400">Danger Zone</p>
        </div>
        <p className="text-sm text-red-300/80 mb-4">Irreversible actions</p>

        <p className="text-sm text-slate-300 mb-4">
          Deleting your school will remove all users, simulations, and data associated with it.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-md border border-red-600 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-600/10"
          >
            Delete School
          </button>
        ) : (
          <div className="space-y-3 rounded-md border border-red-600/50 bg-red-600/5 p-4">
            <p className="text-sm text-red-300">
              Are you sure? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={deleteConfirming}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {deleteConfirming ? "Deleting..." : "Yes, Delete School"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteConfirming}
                className="rounded-md border border-white/[0.06] bg-[#1a1a2e]/80 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-[#252540]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Back Button */}
      <Link
        href="/dashboard/manager"
        className="inline-flex text-sm text-blue-400 hover:text-blue-300"
      >
        &larr; Back to Dashboard
      </Link>
    </div>
  );
}
