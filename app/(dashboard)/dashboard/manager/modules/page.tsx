"use client";

import { useEffect, useState } from "react";
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
import { BookOpen, Send, Users, ChevronRight } from "lucide-react";

type Module = {
  id: string;
  name: string;
  description: string;
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
        // Extract users from analytics
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
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
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

      setSuccess(
        `${selectedModule.name} assigned to ${selectedUser.name}`
      );
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-200">Training Modules</h1>
        <p className="mt-2 text-gray-400">
          Assign training modules to test user proficiency and track progress
        </p>
      </div>

      {/* Quick Assign Card */}
      <Card className="border-primary-500/50 bg-primary-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-200">
            <Send className="h-5 w-5" />
            Assign Module to User
          </CardTitle>
          <CardDescription className="text-gray-400">
            Select a module and user to assign training
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Module Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Module
              </label>
              <select
                value={selectedModule?.id || ""}
                onChange={(e) => {
                  const mod = modules.find((m) => m.id === e.target.value);
                  setSelectedModule(mod || null);
                }}
                className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-gray-200 focus:border-primary-500 focus:outline-none"
              >
                <option value="">Choose a module...</option>
                {modules.map((mod) => (
                  <option key={mod.id} value={mod.id}>
                    {mod.name} ({mod._count.templates} templates)
                  </option>
                ))}
              </select>
            </div>

            {/* User Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">User</label>
              <select
                value={selectedUser?.id || ""}
                onChange={(e) => {
                  const user = users.find((u) => u.id === e.target.value);
                  setSelectedUser(user || null);
                }}
                className="w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-gray-200 focus:border-primary-500 focus:outline-none"
              >
                <option value="">Choose a user...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Action Button */}
            <div className="flex items-end">
              <button
                onClick={handleAssignModule}
                disabled={!selectedModule || !selectedUser || assigning}
                className="w-full rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {assigning ? "Assigning..." : "Assign Module"}
              </button>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="text-sm text-danger-300 bg-danger-500/10 border border-danger-500/50 rounded-md p-3">
              {error}
            </div>
          )}
          {success && (
            <div className="text-sm text-success-300 bg-success-500/10 border border-success-500/50 rounded-md p-3">
              ✓ {success}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modules Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-200 mb-4">
          Available Modules
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {modules.length === 0 ? (
            <Card className="col-span-full border-gray-700 bg-phish-blue/20">
              <CardContent className="py-12 text-center">
                <p className="text-gray-400">No modules available</p>
              </CardContent>
            </Card>
          ) : (
            modules.map((mod) => (
              <Card
                key={mod.id}
                className="border-gray-700 bg-phish-blue/20 hover:bg-phish-blue/30 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-gray-200 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary-400" />
                        {mod.name}
                      </CardTitle>
                      <CardDescription className="text-gray-400 mt-1">
                        {mod.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Badge variant="default" className="bg-primary-600">
                      {mod._count.templates} templates
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Module #{mod.orderIndex}
                    </span>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-gray-400 mb-3">
                      Test user proficiency with this module. Each module
                      contains multiple realistic phishing scenarios to train
                      employees.
                    </p>
                    <button
                      onClick={() => setSelectedModule(mod)}
                      className="flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      Assign this module
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-gray-700 bg-phish-blue/20">
        <CardHeader>
          <CardTitle className="text-gray-200">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-300 text-sm">
          <p>
            <strong>1. Assign Modules:</strong> Select a training module and
            assign it to a specific user to test their proficiency.
          </p>
          <p>
            <strong>2. User Clicks Phishing Email:</strong> When users click on
            simulated phishing emails from that module, they&apos;re redirected to
            the training content.
          </p>
          <p>
            <strong>3. Complete Training:</strong> Users must complete the
            module and pass the quiz to mark the module as complete.
          </p>
          <p>
            <strong>4. Track Progress:</strong> Monitor completion rates and
            improvement in your dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
