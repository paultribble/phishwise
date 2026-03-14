"use client";

import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { bebas, playfair } from "@/lib/fonts";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-700 bg-phish-navy/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-end gap-2 leading-none">
            <Image
              src="/logo.jpg"
              alt="PhishWise shield"
              width={44}
              height={44}
              className="object-contain mb-1"
            />
            <span className={`text-4xl tracking-widest text-gray-200 ${bebas.className}`}>
              PHISH
            </span>
            <span className={`text-5xl italic text-gray-400 ${playfair.className}`}>
              WISE
            </span>
          </Link>
          <nav className="flex gap-6">
            <Link href="/learn-more" className="text-gray-300 hover:text-white transition-colors">
              Learn More
            </Link>
            <Link href="/signup" className="text-gray-300 hover:text-white transition-colors">
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full space-y-8">
          {/* Logo/Title */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-200 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-400">
              Log in to continue your phishing awareness training
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-phish-blue/20 p-8 rounded-lg border border-gray-700 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-phish-accent focus:ring-1 focus:ring-phish-accent"
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-phish-accent focus:ring-1 focus:ring-phish-accent"
                  disabled={loading}
                />
                {errors.password && (
                  <p className="text-sm text-red-400">{errors.password.message}</p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-2 bg-phish-accent text-gray-900 rounded-lg font-medium hover:bg-phish-accent/90 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-phish-blue/20 text-gray-400">
                  Email & Password
                </span>
              </div>
            </div>

            <p className="text-center text-sm text-gray-400">
              Secure login with email and password. Your password is encrypted and never shared.
            </p>
          </div>

          {/* Additional Links */}
          <div className="text-center space-y-4">
            <p className="text-gray-400">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-phish-accent hover:underline font-medium">
                Sign up here
              </Link>
            </p>

            <p className="text-sm text-gray-500">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700 py-6 text-center text-gray-500 text-sm">
        <p>University of Arkansas - CSCE Capstone 2025</p>
      </footer>
    </div>
  );
}
