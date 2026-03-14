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
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Copy,
  Check,
  AlertTriangle,
  RotateCw,
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
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!session || !school) {
    redirect("/login");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!school) return;

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const updatePromises = [];

    // Save name if changed
    if (schoolName !== school.name) {
      updatePromises.push(
        fetch(`/api/schools/${school.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: schoolName }),
        })
      );
    }

    // Save frequency if changed
    if (frequency !== school.frequency) {
      updatePromises.push(
        fetch(`/api/schools/${school.id}/frequency`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ frequency }),
        })
      );
    }

    // Save autoAssignTraining if changed
    if (autoAssignTraining !== school.autoAssignTraining) {
      updatePromises.push(
        fetch(`/api/schools/${school.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ autoAssignTraining }),
        })
      );
    }

    // Save enableScheduler if changed
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
    // TODO: Implement invite code regeneration
    alert("Regenerate invite code feature coming soon");
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6 text-primary-400" />
        <h1 className="text-3xl font-bold text-gray-200">School Settings</h1>
      </div>

      {/* Invite Code Card */}
      <Card className="border-gray-700 bg-phish-blue/30">
        <CardHeader>
          <CardTitle className="text-gray-200">Invite Code</CardTitle>
          <CardDescription className="text-gray-400">
            Share this code with users to invite them to your school
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={school.inviteCode}
              readOnly
              className="flex-1 rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-gray-200"
            />
            <button
              onClick={handleCopyInvite}
              className="flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
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
          <button
            onClick={handleRegenerateInvite}
            className="flex items-center gap-2 text-sm text-warning-400 hover:text-warning-300"
          >
            <RotateCw className="h-4 w-4" />
            Regenerate Code
          </button>
        </CardContent>
      </Card>

      {/* Settings Form */}
      <Card className="border-gray-700 bg-phish-blue/30">
        <CardHeader>
          <CardTitle className="text-gray-200">School Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            {/* School Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">
                School Name
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-gray-200 focus:border-primary-500 focus:outline-none"
              />
            </div>

            {/* Simulation Frequency */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">
                Simulation Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-gray-200 focus:border-primary-500 focus:outline-none"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <p className="text-xs text-gray-500">
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
                className="h-4 w-4 cursor-pointer rounded border-gray-600 bg-gray-900 text-primary-600"
              />
              <label htmlFor="auto-assign" className="text-sm font-medium text-gray-400">
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
                className="h-4 w-4 cursor-pointer rounded border-gray-600 bg-gray-900 text-primary-600"
              />
              <label htmlFor="enable-scheduler" className="text-sm font-medium text-gray-400">
                Enable automated phishing simulations
              </label>
            </div>

            {saveSuccess && (
              <div className="rounded-md border border-success-600/50 bg-success-600/10 p-3 text-sm text-success-400">
                ✓ Settings saved successfully
              </div>
            )}

            {saveError && (
              <div className="rounded-md border border-danger-600/50 bg-danger-600/10 p-3 text-sm text-danger-400">
                {saveError}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-danger-500/50 bg-danger-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-danger-400">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-danger-300/80">
            Irreversible actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-400">
            Deleting your school will remove all users, simulations, and data associated with it.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded-md border border-danger-600 px-4 py-2 text-sm font-medium text-danger-400 transition-colors hover:bg-danger-600/10"
            >
              Delete School
            </button>
          ) : (
            <div className="space-y-3 rounded-md border border-danger-600/50 bg-danger-600/5 p-4">
              <p className="text-sm text-danger-300">
                Are you sure? This cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={deleteConfirming}
                  className="rounded-md bg-danger-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-danger-700 disabled:opacity-50"
                >
                  {deleteConfirming ? "Deleting..." : "Yes, Delete School"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteConfirming}
                  className="rounded-md border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Back Button */}
      <Link
        href="/dashboard/manager"
        className="inline-flex text-sm text-primary-400 hover:text-primary-300"
      >
        ← Back to Dashboard
      </Link>
    </div>
  );
}
