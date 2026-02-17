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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Mail,
  MousePointerClick,
  BookCheck,
  TrendingDown,
  ShieldAlert,
} from "lucide-react";

// Placeholder data - will be replaced with real API calls
const mockSchoolStats = {
  totalUsers: 15,
  totalSimulations: 180,
  avgClickRate: 22,
  totalTrainingCompleted: 42,
};

const mockUsers = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", sent: 12, clicked: 2, completed: 2, clickRate: 17 },
  { id: "2", name: "Bob Smith", email: "bob@example.com", sent: 12, clicked: 5, completed: 3, clickRate: 42 },
  { id: "3", name: "Carol Davis", email: "carol@example.com", sent: 12, clicked: 1, completed: 1, clickRate: 8 },
  { id: "4", name: "Dan Wilson", email: "dan@example.com", sent: 12, clicked: 4, completed: 2, clickRate: 33 },
  { id: "5", name: "Eve Martinez", email: "eve@example.com", sent: 12, clicked: 0, completed: 0, clickRate: 0 },
];

export default function ManagerDashboard() {
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-200">
            School Overview
          </h1>
          <p className="mt-1 text-gray-400">
            Manage your school&apos;s phishing awareness training
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700">
            Send Simulation
          </button>
          <button className="rounded-md border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800">
            Invite Users
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-700 bg-phish-blue/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-primary-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-200">
              {mockSchoolStats.totalUsers}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-phish-blue/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Simulations Sent
            </CardTitle>
            <Mail className="h-4 w-4 text-primary-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-200">
              {mockSchoolStats.totalSimulations}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-phish-blue/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Avg Click Rate
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-warning-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning-400">
              {mockSchoolStats.avgClickRate}%
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-phish-blue/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Training Completed
            </CardTitle>
            <BookCheck className="h-4 w-4 text-success-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success-400">
              {mockSchoolStats.totalTrainingCompleted}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Performance Table */}
      <Card className="border-gray-700 bg-phish-blue/30">
        <CardHeader>
          <CardTitle className="text-gray-200">User Performance</CardTitle>
          <CardDescription className="text-gray-400">
            Click rates and training completion for all users in your school
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-gray-700 text-left">
                  <th className="pb-3 pr-4 font-medium text-gray-400">User</th>
                  <th className="pb-3 pr-4 font-medium text-gray-400">Sent</th>
                  <th className="pb-3 pr-4 font-medium text-gray-400">
                    Clicked
                  </th>
                  <th className="pb-3 pr-4 font-medium text-gray-400">
                    Click Rate
                  </th>
                  <th className="pb-3 pr-4 font-medium text-gray-400">
                    Training Done
                  </th>
                  <th className="pb-3 font-medium text-gray-400">Risk</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-700/50 last:border-0"
                  >
                    <td className="py-3 pr-4">
                      <div>
                        <div className="font-medium text-gray-300">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-400">{user.sent}</td>
                    <td className="py-3 pr-4 text-gray-400">{user.clicked}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <Progress
                          value={user.clickRate}
                          className="h-2 w-16 bg-gray-700"
                        />
                        <span className="text-gray-300">{user.clickRate}%</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-400">
                      {user.completed}
                    </td>
                    <td className="py-3">
                      {user.clickRate >= 30 ? (
                        <Badge variant="danger">
                          <ShieldAlert className="mr-1 h-3 w-3" />
                          High
                        </Badge>
                      ) : user.clickRate >= 15 ? (
                        <Badge variant="warning">Medium</Badge>
                      ) : (
                        <Badge variant="success">Low</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
