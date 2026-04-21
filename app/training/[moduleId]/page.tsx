"use client";

import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Shield,
  AlertOctagon,
  Target,
  BookOpen,
  ListChecks,
  ShieldCheck,
  Users,
  Lightbulb,
  HelpCircle,
  Zap,
  Award,
  Flame,
} from "lucide-react";
import { useState, useEffect } from "react";

interface TrainingTactic {
  name: string;
  description: string;
}

interface TrainingExample {
  title: string;
  body: string;
  redFlags: string[];
}

interface TrainingQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface TrainingModuleContent {
  overview: string;
  tactics: TrainingTactic[];
  redFlags: string[];
  objective: string;
  examples: TrainingExample[];
  preventionSteps: string[];
  quiz: TrainingQuiz;
}

const SECTIONS = [
  { id: "overview", title: "Overview", icon: BookOpen },
  { id: "tactics", title: "Tactics", icon: Users },
  { id: "redFlags", title: "Red Flags", icon: AlertOctagon },
  { id: "objective", title: "Objective", icon: Target },
  { id: "examples", title: "Examples", icon: AlertTriangle },
  { id: "prevention", title: "Prevention", icon: ShieldCheck },
  { id: "quiz", title: "Quiz", icon: HelpCircle },
];

export default function TrainingModulePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const moduleId = params.moduleId as string;
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [module, setModule] = useState<{
    id: string;
    name: string;
    description: string;
    content: TrainingModuleContent;
  } | null>(null);
  const [userStatus, setUserStatus] = useState<{
    completed: boolean;
  } | null>(null);
  const [isRequired, setIsRequired] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    async function fetchModule() {
      try {
        const res = await fetch(`/api/training/${moduleId}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Module not found");
          } else {
            setError("Failed to load module");
          }
          return;
        }
        const data = await res.json();
        setModule(data.module);
        setUserStatus(data.userStatus);
        setIsRequired(data.isRequired);
      } catch {
        setError("Failed to load module");
      } finally {
        setLoading(false);
      }
    }
    fetchModule();
  }, [moduleId]);

  const handleComplete = async () => {
    setCompleting(true);
    try {
      const res = await fetch(`/api/training/${moduleId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passed: true }),
      });
      if (res.ok) {
        router.push("/dashboard/user?completed=true");
      }
    } catch {
      setError("Failed to complete module");
    } finally {
      setCompleting(false);
    }
  };

  const isQuizSection = currentSection === 6;
  const progress = isQuizSection
    ? 100
    : Math.round(((currentSection + 1) / SECTIONS.length) * 85);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">PhishWise</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 px-4 py-8">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-slate-700 rounded-lg w-3/4"></div>
              <div className="h-4 bg-slate-700 rounded-lg w-1/2"></div>
              <div className="h-64 bg-slate-700 rounded-lg"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">PhishWise</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 px-4 py-8">
          <div className="mx-auto max-w-6xl">
            <Card className="border-red-500/30 bg-gradient-to-br from-red-500/10 to-red-600/5">
              <CardContent className="flex flex-col items-center gap-4 py-12">
                <div className="rounded-full bg-red-500/20 p-4">
                  <AlertTriangle className="h-10 w-10 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-100">
                  {error || "Module not found"}
                </h2>
                <p className="text-gray-400 text-center max-w-md">
                  {error === "Module not found"
                    ? "The training module you're looking for doesn't exist or has been removed."
                    : "There was a problem loading the training module. Please try again."}
                </p>
                <Link href="/dashboard/user">
                  <Button className="mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                    Return to Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  const content = module.content;
  const currentSectionDef = SECTIONS[currentSection];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-400" />
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">PhishWise</span>
          </Link>
          <Link
            href="/dashboard/user"
            className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      {token && (
        <div className="mx-auto max-w-6xl px-4 pt-6 w-full">
          <div
            className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-gradient-to-br from-red-500/15 to-red-600/5 p-4 backdrop-blur-sm"
            role="alert"
          >
            <Flame className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400 animate-pulse" />
            <div>
              <h2 className="font-semibold text-red-300">
                You clicked a simulated phishing link
              </h2>
              <p className="mt-1 text-sm text-red-200/70">
                Don&apos;t worry — this was a training exercise. Complete this
                module to learn how to spot similar attacks in the future.
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                  {module.name}
                </h1>
                <p className="mt-2 text-slate-400">{module.description}</p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-3 bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">Progress</span>
              <span className="text-sm font-bold text-blue-400">{progress}%</span>
            </div>
            <Progress value={progress} className="bg-slate-700 h-2.5" />
          </div>

          {/* Section Navigation */}
          <div className="flex flex-wrap gap-2">
            {SECTIONS.map((section, i) => {
              const Icon = section.icon;
              const isActive = currentSection === i;
              const isCompleted = i < currentSection;
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setCurrentSection(i);
                    setQuizSubmitted(false);
                    setQuizAnswer(null);
                  }}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                      : isCompleted
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {section.title}
                  {isCompleted && <CheckCircle2 className="h-4 w-4 ml-1" />}
                </button>
              );
            })}
          </div>

          {/* Content Card */}
          <Card className="border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-700/50 pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                {currentSectionDef.icon && (
                  <div className="rounded-lg bg-blue-500/20 p-2.5">
                    <currentSectionDef.icon className="h-5 w-5 text-blue-400" />
                  </div>
                )}
                <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                  {currentSectionDef.title}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {currentSection === 0 && (
                <div className="space-y-6">
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line text-base">
                    {content.overview}
                  </p>
                  <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-4 flex gap-3">
                    <Lightbulb className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-200">
                      Take your time going through each section to understand the concepts before taking the quiz.
                    </p>
                  </div>
                </div>
              )}

              {currentSection === 1 && (
                <div className="grid gap-4 md:grid-cols-2">
                  {content.tactics.map((tactic, i) => (
                    <div
                      key={i}
                      className="group rounded-lg border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-5 hover:border-blue-500/50 hover:bg-slate-800/70 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10"
                    >
                      <h3 className="font-semibold text-slate-100 group-hover:text-blue-300 transition-colors">
                        {tactic.name}
                      </h3>
                      <p className="mt-2 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                        {tactic.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {currentSection === 2 && (
                <div className="space-y-3">
                  {content.redFlags.map((flag, i) => (
                    <div key={i} className="flex items-start gap-4 rounded-lg bg-slate-800/30 p-4 border border-slate-700/50 hover:border-red-500/30 hover:bg-slate-800/50 transition-all duration-200">
                      <AlertOctagon className="h-5 w-5 flex-shrink-0 text-red-400 mt-0.5" />
                      <span className="text-slate-300 pt-0.5">{flag}</span>
                    </div>
                  ))}
                </div>
              )}

              {currentSection === 3 && (
                <div className="space-y-4">
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line text-base">
                    {content.objective}
                  </p>
                  <div className="rounded-lg bg-cyan-500/10 border border-cyan-500/30 p-4 flex gap-3">
                    <Target className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-cyan-200">
                      Understanding the attacker&apos;s objective helps you recognize phishing attempts.
                    </p>
                  </div>
                </div>
              )}

              {currentSection === 4 && (
                <div className="space-y-6">
                  {content.examples.map((example, i) => (
                    <div key={i} className="space-y-4 rounded-lg border border-slate-700/50 bg-slate-800/30 p-6">
                      <h3 className="font-semibold text-slate-100 text-lg">{example.title}</h3>
                      <div className="rounded-lg border border-slate-600/50 bg-slate-900/80 p-5 font-mono text-sm text-slate-400 overflow-x-auto">
                        <p className="whitespace-pre-wrap">{example.body}</p>
                      </div>
                      <div className="space-y-3">
                        <p className="text-sm font-semibold text-red-400 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Red Flags:
                        </p>
                        <ul className="space-y-2">
                          {example.redFlags.map((flag, j) => (
                            <li key={j} className="flex items-start gap-3 text-sm">
                              <span className="text-red-400 font-bold mt-0.5">•</span>
                              <span className="text-slate-300">{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentSection === 5 && (
                <div className="space-y-4">
                  {content.preventionSteps.map((step, i) => (
                    <div key={i} className="flex gap-5 items-start group">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 font-bold text-slate-900 group-hover:shadow-lg group-hover:shadow-emerald-500/30 transition-all duration-200">
                        {i + 1}
                      </div>
                      <span className="text-slate-300 pt-1.5 leading-relaxed">{step}</span>
                    </div>
                  ))}
                  <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-4 flex gap-3 mt-6">
                    <ShieldCheck className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-emerald-200">
                      Following these prevention steps will significantly reduce your risk of falling victim to phishing attacks.
                    </p>
                  </div>
                </div>
              )}

              {currentSection === 6 && (
                <div className="space-y-6">
                  {!quizSubmitted ? (
                    <>
                      <div>
                        <p className="text-xl font-semibold text-slate-100 mb-6">
                          {content.quiz.question}
                        </p>
                        <div className="space-y-3">
                          {content.quiz.options.map((option, i) => (
                            <button
                              key={i}
                              onClick={() => setQuizAnswer(i)}
                              className={`w-full flex items-center gap-4 rounded-lg border-2 p-5 text-left transition-all duration-200 ${
                                quizAnswer === i
                                  ? "border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/20"
                                  : "border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800/70"
                              }`}
                            >
                              <span
                                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold flex-shrink-0 transition-all duration-200 ${
                                  quizAnswer === i
                                    ? "border-blue-400 bg-blue-500 text-white"
                                    : "border-slate-600 text-slate-400"
                                }`}
                              >
                                {String.fromCharCode(65 + i)}
                              </span>
                              <span className="text-slate-200">{option}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <Button
                        onClick={() => setQuizSubmitted(true)}
                        disabled={quizAnswer === null}
                        className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        Submit Answer
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-6">
                      <div
                        className={`flex items-start gap-4 rounded-lg border-2 p-6 transition-all duration-200 ${
                          quizAnswer === content.quiz.correctIndex
                            ? "border-emerald-500/50 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10"
                            : "border-red-500/50 bg-gradient-to-br from-red-500/20 to-red-600/10"
                        }`}
                      >
                        {quizAnswer === content.quiz.correctIndex ? (
                          <div className="rounded-full bg-emerald-500/30 p-2">
                            <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-emerald-400" />
                          </div>
                        ) : (
                          <div className="rounded-full bg-red-500/30 p-2">
                            <AlertTriangle className="h-6 w-6 flex-shrink-0 text-red-400" />
                          </div>
                        )}
                        <div>
                          <p
                            className={`font-semibold text-lg ${
                              quizAnswer === content.quiz.correctIndex
                                ? "text-emerald-300"
                                : "text-red-300"
                            }`}
                          >
                            {quizAnswer === content.quiz.correctIndex
                              ? "🎉 Correct!"
                              : "Not quite right"}
                          </p>
                          <p className="mt-2 text-slate-300">
                            {content.quiz.explanation}
                          </p>
                        </div>
                      </div>

                      {quizAnswer === content.quiz.correctIndex ? (
                        <div className="flex gap-4">
                          <Button
                            onClick={handleComplete}
                            disabled={completing}
                            className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition-all duration-200"
                          >
                            <Award className="mr-2 h-5 w-5" />
                            {completing
                              ? "Completing..."
                              : userStatus?.completed
                                ? "Already Completed"
                                : "Complete Module"}
                          </Button>
                          {!isRequired && !userStatus?.completed && (
                            <Link href="/dashboard/user" className="flex-1">
                              <Button
                                variant="outline"
                                className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
                              >
                                Skip
                              </Button>
                            </Link>
                          )}
                        </div>
                      ) : (
                        <Button
                          onClick={() => {
                            setQuizAnswer(null);
                            setQuizSubmitted(false);
                          }}
                          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition-all duration-200"
                        >
                          <Zap className="mr-2 h-5 w-5" />
                          Try Again
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {!isQuizSection && (
                <div className="mt-8 flex justify-between gap-4 pt-6 border-t border-slate-700/50">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentSection(Math.max(0, currentSection - 1))
                    }
                    disabled={currentSection === 0}
                    className="border-slate-600 text-slate-300 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  {currentSection < SECTIONS.length - 2 ? (
                    <Button
                      onClick={() => setCurrentSection(currentSection + 1)}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                    >
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentSection(currentSection + 1)}
                      className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
                    >
                      Go to Quiz
                      <Zap className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-slate-700/50 py-6 text-center text-xs text-slate-500 mt-8 bg-slate-900/50">
        <p>University of Arkansas - CSCE Capstone 2025 | PhishWise Training Platform</p>
      </footer>
    </div>
  );
}
