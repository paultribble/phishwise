"use client";

import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Shield,
  AlertOctagon,
  Target,
  BookOpen,
  Users,
  ShieldCheck,
  Lightbulb,
  HelpCircle,
  Zap,
  Award,
  Flame,
  Mail,
  Sparkles,
  ArrowRight,
  Lock,
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
  { id: "examples", title: "Examples", icon: Mail },
  { id: "prevention", title: "Prevention", icon: ShieldCheck },
  { id: "quiz", title: "Quiz", icon: HelpCircle },
];

const THREAT_COLORS: Record<string, { primary: string; dim: string }> = {
  fear: { primary: "#ef4444", dim: "#450a0a" },
  urgency: { primary: "#f59e0b", dim: "#451a03" },
  authority: { primary: "#2563eb", dim: "#1e3a8a" },
  loss: { primary: "#7c3aed", dim: "#4c1d95" },
  convenience: { primary: "#0891b2", dim: "#164e63" },
};

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
  const [userStatus, setUserStatus] = useState<{ completed: boolean } | null>(null);
  const [isRequired, setIsRequired] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [revealedFlags, setRevealedFlags] = useState<Set<number>>(new Set());

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

  const toggleFlagReveal = (index: number) => {
    const newRevealed = new Set(revealedFlags);
    if (newRevealed.has(index)) {
      newRevealed.delete(index);
    } else {
      newRevealed.add(index);
    }
    setRevealedFlags(newRevealed);
  };

  const isQuizSection = currentSection === 6;
  const progress = isQuizSection
    ? 100
    : Math.round(((currentSection + 1) / SECTIONS.length) * 85);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-base)" }}>
        <div className="flex-1 flex items-center justify-center">
          <div className="space-y-8 w-96">
            <div className="animate-pulse space-y-4">
              <div className="h-8 rounded-lg w-3/4" style={{ backgroundColor: "var(--bg-surface)" }}></div>
              <div className="h-4 rounded-lg w-1/2" style={{ backgroundColor: "var(--bg-surface)" }}></div>
              <div className="h-64 rounded-lg" style={{ backgroundColor: "var(--bg-elevated)" }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-base)" }}>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-md w-full rounded-xl border p-8 text-center" style={{ borderColor: "var(--threat-red)", backgroundColor: "rgba(239,68,68,0.06)" }}>
            <div className="rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(239,68,68,0.1)" }}>
              <AlertTriangle className="w-8 h-8" style={{ color: "var(--threat-red)" }} />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              {error || "Module not found"}
            </h2>
            <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
              {error === "Module not found"
                ? "The training module you&apos;re looking for doesn&apos;t exist or has been removed."
                : "There was a problem loading the training module. Please try again."}
            </p>
            <Link href="/dashboard/user">
              <Button className="w-full" style={{ background: "linear-gradient(135deg, #2563eb, #0e7490)" }}>
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const content = module.content;
  const currentSectionDef = SECTIONS[currentSection];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-base)" }}>
      {/* Navbar */}
      <header
        className="sticky top-0 z-100 border-b"
        style={{ backgroundColor: "rgba(12, 18, 32, 0.85)", borderColor: "var(--border-subtle)", backdropFilter: "blur(16px)" }}
      >
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: "rgba(34, 211, 238, 0.1)" }}>
              <Shield className="h-5 w-5" style={{ color: "var(--accent-primary)" }} />
            </div>
            <span className="text-lg font-bold" style={{ background: "linear-gradient(135deg, #f1f5f9, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              PhishWise
            </span>
          </Link>
          <Link href="/dashboard/user" className="text-sm flex items-center gap-2 group transition-colors hover:text-blue-300" style={{ color: "var(--text-secondary)" }}>
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Phishing Click Alert */}
      {token && (
        <div className="mx-auto max-w-6xl w-full px-6 pt-6">
          <div
            className="flex items-start gap-3 rounded-xl border p-4"
            style={{ backgroundColor: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.3)" }}
          >
            <Flame className="h-5 w-5 flex-shrink-0 mt-0.5 animate-pulse" style={{ color: "var(--threat-red)" }} />
            <div>
              <h2 className="font-bold" style={{ color: "var(--threat-red)" }}>
                You clicked a simulated phishing link
              </h2>
              <p className="text-sm mt-1" style={{ color: "rgba(239,68,68,0.8)" }}>
                Don&apos;t worry — this was a training exercise. Complete this module to learn how to spot similar attacks in the future.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Page Header */}
          <div className="space-y-4 animate-fade-in">
            <h1
              className="text-4xl font-bold"
              style={{
                background: "linear-gradient(135deg, #f1f5f9 0%, #22d3ee 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {module.name}
            </h1>
            <div className="flex items-center gap-3" style={{ borderLeft: "3px solid var(--accent-primary)", paddingLeft: "12px" }}>
              <p style={{ color: "var(--text-secondary)" }}>{module.description}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div
            className="rounded-lg border p-5 flex items-center gap-4"
            style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}
          >
            <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }} className="uppercase tracking-wider whitespace-nowrap">
              Progress
            </span>
            <div className="flex-1 relative h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-base)", border: "1px solid var(--border-subtle)" }}>
              <div
                className="h-full rounded-full transition-all duration-600"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #2563eb, #22d3ee)",
                  boxShadow: "0 0 12px rgba(34, 211, 238, 0.4)",
                }}
              ></div>
            </div>
            <span style={{ color: "var(--accent-primary)", fontFamily: "var(--font-mono)", fontSize: "0.875rem", fontWeight: "500", whiteSpace: "nowrap" }}>
              {progress}%
            </span>
          </div>

          {/* Section Tabs */}
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
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap border transition-all duration-300 hover:scale-105"
                  style={{
                    ...(isActive
                      ? {
                          background: "linear-gradient(135deg, #1e40af, #0e7490)",
                          color: "white",
                          borderColor: "var(--accent-primary-dim)",
                          boxShadow: "0 0 16px rgba(34, 211, 238, 0.2)",
                        }
                      : isCompleted
                        ? {
                            background: "linear-gradient(135deg, rgba(16,185,129,0.3), rgba(16,185,129,0.2))",
                            color: "var(--text-secondary)",
                            borderColor: "rgba(16,185,129,0.4)",
                          }
                        : {
                            background: "var(--bg-surface)",
                            color: "var(--text-muted)",
                            borderColor: "var(--border-subtle)",
                          }),
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {section.title}
                  {isCompleted && <CheckCircle2 className="h-4 w-4 ml-1 animate-pulse" style={{ color: "var(--success)" }} />}
                </button>
              );
            })}
          </div>

          {/* Content Card */}
          <div
            className="rounded-xl border overflow-hidden"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-subtle)",
              position: "relative",
            }}
          >
            {/* Top accent line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "1px",
                background: "linear-gradient(90deg, transparent, var(--accent-primary), transparent)",
                opacity: 0.4,
              }}
            ></div>

            <div className="p-8 space-y-6">
              {/* Section Header */}
              <div className="flex items-center gap-3 pb-6 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                <div
                  className="w-10 h-10 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: "var(--accent-glow)", color: "var(--accent-primary)", border: "1px solid var(--accent-primary-dim)" }}
                >
                  <currentSectionDef.icon className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {currentSectionDef.title}
                </h2>
              </div>

              {/* Content Sections */}
              {currentSection === 0 && (
                <div className="space-y-6">
                  <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", whiteSpace: "pre-line" }}>
                    {content.overview}
                  </p>
                  <div
                    className="flex gap-3 rounded-lg border p-4"
                    style={{ backgroundColor: "rgba(34, 211, 238, 0.06)", borderColor: "rgba(34, 211, 238, 0.3)" }}
                  >
                    <Lightbulb className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: "var(--accent-primary)" }} />
                    <p style={{ color: "rgba(34, 211, 238, 0.8)", fontSize: "0.875rem" }}>
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
                      className="group relative rounded-lg border p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        borderColor: "var(--border-subtle)",
                        borderLeft: `3px solid ${Object.values(THREAT_COLORS)[i % 5].primary}`,
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget;
                        el.style.borderColor = Object.values(THREAT_COLORS)[i % 5].primary;
                        el.style.boxShadow = `0 8px 24px rgba(0,0,0,0.3), 0 0 0 1px ${Object.values(THREAT_COLORS)[i % 5].dim}`;
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget;
                        el.style.borderColor = "var(--border-subtle)";
                        el.style.boxShadow = "none";
                      }}
                    >
                      <h3 className="font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                        {tactic.name}
                      </h3>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: "1.5" }}>
                        {tactic.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {currentSection === 2 && (
                <div className="space-y-3">
                  <div
                    className="flex items-start gap-3 p-4 rounded-lg border mb-6"
                    style={{ backgroundColor: "rgba(245, 158, 11, 0.06)", borderColor: "rgba(245, 158, 11, 0.3)" }}
                  >
                    <Flame className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: "var(--threat-amber)" }} />
                    <p style={{ color: "rgba(245, 158, 11, 0.8)", fontSize: "0.875rem" }}>
                      Click on any red flag to learn more details about why it&apos;s suspicious.
                    </p>
                  </div>
                  {content.redFlags.map((flag, i) => (
                    <div
                      key={i}
                      onClick={() => toggleFlagReveal(i)}
                      className="group cursor-pointer rounded-lg border overflow-hidden transition-all duration-300 hover:translate-x-1"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        borderColor: revealedFlags.has(i) ? "var(--threat-red)" : "var(--border-subtle)",
                        boxShadow: revealedFlags.has(i) ? `0 0 0 1px rgba(239,68,68,0.2)` : "none",
                      }}
                    >
                      <div className="flex items-center gap-3 p-4">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{
                            background: "var(--threat-red)",
                            boxShadow: "0 0 6px var(--threat-red)",
                            animation: "pulse-red 2s ease-in-out infinite",
                          }}
                        ></div>
                        <div className="flex-1">
                          <p style={{ color: "var(--text-primary)", fontWeight: "500" }}>{flag}</p>
                          {revealedFlags.has(i) && (
                            <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--border-subtle)" }}>
                              <p style={{ color: "rgba(239,68,68,0.8)", fontSize: "0.875rem", fontWeight: "600", marginBottom: "6px" }}>
                                Why this is suspicious:
                              </p>
                              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: "1.6" }}>
                                Attackers use {flag.toLowerCase()} to deceive and manipulate recipients. This is a common red flag in phishing attacks.
                              </p>
                            </div>
                          )}
                          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "6px" }}>
                            {revealedFlags.has(i) ? "Click to hide" : "Click to reveal why"}
                          </p>
                        </div>
                        <ChevronRight
                          className="h-4 w-4 transition-transform duration-300"
                          style={{
                            color: "var(--threat-red)",
                            transform: revealedFlags.has(i) ? "rotate(90deg)" : "rotate(0deg)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentSection === 3 && (
                <div className="space-y-4">
                  <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", whiteSpace: "pre-line" }}>
                    {content.objective}
                  </p>
                  <div
                    className="flex gap-3 rounded-lg border p-4"
                    style={{ backgroundColor: "rgba(34, 211, 238, 0.06)", borderColor: "rgba(34, 211, 238, 0.3)" }}
                  >
                    <Target className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: "var(--accent-primary)" }} />
                    <p style={{ color: "rgba(34, 211, 238, 0.8)", fontSize: "0.875rem" }}>
                      Understanding the attacker&apos;s objective helps you recognize phishing attempts.
                    </p>
                  </div>
                </div>
              )}

              {currentSection === 4 && (
                <div className="space-y-6">
                  {content.examples.map((example, i) => (
                    <div
                      key={i}
                      className="space-y-4 rounded-xl border overflow-hidden"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        borderColor: "var(--border-subtle)",
                      }}
                    >
                      <div className="flex items-center justify-between gap-4 p-6 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", color: "var(--threat-amber)" }}
                          >
                            <Mail className="h-5 w-5" />
                          </div>
                          <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>
                            {example.title}
                          </h3>
                        </div>
                        <Badge style={{ backgroundColor: "rgba(245, 158, 11, 0.2)", color: "var(--threat-amber)", border: "none", fontSize: "0.75rem" }}>
                          Example {i + 1}
                        </Badge>
                      </div>

                      <div
                        className="p-6 font-mono text-sm overflow-x-auto"
                        style={{ backgroundColor: "var(--bg-base)", color: "var(--text-secondary)" }}
                      >
                        <p style={{ whiteSpace: "pre-wrap" }}>{example.body}</p>
                      </div>

                      <div className="p-6 pt-0 space-y-4">
                        <p style={{ color: "var(--threat-amber)", fontSize: "0.875rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                          <AlertTriangle className="h-4 w-4" />
                          Suspicious Elements Found:
                        </p>
                        <div className="grid gap-3">
                          {example.redFlags.map((flag, j) => (
                            <div
                              key={j}
                              className="flex items-start gap-3 p-3 rounded-lg"
                              style={{
                                backgroundColor: "rgba(245, 158, 11, 0.08)",
                                border: "1px solid rgba(245, 158, 11, 0.3)",
                              }}
                            >
                              <Flame className="h-4 w-4 mt-0.5 flex-shrink-0 animate-pulse" style={{ color: "var(--threat-amber)" }} />
                              <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{flag}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentSection === 5 && (
                <div className="space-y-4">
                  {content.preventionSteps.map((step, i) => (
                    <div
                      key={i}
                      className="group relative flex gap-5 items-start p-5 rounded-xl border transition-all duration-300 hover:translate-x-1"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        borderColor: "var(--border-subtle)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.5)";
                        e.currentTarget.style.backgroundColor = "rgba(16, 185, 129, 0.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border-subtle)";
                        e.currentTarget.style.backgroundColor = "var(--bg-elevated)";
                      }}
                    >
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-bold text-sm transition-all duration-300 hover:scale-110 group-hover:shadow-lg"
                        style={{
                          background: "linear-gradient(135deg, #059669, #10b981)",
                          color: "white",
                          boxShadow: "0 0 12px rgba(16, 185, 129, 0.2)",
                        }}
                      >
                        {i + 1}
                      </div>
                      <span style={{ color: "var(--text-secondary)", paddingTop: "8px", lineHeight: "1.6", fontWeight: "500" }}>
                        {step}
                      </span>
                      <ChevronRight
                        className="h-5 w-5 mt-2 ml-auto flex-shrink-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        style={{ color: "var(--success)" }}
                      />
                    </div>
                  ))}

                  <div
                    className="rounded-xl border p-6 flex gap-4 mt-8"
                    style={{
                      backgroundColor: "rgba(16, 185, 129, 0.08)",
                      borderColor: "rgba(16, 185, 129, 0.4)",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(16, 185, 129, 0.3)", color: "var(--success)" }}
                    >
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <p style={{ color: "var(--success)", fontWeight: "600", marginBottom: "4px" }}>
                        Master these prevention steps!
                      </p>
                      <p style={{ color: "rgba(16, 185, 129, 0.8)", fontSize: "0.875rem" }}>
                        Following these prevention strategies will significantly reduce your risk of falling victim to phishing attacks. Remember these steps every time you receive an unexpected email.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {currentSection === 6 && (
                <div className="space-y-6">
                  {!quizSubmitted ? (
                    <>
                      <div
                        className="p-5 rounded-lg border"
                        style={{
                          backgroundColor: "var(--bg-elevated)",
                          borderColor: "var(--border-subtle)",
                          borderLeft: "3px solid var(--accent-primary)",
                        }}
                      >
                        <p style={{ color: "var(--text-primary)", fontSize: "1.125rem", fontWeight: "600", lineHeight: "1.6" }}>
                          {content.quiz.question}
                        </p>
                      </div>

                      <div className="space-y-3">
                        {content.quiz.options.map((option, i) => (
                          <div
                            key={i}
                            onClick={() => setQuizAnswer(i)}
                            className="flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all duration-200"
                            style={{
                              backgroundColor:
                                quizAnswer === i ? "rgba(34, 211, 238, 0.06)" : "var(--bg-elevated)",
                              borderColor:
                                quizAnswer === i ? "var(--accent-primary)" : "var(--border-default)",
                              boxShadow:
                                quizAnswer === i ? "0 0 0 1px var(--accent-primary-dim)" : "none",
                              transform: "translateX(0)",
                            }}
                            onMouseEnter={(e) => {
                              if (quizAnswer !== i) {
                                e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                                e.currentTarget.style.borderColor = "var(--accent-primary-dim)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (quizAnswer !== i) {
                                e.currentTarget.style.backgroundColor = "var(--bg-elevated)";
                                e.currentTarget.style.borderColor = "var(--border-default)";
                              }
                            }}
                          >
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 transition-all duration-200"
                              style={{
                                backgroundColor:
                                  quizAnswer === i ? "var(--accent-primary)" : "var(--bg-base)",
                                borderColor:
                                  quizAnswer === i ? "var(--accent-primary)" : "var(--border-default)",
                                border: "1px solid",
                                color:
                                  quizAnswer === i
                                    ? "#060a10"
                                    : "var(--text-muted)",
                              }}
                            >
                              {String.fromCharCode(65 + i)}
                            </div>
                            <span style={{ color: "var(--text-secondary)" }}>{option}</span>
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={() => setQuizSubmitted(true)}
                        disabled={quizAnswer === null}
                        style={{
                          width: "100%",
                          background:
                            quizAnswer === null
                              ? "rgba(16, 185, 129, 0.5)"
                              : "linear-gradient(135deg, #059669, #10b981)",
                          color: "white",
                          padding: "16px",
                          fontSize: "1rem",
                          fontWeight: "700",
                          letterSpacing: "0.02em",
                          cursor: quizAnswer === null ? "not-allowed" : "pointer",
                          opacity: quizAnswer === null ? 0.4 : 1,
                          boxShadow:
                            quizAnswer === null
                              ? "none"
                              : "0 4px 14px rgba(16, 185, 129, 0.25)",
                          transition: "all 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                        onMouseEnter={(e) => {
                          if (quizAnswer !== null) {
                            (e.target as HTMLElement).style.transform = "translateY(-1px)";
                            (e.target as HTMLElement).style.boxShadow =
                              "0 6px 20px rgba(16, 185, 129, 0.35)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.transform = "translateY(0)";
                          (e.target as HTMLElement).style.boxShadow =
                            "0 4px 14px rgba(16, 185, 129, 0.25)";
                        }}
                      >
                        <CheckCircle2 className="h-5 w-5" />
                        Submit Answer
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-6">
                      <div
                        className="flex items-start gap-4 rounded-lg border p-6"
                        style={{
                          backgroundColor:
                            quizAnswer === content.quiz.correctIndex
                              ? "rgba(16, 185, 129, 0.08)"
                              : "rgba(239, 68, 68, 0.06)",
                          borderColor:
                            quizAnswer === content.quiz.correctIndex
                              ? "rgba(16, 185, 129, 0.5)"
                              : "rgba(239, 68, 68, 0.3)",
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor:
                              quizAnswer === content.quiz.correctIndex
                                ? "rgba(16, 185, 129, 0.2)"
                                : "rgba(239, 68, 68, 0.2)",
                          }}
                        >
                          {quizAnswer === content.quiz.correctIndex ? (
                            <CheckCircle2 className="h-6 w-6" style={{ color: "var(--success)" }} />
                          ) : (
                            <AlertTriangle className="h-6 w-6" style={{ color: "var(--threat-red)" }} />
                          )}
                        </div>
                        <div>
                          <p
                            style={{
                              fontSize: "1.125rem",
                              fontWeight: "700",
                              marginBottom: "8px",
                              color:
                                quizAnswer === content.quiz.correctIndex
                                  ? "var(--success)"
                                  : "var(--threat-red)",
                            }}
                          >
                            {quizAnswer === content.quiz.correctIndex
                              ? "🎉 Correct!"
                              : "Not quite right"}
                          </p>
                          <p style={{ color: "var(--text-secondary)", marginTop: "8px", lineHeight: "1.6" }}>
                            {content.quiz.explanation}
                          </p>
                        </div>
                      </div>

                      {quizAnswer === content.quiz.correctIndex ? (
                        <div className="space-y-4">
                          <div
                            className="flex items-center gap-2 p-4 rounded-lg border animate-pulse"
                            style={{
                              backgroundColor: "rgba(16, 185, 129, 0.1)",
                              borderColor: "rgba(16, 185, 129, 0.3)",
                            }}
                          >
                            <Sparkles className="h-5 w-5" style={{ color: "var(--success)" }} />
                            <p style={{ color: "rgba(16, 185, 129, 0.8)", fontSize: "0.875rem", fontWeight: "600" }}>
                              Excellent work! You&apos;re learning to spot phishing attacks!
                            </p>
                          </div>
                          <div className="flex gap-4">
                            <Button
                              onClick={handleComplete}
                              disabled={completing}
                              style={{
                                flex: 1,
                                background: "linear-gradient(135deg, #059669, #10b981)",
                                color: "white",
                                padding: "16px",
                                fontSize: "1rem",
                                fontWeight: "700",
                                cursor: completing ? "not-allowed" : "pointer",
                                opacity: completing ? 0.6 : 1,
                                transition: "all 0.2s ease",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                              }}
                              onMouseEnter={(e) => {
                                if (!completing) {
                                  (e.target as HTMLElement).style.transform =
                                    "translateY(-1px)";
                                  (e.target as HTMLElement).style.boxShadow =
                                    "0 6px 20px rgba(16, 185, 129, 0.35)";
                                }
                              }}
                              onMouseLeave={(e) => {
                                (e.target as HTMLElement).style.transform =
                                  "translateY(0)";
                                (e.target as HTMLElement).style.boxShadow =
                                  "0 4px 14px rgba(16, 185, 129, 0.25)";
                              }}
                            >
                              <Award className="h-5 w-5" />
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
                                  style={{
                                    width: "100%",
                                    borderColor: "var(--border-default)",
                                    color: "var(--text-secondary)",
                                  }}
                                >
                                  Skip
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      ) : (
                        <Button
                          onClick={() => {
                            setQuizAnswer(null);
                            setQuizSubmitted(false);
                          }}
                          style={{
                            width: "100%",
                            background: "linear-gradient(135deg, #2563eb, #0e7490)",
                            color: "white",
                            padding: "16px",
                            fontSize: "1rem",
                            fontWeight: "700",
                            transition: "all 0.2s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.transform = "translateY(-1px)";
                            (e.target as HTMLElement).style.boxShadow =
                              "0 6px 20px rgba(34, 211, 238, 0.25)";
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.transform = "translateY(0)";
                            (e.target as HTMLElement).style.boxShadow =
                              "0 4px 14px rgba(34, 211, 238, 0.15)";
                          }}
                        >
                          <Zap className="h-5 w-5" />
                          Try Again
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
              {!isQuizSection && (
                <div className="flex justify-between items-center gap-4 mt-8 pt-6 border-t" style={{ borderColor: "var(--border-subtle)" }}>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentSection(Math.max(0, currentSection - 1))
                    }
                    disabled={currentSection === 0}
                    style={{
                      borderColor: currentSection === 0 ? "rgba(148, 163, 184, 0.2)" : "var(--border-default)",
                      color: currentSection === 0 ? "rgba(148, 163, 184, 0.5)" : "var(--text-secondary)",
                      opacity: currentSection === 0 ? 0.5 : 1,
                      cursor: currentSection === 0 ? "not-allowed" : "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  {currentSection < SECTIONS.length - 2 ? (
                    <Button
                      onClick={() => setCurrentSection(currentSection + 1)}
                      style={{
                        background: "linear-gradient(135deg, #2563eb, #0e7490)",
                        color: "white",
                        fontWeight: "600",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.transform = "translateY(-1px)";
                        (e.target as HTMLElement).style.boxShadow =
                          "0 6px 20px rgba(34, 211, 238, 0.25)";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.transform = "translateY(0)";
                        (e.target as HTMLElement).style.boxShadow =
                          "0 4px 14px rgba(34, 211, 238, 0.15)";
                      }}
                    >
                      Next Section
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentSection(currentSection + 1)}
                      style={{
                        background: "linear-gradient(135deg, #059669, #10b981)",
                        color: "white",
                        fontWeight: "600",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.transform = "translateY(-1px)";
                        (e.target as HTMLElement).style.boxShadow =
                          "0 6px 20px rgba(16, 185, 129, 0.25)";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.transform = "translateY(0)";
                        (e.target as HTMLElement).style.boxShadow =
                          "0 4px 14px rgba(16, 185, 129, 0.15)";
                      }}
                    >
                      Take the Quiz
                      <Zap className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="border-t text-center text-xs py-6 mt-8"
        style={{ backgroundColor: "rgba(12, 18, 32, 0.5)", borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
      >
        <p>University of Arkansas - CSCE Capstone 2025 | PhishWise Training Platform</p>
      </footer>
    </div>
  );
}
