"use client";

import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { bebas, playfair } from "@/lib/fonts";

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

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

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
    setSuccess(false);

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

      setSuccess(true);

      // Auto-login after successful registration
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
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-700 bg-phish-navy/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-end gap-2 leading-none">
            <Image
              src="/logo.webp"
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
            <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
              Log In
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
              Get Started
            </h1>
            <p className="text-gray-400">
              Create your account and start learning to recognize phishing attacks
            </p>
          </div>

          {/* Sign Up Card */}
          <div className="bg-phish-blue/20 p-8 rounded-lg border border-gray-700 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name")}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-phish-accent focus:ring-1 focus:ring-phish-accent"
                  disabled={loading}
                />
                {errors.name && (
                  <p className="text-sm text-red-400">{errors.name.message}</p>
                )}
              </div>

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

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-phish-accent focus:ring-1 focus:ring-phish-accent"
                  disabled={loading}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
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
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-phish-blue/20 text-gray-400">
                  Quick & Secure
                </span>
              </div>
            </div>

            {/* Benefits List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-phish-accent mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-gray-300">Secure password-based authentication</p>
              </div>
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-phish-accent mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-gray-300">Personalized phishing simulations sent to your email</p>
              </div>
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-phish-accent mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-gray-300">Instant feedback and training when you fall for a test</p>
              </div>
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-phish-accent mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-gray-300">Track your progress and improvement over time</p>
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 pt-2">
              Your password is securely encrypted. We never see or store it in plain text.
            </p>
          </div>

          {/* Additional Links */}
          <div className="text-center space-y-4">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-phish-accent hover:underline font-medium">
                Log in here
              </Link>
            </p>

            <p className="text-sm text-gray-500">
              By creating an account, you agree to our{" "}
              <a href="#" className="hover:underline">
                Terms of Service
              </a>
              {" "}and{" "}
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
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
