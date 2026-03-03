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
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-gray-700 bg-phish-navy/90 backdrop-blur-sm">
          <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary-500" />
              <span className="text-lg font-bold text-gray-200">PhishWise</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 px-4 py-8">
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              <div className="h-64 bg-gray-700 rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-gray-700 bg-phish-navy/90 backdrop-blur-sm">
          <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary-500" />
              <span className="text-lg font-bold text-gray-200">PhishWise</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 px-4 py-8">
          <div className="mx-auto max-w-4xl">
            <Card className="border-danger-500/50 bg-danger-500/10">
              <CardContent className="flex flex-col items-center gap-4 py-8">
                <AlertTriangle className="h-12 w-12 text-danger-400" />
                <h2 className="text-2xl font-bold text-gray-200">
                  {error || "Module not found"}
                </h2>
                <Link href="/dashboard/user">
                  <Button className="mt-4 bg-primary-600 hover:bg-primary-700">
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
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-700 bg-phish-navy/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary-500" />
            <span className="text-lg font-bold text-gray-200">PhishWise</span>
          </Link>
          <Link
            href="/dashboard/user"
            className="text-sm text-gray-400 hover:text-gray-200"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      {token && (
        <div className="mx-auto max-w-4xl px-4 pt-4">
          <div
            className="flex items-start gap-3 rounded-lg border border-danger-500/50 bg-danger-500/10 p-4"
            role="alert"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-danger-400" />
            <div>
              <h2 className="font-semibold text-danger-300">
                You clicked a simulated phishing link
              </h2>
              <p className="mt-1 text-sm text-danger-200/80">
                Don&apos;t worry — this was a training exercise. Complete this
                module to learn how to spot similar attacks.
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-200">{module.name}</h1>
            <p className="mt-2 text-gray-400">{module.description}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Progress</span>
              <span className="font-medium text-gray-200">{progress}%</span>
            </div>
            <Progress value={progress} className="bg-gray-700" />
          </div>

          <div className="flex flex-wrap gap-2">
            {SECTIONS.map((section, i) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setCurrentSection(i);
                    setQuizSubmitted(false);
                    setQuizAnswer(null);
                  }}
                  className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    currentSection === i
                      ? "bg-primary-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {section.title}
                </button>
              );
            })}
          </div>

          <Card className="border-gray-700 bg-phish-blue/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-200">
                {currentSectionDef.icon && (
                  <currentSectionDef.icon className="h-5 w-5" />
                )}
                {currentSectionDef.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentSection === 0 && (
                <div className="space-y-4">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {content.overview}
                  </p>
                </div>
              )}

              {currentSection === 1 && (
                <div className="grid gap-4 md:grid-cols-2">
                  {content.tactics.map((tactic, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-gray-700 bg-black/20 p-4"
                    >
                      <h3 className="font-semibold text-gray-200">{tactic.name}</h3>
                      <p className="mt-2 text-sm text-gray-400">{tactic.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {currentSection === 2 && (
                <ul className="space-y-3">
                  {content.redFlags.map((flag, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <AlertOctagon className="h-5 w-5 flex-shrink-0 text-warning-400 mt-0.5" />
                      <span className="text-gray-300">{flag}</span>
                    </li>
                  ))}
                </ul>
              )}

              {currentSection === 3 && (
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {content.objective}
                </p>
              )}

              {currentSection === 4 && (
                <div className="space-y-6">
                  {content.examples.map((example, i) => (
                    <div key={i} className="space-y-3">
                      <h3 className="font-semibold text-gray-200">{example.title}</h3>
                      <div className="rounded-lg border border-gray-600 bg-gray-900/50 p-4">
                        <p className="text-gray-300 italic">{example.body}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-400">Red Flags:</p>
                        <ul className="space-y-1">
                          {example.redFlags.map((flag, j) => (
                            <li key={j} className="flex items-center gap-2 text-sm">
                              <span className="text-danger-400">•</span>
                              <span className="text-gray-300">{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentSection === 5 && (
                <ol className="space-y-4">
                  {content.preventionSteps.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success-600/20 text-success-400 font-semibold">
                        {i + 1}
                      </span>
                      <span className="text-gray-300 pt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              )}

              {currentSection === 6 && (
                <div className="space-y-6">
                  {!quizSubmitted ? (
                    <>
                      <div>
                        <p className="text-lg font-medium text-gray-200 mb-4">
                          {content.quiz.question}
                        </p>
                        <div className="space-y-3">
                          {content.quiz.options.map((option, i) => (
                            <button
                              key={i}
                              onClick={() => setQuizAnswer(i)}
                              className={`w-full flex items-center gap-3 rounded-md border p-4 text-left transition-colors ${
                                quizAnswer === i
                                  ? "border-primary-500 bg-primary-500/10"
                                  : "border-gray-700 hover:border-gray-600"
                              }`}
                            >
                              <span
                                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-sm font-medium ${
                                  quizAnswer === i
                                    ? "border-primary-500 bg-primary-500 text-white"
                                    : "border-gray-500 text-gray-400"
                                }`}
                              >
                                {String.fromCharCode(65 + i)}
                              </span>
                              <span className="text-gray-300">{option}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <Button
                        onClick={() => setQuizSubmitted(true)}
                        disabled={quizAnswer === null}
                        className="w-full bg-success-600 hover:bg-success-700"
                      >
                        Submit Answer
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-6">
                      <div
                        className={`flex items-start gap-4 rounded-lg border p-4 ${
                          quizAnswer === content.quiz.correctIndex
                            ? "border-success-500/50 bg-success-500/10"
                            : "border-danger-500/50 bg-danger-500/10"
                        }`}
                      >
                        {quizAnswer === content.quiz.correctIndex ? (
                          <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-success-400" />
                        ) : (
                          <AlertTriangle className="h-6 w-6 flex-shrink-0 text-danger-400" />
                        )}
                        <div>
                          <p
                            className={`font-semibold ${
                              quizAnswer === content.quiz.correctIndex
                                ? "text-success-300"
                                : "text-danger-300"
                            }`}
                          >
                            {quizAnswer === content.quiz.correctIndex
                              ? "Correct!"
                              : "Not quite right"}
                          </p>
                          <p className="mt-1 text-gray-300">
                            {content.quiz.explanation}
                          </p>
                        </div>
                      </div>

                      {quizAnswer === content.quiz.correctIndex ? (
                        <div className="flex gap-4">
                          <Button
                            onClick={handleComplete}
                            disabled={completing}
                            className="flex-1 bg-success-600 hover:bg-success-700"
                          >
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
                                className="w-full border-gray-600 text-gray-300"
                              >
                                Skip Quiz
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
                          className="w-full bg-primary-600 hover:bg-primary-700"
                        >
                          Try Again
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {!isQuizSection && (
                <div className="mt-6 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentSection(Math.max(0, currentSection - 1))
                    }
                    disabled={currentSection === 0}
                    className="border-gray-600 text-gray-300"
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Previous
                  </Button>
                  {currentSection < SECTIONS.length - 2 ? (
                    <Button
                      onClick={() => setCurrentSection(currentSection + 1)}
                      className="bg-primary-600 hover:bg-primary-700"
                    >
                      Next
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentSection(currentSection + 1)}
                      className="bg-success-600 hover:bg-success-700"
                    >
                      Quiz
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-gray-700 py-4 text-center text-xs text-gray-500">
        University of Arkansas - CSCE Capstone 2025
      </footer>
    </div>
  );
}
