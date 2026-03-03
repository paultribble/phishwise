import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
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
import { bebas, playfair } from "@/lib/fonts";

interface TrainingModule {
  id: string;
  name: string;
  description: string;
  completedAt: Date | null;
  assignedAt: Date;
}

async function getTrainingData(userId: string) {
  const userTraining = await prisma.userTraining.findMany({
    where: { userId },
    include: {
      module: true,
    },
    orderBy: { assignedAt: "desc" },
  });

  const pending: TrainingModule[] = [];
  const completed: TrainingModule[] = [];

  for (const ut of userTraining) {
    const mod = {
      id: ut.module.id,
      name: ut.module.name,
      description: ut.module.description,
      completedAt: ut.completedAt,
      assignedAt: ut.assignedAt,
    };
    if (ut.completedAt) {
      completed.push(mod);
    } else {
      pending.push(mod);
    }
  }

  return { pending, completed };
}

export default async function TrainingOverviewPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { pending, completed } = await getTrainingData(session.user.id);
  const hasModules = pending.length > 0 || completed.length > 0;

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className={`text-4xl font-bold text-gray-200 ${bebas.className}`}>
              Training Overview
            </h1>
            <p className="mt-2 text-lg text-gray-400">
              View and complete your assigned training modules
            </p>
          </div>

          {/* Empty State */}
          {!hasModules && (
            <Card className="border-gray-700 bg-phish-blue/30">
              <CardContent className="flex flex-col items-center gap-4 py-12">
                <p className="text-center text-gray-400">
                  You have no training modules assigned yet.
                </p>
                <p className="text-sm text-gray-500">
                  Check back later or contact your manager for more information.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Pending Modules */}
          {pending.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-200">
                Pending Modules
              </h2>
              <div className="grid gap-4">
                {pending.map((mod) => (
                  <Card
                    key={mod.id}
                    className="border-warning-500/50 bg-warning-500/10"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-gray-200">
                            {mod.name}
                          </CardTitle>
                          <CardDescription className="text-gray-400 mt-1">
                            {mod.description}
                          </CardDescription>
                        </div>
                        <Badge variant="warning">Pending</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                          Assigned: {mod.assignedAt.toLocaleDateString()}
                        </p>
                        <Link
                          href={`/training/${mod.id}`}
                          className="rounded-md bg-warning-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-warning-700"
                        >
                          Start Module
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Completed Modules */}
          {completed.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-200">
                Completed Modules
              </h2>
              <div className="grid gap-4">
                {completed.map((mod) => (
                  <Card
                    key={mod.id}
                    className="border-gray-700 bg-phish-blue/20"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-gray-200">
                            {mod.name}
                          </CardTitle>
                          <CardDescription className="text-gray-400 mt-1">
                            {mod.description}
                          </CardDescription>
                        </div>
                        <Badge variant="success">Completed</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                          Completed: {mod.completedAt?.toLocaleDateString()}
                        </p>
                        <Link
                          href={`/training/${mod.id}`}
                          className="rounded-md border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800"
                        >
                          Review
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
