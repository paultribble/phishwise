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
import { Mail, MousePointerClick, BookCheck, TrendingDown } from "lucide-react";

// Placeholder data - will be replaced with real API calls
const mockStats = {
  totalSent: 12,
  totalClicked: 3,
  totalCompleted: 2,
  clickRate: 25,
};

const mockHistory = [
  {
    id: "1",
    subject: "Urgent: Verify your account",
    sentAt: "2025-02-10",
    clicked: true,
    completed: true,
  },
  {
    id: "2",
    subject: "You have a new payment",
    sentAt: "2025-02-05",
    clicked: false,
    completed: false,
  },
  {
    id: "3",
    subject: "Re: Meeting tomorrow",
    sentAt: "2025-01-28",
    clicked: true,
    completed: true,
  },
  {
    id: "4",
    subject: "Password reset request",
    sentAt: "2025-01-20",
    clicked: true,
    completed: false,
  },
  {
    id: "5",
    subject: "Shared document notification",
    sentAt: "2025-01-15",
    clicked: false,
    completed: false,
  },
];

export default function UserDashboard() {
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

  const completionRate =
    mockStats.totalSent > 0
      ? Math.round(
          ((mockStats.totalSent - mockStats.totalClicked) /
            mockStats.totalSent) *
            100
        )
      : 0;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-gray-200">
          Welcome back, {session.user.name?.split(" ")[0] ?? "User"}
        </h1>
        <p className="mt-1 text-gray-400">
          Here&apos;s your phishing awareness progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-700 bg-phish-blue/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Emails Received
            </CardTitle>
            <Mail className="h-4 w-4 text-primary-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-200">
              {mockStats.totalSent}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-phish-blue/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Links Clicked
            </CardTitle>
            <MousePointerClick className="h-4 w-4 text-danger-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-danger-400">
              {mockStats.totalClicked}
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
              {mockStats.totalCompleted}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-phish-blue/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Click Rate
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-warning-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-200">
              {mockStats.clickRate}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Awareness Score */}
      <Card className="border-gray-700 bg-phish-blue/30">
        <CardHeader>
          <CardTitle className="text-gray-200">Awareness Score</CardTitle>
          <CardDescription className="text-gray-400">
            Percentage of simulations you correctly identified as phishing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <span className="font-medium text-gray-200">{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="bg-gray-700" />
        </CardContent>
      </Card>

      {/* Recent Simulations */}
      <Card className="border-gray-700 bg-phish-blue/30">
        <CardHeader>
          <CardTitle className="text-gray-200">Recent Simulations</CardTitle>
          <CardDescription className="text-gray-400">
            Your last 5 phishing simulation results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-gray-700 text-left">
                  <th className="pb-3 pr-4 font-medium text-gray-400">
                    Subject
                  </th>
                  <th className="pb-3 pr-4 font-medium text-gray-400">Date</th>
                  <th className="pb-3 pr-4 font-medium text-gray-400">
                    Status
                  </th>
                  <th className="pb-3 font-medium text-gray-400">Training</th>
                </tr>
              </thead>
              <tbody>
                {mockHistory.map((sim) => (
                  <tr
                    key={sim.id}
                    className="border-b border-gray-700/50 last:border-0"
                  >
                    <td className="py-3 pr-4 text-gray-300">{sim.subject}</td>
                    <td className="py-3 pr-4 text-gray-400">{sim.sentAt}</td>
                    <td className="py-3 pr-4">
                      {sim.clicked ? (
                        <Badge variant="danger">Clicked</Badge>
                      ) : (
                        <Badge variant="success">Safe</Badge>
                      )}
                    </td>
                    <td className="py-3">
                      {sim.clicked && sim.completed ? (
                        <Badge variant="outline" className="text-success-400 border-success-500">
                          Completed
                        </Badge>
                      ) : sim.clicked ? (
                        <Badge variant="outline" className="text-warning-400 border-warning-500">
                          Pending
                        </Badge>
                      ) : (
                        <span className="text-gray-500">—</span>
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
