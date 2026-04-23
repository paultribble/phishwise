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
import {
  BookOpen,
  Target,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Flame,
  Zap,
  Award,
  ArrowRight,
  Users,
} from "lucide-react";

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

  const getModuleIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("phishing") || lowerName.includes("email")) return Flame;
    if (lowerName.includes("password") || lowerName.includes("credential")) return Lock;
    if (lowerName.includes("social")) return Users;
    if (lowerName.includes("malware") || lowerName.includes("malicious")) return AlertTriangle;
    if (lowerName.includes("secure")) return Shield;
    return BookOpen;
  };

  const ModuleCard = ({
    mod,
    isCompleted,
  }: {
    mod: TrainingModule;
    isCompleted: boolean;
  }) => {
    const Icon = getModuleIcon(mod.name);
    const colors = isCompleted
      ? {
          bg: "from-emerald-500/20 to-teal-500/20",
          border: "border-emerald-500/30",
          icon: "bg-emerald-500/30 text-emerald-400",
          accent: "emerald",
          badge: "bg-emerald-600/80 text-emerald-50",
          button: "bg-emerald-600/80 hover:bg-emerald-700/80",
          text: "text-emerald-200/90",
        }
      : {
          bg: "from-blue-500/15 to-purple-500/15",
          border: "border-blue-500/30",
          icon: "bg-blue-500/30 text-blue-400",
          accent: "blue",
          badge: "bg-blue-600/80 text-blue-50",
          button: "bg-blue-600/80 hover:bg-blue-700/80",
          text: "text-blue-200/90",
        };

    return (
      <Link
        href={`/training/${mod.id}`}
        className="group relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20"
        style={{
          background: `linear-gradient(135deg, rgba(59, 130, 246, ${isCompleted ? 0.08 : 0.12}), rgba(139, 92, 246, ${isCompleted ? 0.04 : 0.08}))`,
          borderColor: isCompleted ? "rgb(16, 185, 129, 0.4)" : "rgb(59, 130, 246, 0.4)",
        }}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${
                isCompleted ? "rgba(16, 185, 129, 0.05)" : "rgba(59, 130, 246, 0.05)"
              }, transparent)`,
            }}
          />
        </div>

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{
            background: isCompleted
              ? "linear-gradient(90deg, transparent, rgba(16,185,129,0.6), transparent)"
              : "linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent)",
          }}
        />

        {/* Content */}
        <div className="relative p-6 flex flex-col h-full">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div
              className={`${colors.icon} rounded-xl p-3 group-hover:scale-110 transition-transform duration-300`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex gap-2">
              <Badge className={`${colors.badge} border-0 text-xs font-semibold`}>
                {isCompleted ? "✓ Completed" : "Pending"}
              </Badge>
            </div>
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-blue-200 transition-colors mb-2">
            {mod.name}
          </h3>

          <p className={`text-sm ${colors.text} mb-4 flex-grow`}>
            {mod.description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <p className="text-xs text-slate-400">
              {isCompleted
                ? `Completed ${mod.completedAt?.toLocaleDateString()}`
                : `Assigned ${mod.assignedAt.toLocaleDateString()}`}
            </p>
            <div className={`transform group-hover:translate-x-1 transition-transform duration-300 ${colors.text}`}>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl opacity-40"
          style={{ animation: "blob 7s infinite" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl opacity-40"
          style={{ animation: "blob 7s infinite 2s" }}
        />
      </div>

      <main className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 w-fit">
              <Shield className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-semibold text-blue-300">Training Program</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
              Security Training Modules
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl">
              Strengthen your defenses with hands-on phishing awareness training. Master the tactics, recognize the red flags, and become a security expert.
            </p>
          </div>

          {/* Empty State */}
          {!hasModules && (
            <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl p-12">
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.5) 50%, transparent)" }} />
              <div className="relative flex flex-col items-center gap-4 text-center">
                <div className="rounded-full bg-blue-500/20 p-4">
                  <BookOpen className="h-8 w-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-100 mb-2">
                    No training modules assigned yet
                  </h3>
                  <p className="text-slate-400">
                    Check back later or contact your manager to get started with your security training.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Overview */}
          {hasModules && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pending.length > 0 && (
                <div className="rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-xl p-4 flex items-center gap-3">
                  <div className="rounded-lg bg-blue-500/30 p-2">
                    <Zap className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Pending</p>
                    <p className="text-2xl font-bold text-blue-300">{pending.length}</p>
                  </div>
                </div>
              )}
              {completed.length > 0 && (
                <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 backdrop-blur-xl p-4 flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-500/30 p-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Completed</p>
                    <p className="text-2xl font-bold text-emerald-300">{completed.length}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pending Modules */}
          {pending.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/20 p-2">
                  <AlertTriangle className="h-5 w-5 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Pending Modules
                </h2>
                <Badge className="bg-blue-600/60 text-blue-100 border-0 ml-auto">
                  {pending.length} to complete
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {pending.map((mod) => (
                  <ModuleCard key={mod.id} mod={mod} isCompleted={false} />
                ))}
              </div>
            </section>
          )}

          {/* Completed Modules */}
          {completed.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-500/20 p-2">
                  <Award className="h-5 w-5 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Completed Modules
                </h2>
                <Badge className="bg-emerald-600/60 text-emerald-100 border-0 ml-auto">
                  {completed.length} completed
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {completed.map((mod) => (
                  <ModuleCard key={mod.id} mod={mod} isCompleted={true} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
