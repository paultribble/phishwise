"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Shield, BookOpen, Zap, Brain } from "lucide-react";
import { AmbientBackground } from "@/components/landing/AmbientBackground";

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
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
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(15,15,26,0.95) 0%, rgba(15,15,26,0.75) 50%, rgba(15,15,26,0.88) 100%)",
          }}
        />
      </div>

      <AmbientBackground variant="violet" />
      <FloatingParticles />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 w-full">
        <div className="space-y-16">
          {/* Main Headline */}
          <div className="text-center space-y-6">
            <div
              className="transition-all duration-700"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(20px)",
                transitionDelay: "0ms",
              }}
            >
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-blue-400">
                <span className="h-px w-6 bg-blue-500 inline-block" />
                Cybersecurity Awareness Training & Education
              </span>
            </div>

            <div
              className="transition-all duration-700"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(24px)",
                transitionDelay: "120ms",
              }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.04] tracking-tight">
                Master Cybersecurity{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                  Your Way
                </span>
              </h1>
            </div>

            <div
              className="transition-all duration-700"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(20px)",
                transitionDelay: "240ms",
              }}
            >
              <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
                Choose your path to stronger security: Practice with realistic phishing simulations or explore the broader world of cybersecurity threats
              </p>
            </div>
          </div>

          {/* Dual Path Cards */}
          <div
            className="transition-all duration-700 grid md:grid-cols-2 gap-8"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(32px)",
              transitionDelay: "360ms",
            }}
          >
            {/* Train Path */}
            <Link href="/train" className="group">
              <div className="relative rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm p-8 h-full transition-all duration-300 hover:border-blue-500/60 hover:from-blue-500/20 hover:to-blue-600/10 hover:shadow-[0_0_40px_rgba(37,99,235,0.2)]">
                <div className="space-y-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-500/20 border border-blue-500/30 group-hover:bg-blue-500/30 transition-all duration-300">
                    <Zap className="h-7 w-7 text-blue-400" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">Train</h2>
                    <p className="text-sm text-slate-400">
                      Combat the most common threat
                    </p>
                  </div>

                  <p className="text-slate-300 leading-relaxed">
                    Receive realistic phishing simulations designed to test your awareness of common scams. Get instant feedback and targeted training when you click a malicious link.
                  </p>

                  <ul className="space-y-2 pt-4">
                    {[
                      "Realistic email simulations",
                      "Instant feedback & training",
                      "Progress tracking",
                      "Group management"
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                        <Shield className="h-4 w-4 text-blue-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4">
                    <button className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium group/btn">
                      Get Started
                      <span className="transition-transform duration-200 group-hover/btn:translate-x-1">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </Link>

            {/* Learn Path */}
            <Link href="/learn" className="group">
              <div className="relative rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm p-8 h-full transition-all duration-300 hover:border-purple-500/60 hover:from-purple-500/20 hover:to-purple-600/10 hover:shadow-[0_0_40px_rgba(147,51,234,0.2)]">
                <div className="space-y-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-purple-500/20 border border-purple-500/30 group-hover:bg-purple-500/30 transition-all duration-300">
                    <Brain className="h-7 w-7 text-purple-400" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">Learn</h2>
                    <p className="text-sm text-slate-400">
                      Explore the broader security landscape
                    </p>
                  </div>

                  <p className="text-slate-300 leading-relaxed">
                    Dive deeper into cybersecurity topics beyond phishing. Explore attack vectors, defense strategies, and emerging threats to build comprehensive security knowledge.
                  </p>

                  <ul className="space-y-2 pt-4">
                    {[
                      "Guided security topics",
                      "Attack & defense strategies",
                      "Real-world case studies",
                      "Expert insights & resources"
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                        <BookOpen className="h-4 w-4 text-purple-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4">
                    <button className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors font-medium group/btn">
                      Explore Topics
                      <span className="transition-transform duration-200 group-hover/btn:translate-x-1">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
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
    { top: "20%", left: "10%", delay: "0s", anim: "anim-float-a", size: 3, opacity: 0.35 },
    { top: "45%", left: "88%", delay: "1.5s", anim: "anim-float-b", size: 2, opacity: 0.3 },
    { top: "70%", left: "15%", delay: "3s", anim: "anim-float-c", size: 2, opacity: 0.28 },
    { top: "30%", left: "75%", delay: "0.8s", anim: "anim-float-a", size: 2, opacity: 0.25 },
    { top: "60%", left: "55%", delay: "2.2s", anim: "anim-float-b", size: 3, opacity: 0.22 },
    { top: "15%", left: "50%", delay: "4s", anim: "anim-float-c", size: 2, opacity: 0.3 },
    { top: "80%", left: "70%", delay: "1s", anim: "anim-float-a", size: 2, opacity: 0.25 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map((p, i) => (
        <div
          key={i}
          className={`absolute rounded-full bg-blue-400 ${p.anim}`}
          style={{
            top: p.top,
            left: p.left,
            width: `${p.size * 4}px`,
            height: `${p.size * 4}px`,
            opacity: p.opacity,
            animationDelay: p.delay,
            filter: "blur(1px)",
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        />
      ))}
    </div>
  );
}
