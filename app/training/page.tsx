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
    <div className="min-h-screen bg-[#0f0f1a]">
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Training Modules
            </h1>
            <p className="mt-2 text-base text-slate-400">
              View and complete your assigned training modules
            </p>
          </div>

          {/* Empty State */}
          {!hasModules && (
            <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#1a1a2e]/80 backdrop-blur-sm p-8">
              <div className="absolute top-0 left-6 right-6 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.5) 50%, transparent)" }} />
              <div className="flex flex-col items-center gap-3">
                <p className="text-center text-slate-300">
                  You have no training modules assigned yet.
                </p>
                <p className="text-sm text-slate-400">
                  Check back later or contact your manager for more information.
                </p>
              </div>
            </div>
          )}

          {/* Pending Modules */}
          {pending.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-white">
                Pending Modules
              </h2>
              <div className="space-y-3">
                {pending.map((mod) => (
                  <div
                    key={mod.id}
                    className="relative overflow-hidden rounded-xl border border-amber-500/20 bg-amber-500/10 backdrop-blur-sm p-6"
                  >
                    <div className="absolute top-0 left-6 right-6 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(251,146,60,0.5) 50%, transparent)" }} />
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-white truncate">
                          {mod.name}
                        </h3>
                        <p className="text-sm text-amber-200/70 mt-1">
                          {mod.description}
                        </p>
                        <p className="text-xs text-amber-200/50 mt-2">
                          Assigned: {mod.assignedAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <Badge className="bg-amber-600 text-white border-0">Pending</Badge>
                        <Link
                          href={`/training/${mod.id}`}
                          className="inline-flex items-center rounded-lg bg-amber-600 hover:bg-amber-700 px-4 py-2 text-sm font-medium text-white transition-colors"
                        >
                          Start Module
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Completed Modules */}
          {completed.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-white">
                Completed Modules
              </h2>
              <div className="space-y-3">
                {completed.map((mod) => (
                  <div
                    key={mod.id}
                    className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-sm p-6"
                  >
                    <div className="absolute top-0 left-6 right-6 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.5) 50%, transparent)" }} />
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-white truncate">
                          {mod.name}
                        </h3>
                        <p className="text-sm text-emerald-200/70 mt-1">
                          {mod.description}
                        </p>
                        <p className="text-xs text-emerald-200/50 mt-2">
                          Completed: {mod.completedAt?.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <Badge className="bg-emerald-600 text-white border-0">Completed</Badge>
                        <Link
                          href={`/training/${mod.id}`}
                          className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition-colors"
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
