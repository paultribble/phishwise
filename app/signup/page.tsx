"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-700 bg-phish-navy/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-300">
            PhishWise
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
            {/* Google Sign In Button - Will be functional in Phase 1 */}
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setLoading(true);
                signIn("google", { callbackUrl: "/dashboard" });
              }}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>{loading ? "Redirecting..." : "Sign up with Google"}</span>
            </button>

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
                <svg className="w-5 h-5 text-phish-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-gray-300">No password required - secure OAuth authentication</p>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-phish-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-gray-300">Personalized phishing simulations sent to your email</p>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-phish-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-gray-300">Instant feedback and training when you fall for a test</p>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-phish-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-gray-300">Track your progress and improvement over time</p>
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 pt-2">
              We use industry-standard Google authentication. We never see or store your password.
              Your data is encrypted and secure.
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
              <a href="#" className="hover:underline">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="hover:underline">Privacy Policy</a>
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