"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { AmbientBackground } from "@/components/landing/AmbientBackground";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Short delay so CSS transitions run after hydration
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen pt-20 flex items-center overflow-hidden bg-[#0f0f1a]">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover opacity-20"
        >
          <source src="/landing/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* Gradient overlay — heavier on left so text is always readable */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(15,15,26,0.95) 0%, rgba(15,15,26,0.75) 50%, rgba(15,15,26,0.88) 100%)",
          }}
        />
      </div>

      {/* Ambient orbs + dot grid */}
      <AmbientBackground variant="violet" />

      {/* Floating particle dots */}
      <FloatingParticles />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 w-full">
        <div className="grid lg:grid-cols-[1fr_0.85fr] gap-16 items-center">
          {/* Left Column — staggered entrance */}
          <div className="space-y-7">
            {/* Eyebrow */}
            <div
              className="transition-all duration-700"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(20px)",
                transitionDelay: "0ms",
              }}
            >
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-violet-400">
                <span className="h-px w-6 bg-violet-500 inline-block" />
                Security Awareness Training
              </span>
            </div>

            {/* Headline */}
            <div
              className="transition-all duration-700"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(24px)",
                transitionDelay: "120ms",
              }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.04] tracking-tight">
                Turn Your Biggest{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-600">
                  Vulnerability
                </span>{" "}
                Into Your Strongest Defense
              </h1>
            </div>

            {/* Subhead */}
            <div
              className="transition-all duration-700"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(20px)",
                transitionDelay: "240ms",
              }}
            >
              <p className="text-lg text-slate-300 leading-relaxed max-w-md">
                PhishWise simulates real phishing attacks, identifies at-risk
                employees, and automatically delivers targeted training — before
                a real breach happens.
              </p>
            </div>

            {/* CTA anchor */}
            <div
              className="transition-all duration-700"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(16px)",
                transitionDelay: "360ms",
              }}
            >
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors duration-150 font-medium group"
              >
                See how it works
                <span className="transition-transform duration-200 group-hover:translate-y-0.5">↓</span>
              </a>
            </div>
          </div>

          {/* Right Column */}
          <div
            className="flex items-center justify-center transition-all duration-1000"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateX(0)" : "translateX(32px)",
              transitionDelay: "200ms",
            }}
          >
            <HeroAnimation />
          </div>
        </div>
      </div>

      {/* Bottom fade to next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #0f0f1a)",
        }}
      />
    </section>
  );
}

function FloatingParticles() {
  const particles = [
    { top: "20%", left: "10%", delay: "0s",   dur: "6s",  size: 2, opacity: 0.4 },
    { top: "45%", left: "88%", delay: "1.5s", dur: "8s",  size: 3, opacity: 0.3 },
    { top: "70%", left: "15%", delay: "3s",   dur: "7s",  size: 2, opacity: 0.35 },
    { top: "30%", left: "75%", delay: "0.8s", dur: "9s",  size: 2, opacity: 0.25 },
    { top: "60%", left: "55%", delay: "2.2s", dur: "6.5s",size: 3, opacity: 0.2 },
    { top: "15%", left: "50%", delay: "4s",   dur: "11s", size: 2, opacity: 0.3 },
    { top: "80%", left: "70%", delay: "1s",   dur: "8.5s",size: 2, opacity: 0.25 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-violet-400 anim-float-a"
          style={{
            top: p.top,
            left: p.left,
            width: `${p.size * 4}px`,
            height: `${p.size * 4}px`,
            opacity: p.opacity,
            animationDelay: p.delay,
            animationDuration: p.dur,
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );
}

function HeroAnimation() {
  const [heroAnimation, setHeroAnimation] = useState<any>(null);

  useEffect(() => {
    fetch("/landing/hero-lottie.json")
      .then((res) => res.json())
      .then((data) => setHeroAnimation(data))
      .catch(() => {});
  }, []);

  if (heroAnimation) {
    return (
      <div className="w-full max-w-sm">
        <Lottie animationData={heroAnimation} loop autoplay className="w-full h-auto" />
      </div>
    );
  }

  // Fallback animated SVG inbox
  return (
    <div className="relative w-full max-w-sm">
      <style>{`
        @keyframes emailSlide {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes badgePulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.12); opacity: 0.85; }
        }
        @keyframes glowRing {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        .sv-email { animation: emailSlide 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .sv-email:nth-child(1) { animation-delay: 0.3s; }
        .sv-email:nth-child(2) { animation-delay: 0.6s; }
        .sv-email:nth-child(3) { animation-delay: 0.9s; }
        .sv-badge { animation: badgePulse 2s ease-in-out infinite; animation-delay: 1.4s; }
        .sv-glow  { animation: glowRing 2.5s ease-in-out infinite; }
      `}</style>

      <svg viewBox="0 0 380 300" className="w-full h-auto drop-shadow-2xl" preserveAspectRatio="xMidYMid meet">
        {/* Outer glow ring */}
        <ellipse cx="190" cy="160" rx="170" ry="130" fill="none"
          stroke="rgba(109,40,217,0.2)" strokeWidth="1" className="sv-glow" />

        {/* Inbox panel */}
        <rect x="40" y="30" width="300" height="240" rx="14"
          fill="rgba(26,26,46,0.85)" stroke="rgba(109,40,217,0.35)" strokeWidth="1.5" />

        {/* Panel header bar */}
        <rect x="40" y="30" width="300" height="36" rx="14" fill="rgba(31,31,56,0.9)" />
        <rect x="40" y="52" width="300" height="14" fill="rgba(31,31,56,0.9)" />
        <circle cx="64" cy="48" r="5" fill="rgba(239,68,68,0.6)" />
        <circle cx="82" cy="48" r="5" fill="rgba(245,158,11,0.6)" />
        <circle cx="100" cy="48" r="5" fill="rgba(16,185,129,0.6)" />
        <rect x="140" y="43" width="80" height="10" rx="3" fill="rgba(148,163,184,0.15)" />

        {/* Email rows */}
        <g className="sv-email">
          <rect x="58" y="80" width="264" height="46" rx="8" fill="rgba(37,37,64,0.7)"
            stroke="rgba(109,40,217,0.15)" strokeWidth="1" />
          <rect x="72" y="92" width="110" height="7" rx="2" fill="rgba(148,163,184,0.5)" />
          <rect x="72" y="106" width="180" height="5" rx="1" fill="rgba(71,85,105,0.4)" />
          <rect x="290" y="91" width="22" height="9" rx="2" fill="rgba(109,40,217,0.25)" />
        </g>

        <g className="sv-email">
          <rect x="58" y="138" width="264" height="46" rx="8" fill="rgba(37,37,64,0.7)"
            stroke="rgba(109,40,217,0.15)" strokeWidth="1" />
          <rect x="72" y="150" width="130" height="7" rx="2" fill="rgba(148,163,184,0.5)" />
          <rect x="72" y="164" width="160" height="5" rx="1" fill="rgba(71,85,105,0.4)" />
        </g>

        <g className="sv-email">
          <rect x="58" y="196" width="264" height="46" rx="8" fill="rgba(239,68,68,0.08)"
            stroke="rgba(239,68,68,0.30)" strokeWidth="1.5" />
          <rect x="72" y="208" width="140" height="7" rx="2" fill="rgba(252,165,165,0.5)" />
          <rect x="72" y="222" width="170" height="5" rx="1" fill="rgba(71,85,105,0.4)" />
          {/* Warning badge */}
          <circle cx="308" cy="219" r="16" fill="rgba(239,68,68,0.9)" className="sv-badge" />
          <text x="308" y="224" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">!</text>
        </g>
      </svg>
    </div>
  );
}
