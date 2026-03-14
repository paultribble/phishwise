"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { AmbientBackground } from "@/components/landing/AmbientBackground";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      });
      if (!res.ok) {
        const { error: e } = await res.json();
        setError(e || "Something went wrong.");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full max-w-md transition-all duration-700"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(24px)",
      }}
    >
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-[0.18em] font-semibold text-blue-400 mb-3">
          Account Recovery
        </p>
        <h1 className="text-4xl font-bold text-white mb-3">Set New Password</h1>
        <p className="text-sm text-slate-400">
          Choose a strong password for your PhishWise account
        </p>
      </div>

      <div className="relative rounded-xl border border-white/[0.06] hover:border-blue-600/30 bg-[#1a1a2e]/80 backdrop-blur-sm p-8 transition-colors duration-300">
        <div
          className="absolute top-0 left-6 right-6 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(37,99,235,0.6) 50%, transparent)",
          }}
        />

        {success ? (
          <div className="text-center py-4 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <p className="text-white font-semibold">Password updated!</p>
            <p className="text-sm text-slate-400">
              Redirecting you to the login page…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {!token && (
              <div className="p-3 bg-red-950/40 border border-red-700/50 rounded-lg text-sm text-red-300">
                Invalid or missing reset link. Please request a new one.
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                New Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-[#252540] border border-white/10 rounded-lg text-gray-200 placeholder-slate-500 text-sm
                  focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/50
                  transition-colors duration-200 disabled:opacity-50"
                disabled={loading || !token}
              />
              {errors.password && (
                <p className="text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-[#252540] border border-white/10 rounded-lg text-gray-200 placeholder-slate-500 text-sm
                  focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/50
                  transition-colors duration-200 disabled:opacity-50"
                disabled={loading || !token}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-700/50 rounded-lg text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full px-6 py-2.5 bg-blue-700 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg
                transition-all duration-150 cursor-pointer
                shadow-[0_0_20px_rgba(37,99,235,0.35)] hover:shadow-[0_0_28px_rgba(37,99,235,0.55)]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading ? "Updating…" : "Update Password"}
            </button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-white/[0.06] text-center">
          <Link href="/login" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            ← Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
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
          <ResetPasswordForm />
        </Suspense>
      </main>

      <footer className="relative z-10 border-t border-white/[0.06] py-6 text-center text-slate-600 text-sm">
        © 2025 PhishWise · University of Arkansas CSCE Capstone · Team 20
      </footer>
    </div>
  );
}
