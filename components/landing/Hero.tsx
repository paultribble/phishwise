"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export function Hero() {
  return (
    <section className="relative min-h-screen pt-20 flex items-center overflow-hidden">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        >
          <source src="/landing/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="inline-block">
              <span className="text-xs uppercase tracking-widest font-semibold text-primary-400">
                Security Awareness Training
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Turn Your Biggest Vulnerability Into Your Strongest Defense
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed max-w-md">
              PhishWise simulates real phishing attacks, identifies at-risk
              employees, and automatically delivers targeted training — before a
              real breach happens.
            </p>

            <a
              href="#how-it-works"
              className="inline-block text-primary-400 hover:text-primary-300 transition-colors font-medium"
            >
              See how it works ↓
            </a>
          </div>

          {/* Right Column - Animation or SVG Fallback */}
          <div className="flex items-center justify-center h-96 lg:h-full">
            <HeroAnimation />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroAnimation() {
  const [heroAnimation, setHeroAnimation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/landing/hero-lottie.json")
      .then((res) => res.json())
      .then((data) => {
        setHeroAnimation(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // If we have animation data, show Lottie
  if (heroAnimation) {
    return (
      <div className="w-full max-w-sm">
        <Lottie
          animationData={heroAnimation}
          loop
          autoplay
          className="w-full h-auto"
        />
      </div>
    );
  }

  // Fallback: Animated SVG Inbox
  return (
    <div className="relative w-full max-w-sm h-96">
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        .email {
          animation: slideIn 0.6s ease-out forwards;
        }
        .email:nth-child(1) { animation-delay: 0s; }
        .email:nth-child(2) { animation-delay: 0.1s; }
        .email:nth-child(3) { animation-delay: 0.2s; }
        .warning-badge {
          animation: pulse 1.5s ease-in-out infinite;
          animation-delay: 0.8s;
        }
      `}</style>

      <svg
        viewBox="0 0 400 320"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Inbox Container */}
        <rect
          x="50"
          y="40"
          width="300"
          height="240"
          rx="12"
          fill="rgba(31, 41, 55, 0.5)"
          stroke="rgba(107, 114, 128, 0.5)"
          strokeWidth="2"
        />

        {/* Emails */}
        <g className="email">
          <rect x="70" y="70" width="260" height="50" rx="6" fill="#1f2937" />
          <rect x="80" y="80" width="140" height="8" rx="2" fill="#9ca3af" />
          <rect x="80" y="95" width="200" height="6" rx="1" fill="#6b7280" />
        </g>

        <g className="email">
          <rect x="70" y="140" width="260" height="50" rx="6" fill="#1f2937" />
          <rect x="80" y="150" width="140" height="8" rx="2" fill="#9ca3af" />
          <rect x="80" y="165" width="200" height="6" rx="1" fill="#6b7280" />
        </g>

        <g className="email">
          <rect x="70" y="210" width="260" height="50" rx="6" fill="#1f2937" />
          <rect x="80" y="220" width="140" height="8" rx="2" fill="#9ca3af" />
          <rect x="80" y="235" width="200" height="6" rx="1" fill="#6b7280" />
          {/* Warning Badge */}
          <circle
            cx="320"
            cy="235"
            r="18"
            fill="#ef4444"
            className="warning-badge"
          />
          <text
            x="320"
            y="240"
            textAnchor="middle"
            fill="white"
            fontSize="14"
            fontWeight="bold"
            className="warning-badge"
          >
            !
          </text>
        </g>
      </svg>
    </div>
  );
}
