"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Shield, ArrowRight, Mail, Loader2 } from "lucide-react";

interface RedFlagData {
  subject: string;
  sender: string;
  redFlags: string[];
}

export default function CaughtPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RedFlagData | null>(null);

  useEffect(() => {
    async function fetchRedFlags() {
      try {
        if (token) {
          const res = await fetch(`/api/training/caught-data?token=${token}`);
          if (res.ok) {
            const json = await res.json();
            setData(json);
          }
        }
      } catch (error) {
        console.error("Failed to fetch caught data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRedFlags();
  }, [token]);

  const redFlags = data?.redFlags || [
    "The email asks you to click a link to log in or reset your password.",
    "The sender's address looks slightly off or unfamiliar.",
    "The message does not use your name.",
    "The link leads to a page that looks real but has a strange web address.",
    "The email creates panic or demands immediate action.",
  ];

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

      <main className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-2xl space-y-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger-500/20">
              <AlertTriangle className="h-8 w-8 text-danger-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-200">
              You clicked a simulated phishing link
            </h1>
            <p className="mt-3 text-lg text-gray-400">
              Don&apos;t worry — this was a training exercise to help you
              recognize real threats.
            </p>
          </div>

          <Card className="border-gray-700 bg-phish-blue/30">
            <CardHeader>
              <CardTitle className="text-gray-200 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                What You Clicked
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : data ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Subject:</span>
                      <span className="text-gray-200">{data.subject}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">From:</span>
                      <span className="text-gray-200">{data.sender}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-sm font-medium uppercase tracking-wider text-gray-400 mb-3">
                      Red Flags You Missed
                    </h3>
                    <ul className="space-y-3">
                      {redFlags.map((flag, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-danger-500/20 text-danger-400 text-sm">
                            {i + 1}
                          </span>
                          <span className="text-gray-300">{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Subject:</span>
                      <span className="text-gray-200">Unusual Sign-In Attempt Detected</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">From:</span>
                      <span className="text-gray-200">security@amaz0n-verify.com</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-sm font-medium uppercase tracking-wider text-gray-400 mb-3">
                      Red Flags You Missed
                    </h3>
                    <ul className="space-y-3">
                      {redFlags.slice(0, 4).map((flag, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-danger-500/20 text-danger-400 text-sm">
                            {i + 1}
                          </span>
                          <span className="text-gray-300">{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-gray-700 bg-phish-blue/30">
            <CardHeader>
              <CardTitle className="text-gray-200">Why This Matters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-300">
              <p>
                Phishing emails are one of the most common ways attackers try to
                steal your credentials. By learning to recognize these warning
                signs, you can protect yourself and your organization.
              </p>
              <p>
                Complete the training module to learn how to identify and avoid
                these attacks in the future.
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Link
              href={`/training/module-3-account-password-traps?token=${token || "direct"}`}
            >
              <Button
                size="lg"
                className="bg-success-600 hover:bg-success-700 text-lg px-8 py-6"
              >
                Start Training
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <p className="text-center text-sm text-gray-500">
            You can always return to your dashboard if you need a break.
            <Link
              href="/dashboard/user"
              className="ml-1 text-primary-400 hover:underline"
            >
              Go to Dashboard
            </Link>
          </p>
        </div>
      </main>

      <footer className="border-t border-gray-700 py-4 text-center text-xs text-gray-500">
        University of Arkansas - CSCE Capstone 2025
      </footer>
    </div>
  );
}
