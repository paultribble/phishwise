"use client";

import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, CheckCircle2, Mail, KeyRound } from "lucide-react";
import { AmbientBackground } from "@/components/landing/AmbientBackground";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
type LoginFormData = z.infer<typeof loginSchema>;

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});
type EmailFormData = z.infer<typeof emailSchema>;

// ─── Inline modal ────────────────────────────────────────────────────────────
function Modal({
  title,
  description,
  onClose,
  children,
}: {
  title: string;
  description: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm rounded-xl border border-white/[0.08] bg-[#0d1929] p-6 shadow-2xl">
        <div
          className="absolute top-0 left-6 right-6 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(37,99,235,0.6) 50%, transparent)",
          }}
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
        <h2 className="text-lg font-bold text-white mb-1">{title}</h2>
        <p className="text-sm text-slate-400 mb-5">{description}</p>
        {children}
      </div>
    </div>
  );
}

// ─── Forgot-password modal ────────────────────────────────────────────────────
function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<"idle" | "loading" | "sent">("idle");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({ resolver: zodResolver(emailSchema) });

  const onSubmit = async (data: EmailFormData) => {
    setState("loading");
    setServerError("");
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      setState("sent");
    } catch {
      setServerError("Something went wrong. Please try again.");
      setState("idle");
    }
  };

  if (state === "sent") {
    return (
      <Modal
        title="Check your inbox"
        description=""
        onClose={onClose}
      >
        <div className="text-center py-2 space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <p className="text-sm text-slate-300">
            If an account exists for that email, a password reset link has been
            sent. Check your inbox (and spam folder).
          </p>
          <button
            onClick={onClose}
            className="mt-2 text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            Back to sign in
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title="Reset your password"
      description="Enter your email and we'll send you a link to set a new password."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="fp-email" className="block text-sm font-medium text-slate-300">
            Email address
          </label>
          <input
            id="fp-email"
            type="email"
            {...register("email")}
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 bg-[#252540] border border-white/10 rounded-lg text-gray-200 placeholder-slate-500 text-sm
              focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/50
              transition-colors duration-200 disabled:opacity-50"
            disabled={state === "loading"}
          />
          {errors.email && (
            <p className="text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>
        {serverError && (
          <p className="text-xs text-red-400">{serverError}</p>
        )}
        <button
          type="submit"
          disabled={state === "loading"}
          className="w-full px-6 py-2.5 bg-blue-700 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg
            transition-all duration-150 cursor-pointer
            shadow-[0_0_20px_rgba(37,99,235,0.3)]
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state === "loading" ? "Sending…" : "Send Reset Link"}
        </button>
      </form>
    </Modal>
  );
}

// ─── Magic-link modal ─────────────────────────────────────────────────────────
function MagicLinkModal({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<"idle" | "loading" | "sent">("idle");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({ resolver: zodResolver(emailSchema) });

  const onSubmit = async (data: EmailFormData) => {
    setState("loading");
    setServerError("");
    try {
      await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      setState("sent");
    } catch {
      setServerError("Something went wrong. Please try again.");
      setState("idle");
    }
  };

  if (state === "sent") {
    return (
      <Modal
        title="Check your inbox"
        description=""
        onClose={onClose}
      >
        <div className="text-center py-2 space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <p className="text-sm text-slate-300">
            A one-click sign-in link has been sent to your email.
            The link expires in 30 minutes.
          </p>
          <button
            onClick={onClose}
            className="mt-2 text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            Back to sign in
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title="Sign in without a password"
      description="Enter your email and we'll send you a one-click sign-in link. No password needed."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="ml-email" className="block text-sm font-medium text-slate-300">
            Email address
          </label>
          <input
            id="ml-email"
            type="email"
            {...register("email")}
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 bg-[#252540] border border-white/10 rounded-lg text-gray-200 placeholder-slate-500 text-sm
              focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/50
              transition-colors duration-200 disabled:opacity-50"
            disabled={state === "loading"}
          />
          {errors.email && (
            <p className="text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>
        {serverError && (
          <p className="text-xs text-red-400">{serverError}</p>
        )}
        <button
          type="submit"
          disabled={state === "loading"}
          className="w-full px-6 py-2.5 bg-blue-700 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg
            transition-all duration-150 cursor-pointer
            shadow-[0_0_20px_rgba(37,99,235,0.3)]
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state === "loading" ? "Sending…" : "Send Sign-In Link"}
        </button>
      </form>
    </Modal>
  );
}

// ─── Login page ───────────────────────────────────────────────────────────────
export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [modal, setModal] = useState<"none" | "forgot" | "magic">("none");

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else if (result?.ok) {
      window.location.href = "/dashboard";
    }
  };

  return (
    <>
      {modal === "forgot" && (
        <ForgotPasswordModal onClose={() => setModal("none")} />
      )}
      {modal === "magic" && (
        <MagicLinkModal onClose={() => setModal("none")} />
      )}

      <div className="relative min-h-screen flex flex-col bg-[#0f0f1a] text-white overflow-hidden">
        <AmbientBackground variant="subtle" />

        {/* Navbar */}
        <header className="relative z-10 border-b border-white/[0.06] bg-black/20 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.jpg" alt="PhishWise" width={36} height={36} className="h-9 w-auto" />
              <span className="text-lg font-bold text-gray-200">PhishWise</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/signup" className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
                Sign Up
              </Link>
            </nav>
          </div>
        </header>

        {/* Main */}
        <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-16">
          <div
            className="w-full max-w-md transition-all duration-700"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(24px)",
            }}
          >
            {/* Heading */}
            <div className="text-center mb-8">
              <p className="text-xs uppercase tracking-[0.18em] font-semibold text-blue-400 mb-3">
                Welcome Back
              </p>
              <h1 className="text-4xl font-bold text-white mb-3">
                Sign in to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                  PhishWise
                </span>
              </h1>
              <p className="text-sm text-slate-400">
                Continue your phishing awareness training
              </p>
            </div>

            {/* Card */}
            <div className="relative rounded-xl border border-white/[0.06] hover:border-blue-600/30 bg-[#1a1a2e]/80 backdrop-blur-sm p-8 transition-colors duration-300">
              <div
                className="absolute top-0 left-6 right-6 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(37,99,235,0.6) 50%, transparent)",
                }}
              />

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 bg-[#252540] border border-white/10 rounded-lg text-gray-200 placeholder-slate-500 text-sm
                      focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/50
                      transition-colors duration-200 disabled:opacity-50"
                    disabled={loading}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setModal("forgot")}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    id="password"
                    type="password"
                    {...register("password")}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-[#252540] border border-white/10 rounded-lg text-gray-200 placeholder-slate-500 text-sm
                      focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/50
                      transition-colors duration-200 disabled:opacity-50"
                    disabled={loading}
                  />
                  {errors.password && (
                    <p className="text-xs text-red-400">{errors.password.message}</p>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <div className="p-3 bg-red-950/40 border border-red-700/50 rounded-lg text-sm text-red-300">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-2.5 bg-blue-700 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg
                    transition-all duration-150 cursor-pointer
                    shadow-[0_0_20px_rgba(37,99,235,0.35)] hover:shadow-[0_0_28px_rgba(37,99,235,0.55)]
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {loading ? "Signing in…" : "Sign In"}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.06]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-[#1a1a2e] text-slate-500">or</span>
                </div>
              </div>

              {/* Alternative sign-in options */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => signIn("google")}
                  className="w-full flex items-center justify-center gap-2 px-6 py-2.5
                    border border-white/[0.08] hover:border-blue-600/40
                    bg-transparent hover:bg-blue-950/30
                    text-slate-300 hover:text-white text-sm font-medium rounded-lg
                    transition-all duration-150 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google
                </button>
                <button
                  type="button"
                  onClick={() => setModal("magic")}
                  className="w-full flex items-center justify-center gap-2 px-6 py-2.5
                    border border-white/[0.08] hover:border-blue-600/40
                    bg-transparent hover:bg-blue-950/30
                    text-slate-300 hover:text-white text-sm font-medium rounded-lg
                    transition-all duration-150 cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-blue-400" />
                  Sign in without a password
                </button>
              </div>

              {/* Bottom links */}
              <div className="mt-6 pt-6 border-t border-white/[0.06] text-center space-y-3">
                <p className="text-sm text-slate-400">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                    Sign up free
                  </Link>
                </p>
                <p className="text-xs text-slate-600">
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/[0.06] py-6 text-center text-slate-600 text-sm">
          © 2025 PhishWise · University of Arkansas CSCE Capstone · Team 20
        </footer>
      </div>
    </>
  );
}
