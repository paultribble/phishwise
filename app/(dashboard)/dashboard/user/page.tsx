"use client";

import { useState, useEffect } from "react";
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

type SimEntry = {
  id: string;
  subject: string;
  sentAt: string;
  clicked: boolean;
  completedAt: string | null;
};

export default function UserDashboard() {
  const { data: session, status } = useSession();

  const [stats, setStats] = useState({ totalSent: 0, totalClicked: 0, totalCompleted: 0 });
  const [history, setHistory] = useState<SimEntry[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;
    Promise.all([
      fetch("/api/users").then((r) => r.json()),
      fetch("/api/simulations?limit=5").then((r) => r.json()),
    ]).then(([userData, simData]) => {
      if (userData.metrics) setStats(userData.metrics);
      if (simData.simulations) {
        setHistory(
          simData.simulations.map((s: { id: string; template: { subject: string }; sentAt: string; clicked: boolean; completedAt: string | null }) => ({
            id: s.id,
            subject: s.template.subject,
            sentAt: new Date(s.sentAt).toLocaleDateString(),
            clicked: s.clicked,
            completedAt: s.completedAt,
          }))
        );
      }
      setDataLoading(false);
    });
  }, [status]);

  if (status === "loading" || dataLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    redirect("/login");
  }

  const clickRate = stats.totalSent > 0 ? Math.round((stats.totalClicked / stats.totalSent) * 100) : 0;
  const completionRate =
    stats.totalSent > 0
      ? Math.round(
          ((stats.totalSent - stats.totalClicked) /
            stats.totalSent) *
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
              {stats.totalSent}
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
              {stats.totalClicked}
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
              {stats.totalCompleted}
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
              {clickRate}%
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
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-500">
                      No simulations yet
                    </td>
                  </tr>
                ) : (
                  history.map((sim) => (
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
                        {sim.clicked && sim.completedAt ? (
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
