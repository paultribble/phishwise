"use client";

import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { AmbientBackground } from "@/components/landing/AmbientBackground";

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

const benefits = [
  "Secure password-based authentication",
  "Personalized phishing simulations sent to your email",
  "Instant feedback and training when you fall for a test",
  "Track your progress and improvement over time",
];

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const { error: serverError } = await response.json();
        setError(serverError || "Registration failed");
        setLoading(false);
        return;
      }

      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        window.location.href = "/dashboard";
      } else {
        setError("Account created! Please log in manually.");
        setLoading(false);
      }
    } catch {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#0f0f1a] text-white overflow-hidden">
      <AmbientBackground variant="subtle" />

      {/* Navbar */}
      <header className="relative z-10 border-b border-white/[0.06] bg-black/20 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.jpg"
              alt="PhishWise"
              width={36}
              height={36}
              className="h-9 w-auto"
            />
            <span className="text-lg font-bold text-gray-200">PhishWise</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
            >
              Log In
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
            <p className="text-xs uppercase tracking-[0.18em] font-semibold text-violet-400 mb-3">
              Get Started Free
            </p>
            <h1 className="text-4xl font-bold text-white mb-3">
              Create your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-600">
                account
              </span>
            </h1>
            <p className="text-sm text-slate-400">
              Start learning to recognize phishing attacks today
            </p>
          </div>

          {/* Card */}
          <div className="relative rounded-xl border border-white/[0.06] hover:border-violet-600/30 bg-[#1a1a2e]/80 backdrop-blur-sm p-8 transition-colors duration-300">
            {/* Shimmer top line */}
            <div
              className="absolute top-0 left-6 right-6 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(109,40,217,0.6) 50%, transparent)",
              }}
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name")}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 bg-[#252540] border border-white/10 rounded-lg text-gray-200 placeholder-slate-500 text-sm
                    focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600/50
                    transition-colors duration-200 disabled:opacity-50"
                  disabled={loading}
                />
                {errors.name && (
                  <p className="text-xs text-red-400">{errors.name.message}</p>
                )}
              </div>

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
                    focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600/50
                    transition-colors duration-200 disabled:opacity-50"
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-[#252540] border border-white/10 rounded-lg text-gray-200 placeholder-slate-500 text-sm
                    focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600/50
                    transition-colors duration-200 disabled:opacity-50"
                  disabled={loading}
                />
                {errors.password && (
                  <p className="text-xs text-red-400">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-[#252540] border border-white/10 rounded-lg text-gray-200 placeholder-slate-500 text-sm
                    focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600/50
                    transition-colors duration-200 disabled:opacity-50"
                  disabled={loading}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
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
                className="w-full px-6 py-2.5 bg-violet-700 hover:bg-violet-600 text-white text-sm font-semibold rounded-lg
                  transition-all duration-150 cursor-pointer
                  shadow-[0_0_20px_rgba(109,40,217,0.35)] hover:shadow-[0_0_28px_rgba(109,40,217,0.55)]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>

            {/* Benefits */}
            <div className="mt-6 pt-6 border-t border-white/[0.06] space-y-2.5">
              {benefits.map((b) => (
                <div key={b} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-slate-400">{b}</p>
                </div>
              ))}
            </div>

            {/* Footer links */}
            <div className="mt-6 pt-6 border-t border-white/[0.06] text-center space-y-3">
              <p className="text-sm text-slate-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                >
                  Log in here
                </Link>
              </p>
              <p className="text-xs text-slate-600">
                By creating an account, you agree to our Terms of Service and Privacy Policy
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
  );
}
