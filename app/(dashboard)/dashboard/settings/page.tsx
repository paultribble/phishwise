"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, School } from "lucide-react";

export default function SettingsPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    redirect("/login");
  }

  const initials = session.user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const roleLabel =
    session.user.role === "ADMIN"
      ? "Admin"
      : session.user.role === "MANAGER"
      ? "Manager"
      : "User";

  const roleVariant =
    session.user.role === "ADMIN"
      ? "danger"
      : session.user.role === "MANAGER"
      ? "warning"
      : "success";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-200">Settings</h1>
        <p className="mt-1 text-gray-400">Manage your account preferences</p>
      </div>

      {/* Profile */}
      <Card className="border-gray-700 bg-phish-blue/30">
        <CardHeader>
          <CardTitle className="text-gray-200">Profile</CardTitle>
          <CardDescription className="text-gray-400">
            Your Google account information
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={session.user.image ?? undefined} />
            <AvatarFallback className="bg-primary-800 text-lg text-white">
              {initials ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-lg font-medium text-gray-200">
              {session.user.name ?? "Unknown"}
            </p>
            <p className="text-sm text-gray-400">{session.user.email ?? ""}</p>
            <p className="text-xs text-gray-500">
              Managed by Google — update your name or photo in your Google account
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Account */}
      <Card className="border-gray-700 bg-phish-blue/30">
        <CardHeader>
          <CardTitle className="text-gray-200">Account</CardTitle>
          <CardDescription className="text-gray-400">
            Your role and school membership
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-md border border-gray-700 px-4 py-3">
            <div className="flex items-center gap-3">
              {session.user.role === "MANAGER" || session.user.role === "ADMIN" ? (
                <Shield className="h-4 w-4 text-warning-400" />
              ) : (
                <Users className="h-4 w-4 text-primary-400" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-300">Role</p>
                <p className="text-xs text-gray-500">Your permission level on PhishWise</p>
              </div>
            </div>
            <Badge variant={roleVariant}>{roleLabel}</Badge>
          </div>

          <div className="flex items-center justify-between rounded-md border border-gray-700 px-4 py-3">
            <div className="flex items-center gap-3">
              <School className="h-4 w-4 text-primary-400" />
              <div>
                <p className="text-sm font-medium text-gray-300">School</p>
                <p className="text-xs text-gray-500">The organization you belong to</p>
              </div>
            </div>
            <span className="text-sm text-gray-400">
              {session.user.schoolId ? "Enrolled" : "Not enrolled"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Notifications placeholder */}
      <Card className="border-gray-700 bg-phish-blue/30">
        <CardHeader>
          <CardTitle className="text-gray-200">Notifications</CardTitle>
          <CardDescription className="text-gray-400">
            Control how PhishWise contacts you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              label: "Simulation emails",
              description: "Receive phishing simulation emails for training",
              defaultOn: true,
            },
            {
              label: "Training reminders",
              description: "Get reminded to complete pending training modules",
              defaultOn: true,
            },
            {
              label: "Progress reports",
              description: "Weekly summary of your phishing awareness score",
              defaultOn: false,
            },
          ].map((pref) => (
            <div
              key={pref.label}
              className="flex items-center justify-between rounded-md border border-gray-700 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-gray-300">{pref.label}</p>
                <p className="text-xs text-gray-500">{pref.description}</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  defaultChecked={pref.defaultOn}
                  className="peer sr-only"
                  readOnly
                />
                <div className="peer h-5 w-9 rounded-full bg-gray-700 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full" />
              </label>
            </div>
          ))}
          <p className="text-xs text-gray-600">
            Notification preferences will be configurable in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
