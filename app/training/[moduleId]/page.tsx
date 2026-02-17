"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Shield,
} from "lucide-react";
import { useState } from "react";

// Placeholder training content — will be loaded from DB / MDX
const mockModule = {
  name: "Recognizing Urgent Account Verification Scams",
  description:
    "Learn to identify phishing emails that create a false sense of urgency about your account status.",
  sections: [
    {
      title: "Overview",
      content:
        'Phishing emails frequently use urgent language like "Verify your account immediately" or "Your account will be suspended" to pressure you into clicking malicious links. These emails often impersonate trusted services like banks, email providers, or social media platforms.',
    },
    {
      title: "Red Flags to Watch For",
      content:
        '• Generic greetings ("Dear Customer" instead of your name)\n• Urgent or threatening language\n• Mismatched sender email addresses\n• Suspicious links (hover to check the URL)\n• Requests for personal information\n• Poor grammar or spelling\n• Unexpected attachments',
    },
    {
      title: "Real-World Examples",
      content:
        'Example 1: "Your PayPal account has been limited. Click here to restore access."\n→ The link goes to paypa1-secure.com (note the number 1 instead of letter l)\n\nExample 2: "Microsoft: Unusual sign-in activity detected. Verify your identity now."\n→ Sent from microsoft-security@outlook-verify.net (not a real Microsoft domain)',
    },
    {
      title: "Prevention Steps",
      content:
        "1. Never click links in unexpected emails — go directly to the website\n2. Check the sender's email address carefully\n3. Hover over links before clicking to preview the URL\n4. Enable two-factor authentication on important accounts\n5. When in doubt, contact the company directly through their official website\n6. Report suspicious emails to your IT department or email provider",
    },
  ],
};

const mockQuiz = [
  {
    question:
      'You receive an email from "support@amaz0n-security.com" saying your account is locked. What should you do?',
    options: [
      "Click the link to unlock your account",
      "Reply with your password to verify your identity",
      "Go directly to amazon.com and check your account",
      "Forward the email to your friends as a warning",
    ],
    correct: 2,
  },
  {
    question: "Which of these is a red flag in a phishing email?",
    options: [
      "The email is addressed to you by name",
      'The sender\'s domain is "company-security-verify.com"',
      "The email has a professional logo",
      "The email was sent during business hours",
    ],
    correct: 1,
  },
];

export default function TrainingModulePage() {
  const searchParams = useSearchParams();
  const fromSimulation = searchParams.get("from") === "simulation";
  const [currentSection, setCurrentSection] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>(
    mockQuiz.map(() => null)
  );
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const progress = quizStarted
    ? 100
    : Math.round(((currentSection + 1) / mockModule.sections.length) * 80);

  const score = quizSubmitted
    ? mockQuiz.reduce(
        (acc, q, i) => acc + (quizAnswers[i] === q.correct ? 1 : 0),
        0
      )
    : 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
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

      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Failure Banner */}
          {fromSimulation && (
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
                  module to learn how to spot similar attacks in the future.
                </p>
              </div>
            </div>
          )}

          {/* Module Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-200">
              {mockModule.name}
            </h1>
            <p className="mt-2 text-gray-400">{mockModule.description}</p>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Module Progress</span>
              <span className="font-medium text-gray-200">{progress}%</span>
            </div>
            <Progress value={progress} className="bg-gray-700" />
          </div>

          {/* Section Navigation */}
          <div className="flex flex-wrap gap-2">
            {mockModule.sections.map((section, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentSection(i);
                  setQuizStarted(false);
                }}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  !quizStarted && currentSection === i
                    ? "bg-primary-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                }`}
              >
                {section.title}
              </button>
            ))}
            <button
              onClick={() => setQuizStarted(true)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                quizStarted
                  ? "bg-primary-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
              }`}
            >
              Quiz
            </button>
          </div>

          {/* Content Area */}
          {!quizStarted ? (
            <Card className="border-gray-700 bg-phish-blue/30">
              <CardHeader>
                <CardTitle className="text-gray-200">
                  {mockModule.sections[currentSection].title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-line text-gray-300 leading-relaxed">
                  {mockModule.sections[currentSection].content}
                </div>
                <div className="mt-6 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentSection(Math.max(0, currentSection - 1))
                    }
                    disabled={currentSection === 0}
                    className="border-gray-600 text-gray-300"
                  >
                    Previous
                  </Button>
                  {currentSection < mockModule.sections.length - 1 ? (
                    <Button
                      onClick={() => setCurrentSection(currentSection + 1)}
                      className="bg-primary-600 hover:bg-primary-700"
                    >
                      Next <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setQuizStarted(true)}
                      className="bg-success-600 hover:bg-success-700"
                    >
                      Take Quiz <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {quizSubmitted ? (
                <Card className="border-gray-700 bg-phish-blue/30">
                  <CardContent className="flex flex-col items-center gap-4 py-8">
                    <CheckCircle2 className="h-12 w-12 text-success-400" />
                    <h2 className="text-2xl font-bold text-gray-200">
                      Module Complete!
                    </h2>
                    <p className="text-gray-400">
                      You scored {score}/{mockQuiz.length}
                    </p>
                    <Badge
                      variant={
                        score === mockQuiz.length ? "success" : "warning"
                      }
                      className="text-base px-4 py-1"
                    >
                      {score === mockQuiz.length
                        ? "Perfect Score!"
                        : "Keep Practicing"}
                    </Badge>
                    <Link href="/dashboard/user">
                      <Button className="mt-4 bg-primary-600 hover:bg-primary-700">
                        Return to Dashboard
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {mockQuiz.map((q, qi) => (
                    <Card key={qi} className="border-gray-700 bg-phish-blue/30">
                      <CardHeader>
                        <CardTitle className="text-lg text-gray-200">
                          Question {qi + 1}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-gray-300">{q.question}</p>
                        <div className="space-y-2">
                          {q.options.map((option, oi) => (
                            <label
                              key={oi}
                              className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors ${
                                quizAnswers[qi] === oi
                                  ? "border-primary-500 bg-primary-500/10"
                                  : "border-gray-700 hover:border-gray-600"
                              }`}
                            >
                              <input
                                type="radio"
                                name={`q${qi}`}
                                className="sr-only"
                                checked={quizAnswers[qi] === oi}
                                onChange={() => {
                                  const newAnswers = [...quizAnswers];
                                  newAnswers[qi] = oi;
                                  setQuizAnswers(newAnswers);
                                }}
                              />
                              <div
                                className={`h-4 w-4 rounded-full border-2 ${
                                  quizAnswers[qi] === oi
                                    ? "border-primary-500 bg-primary-500"
                                    : "border-gray-500"
                                }`}
                              />
                              <span className="text-sm text-gray-300">
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    onClick={() => setQuizSubmitted(true)}
                    disabled={quizAnswers.some((a) => a === null)}
                    className="w-full bg-success-600 hover:bg-success-700"
                  >
                    Submit Quiz
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-gray-700 py-4 text-center text-xs text-gray-500">
        University of Arkansas - CSCE Capstone 2025
      </footer>
    </div>
  );
}
