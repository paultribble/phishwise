"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { AmbientBackground } from "@/components/landing/AmbientBackground";

function MagicSigninContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    signIn("credentials", { magicToken: token, redirect: false }).then((result) => {
      if (result?.ok) {
        setStatus("success");
        setTimeout(() => { window.location.href = "/dashboard"; }, 1500);
      } else {
        setStatus("error");
      }
    });
  }, [token]);

  return (
    <div className="w-full max-w-md">
      <div className="relative rounded-xl border border-white/[0.06] bg-[#1a1a2e]/80 backdrop-blur-sm p-10 text-center">
        <div
          className="absolute top-0 left-6 right-6 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(37,99,235,0.6) 50%, transparent)",
          }}
        />

        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="w-10 h-10 text-blue-400 mx-auto animate-spin" />
            <p className="text-white font-semibold">Signing you in…</p>
            <p className="text-sm text-slate-400">Verifying your link, please wait.</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <p className="text-white font-semibold">Signed in!</p>
            <p className="text-sm text-slate-400">Redirecting you to your dashboard…</p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <XCircle className="w-10 h-10 text-red-400 mx-auto" />
            <p className="text-white font-semibold">Link expired or already used</p>
            <p className="text-sm text-slate-400">
              This sign-in link is no longer valid. Links expire after 30 minutes and
              can only be used once.
            </p>
            <Link
              href="/login"
              className="inline-block mt-2 px-6 py-2.5 bg-blue-700 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg
                transition-all duration-150 shadow-[0_0_20px_rgba(37,99,235,0.35)]"
            >
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MagicSigninPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#0f0f1a] text-white overflow-hidden">
      <AmbientBackground variant="subtle" />

      <header className="relative z-10 border-b border-white/[0.06] bg-black/20 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.jpg" alt="PhishWise" width={36} height={36} className="h-9 w-auto" />
            <span className="text-lg font-bold text-gray-200">PhishWise</span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-16">
        <Suspense fallback={null}>
          <MagicSigninContent />
        </Suspense>
      </main>

      <footer className="relative z-10 border-t border-white/[0.06] py-6 text-center text-slate-600 text-sm">
        © 2025 PhishWise · University of Arkansas CSCE Capstone · Team 20
      </footer>
    </div>
  );
}
