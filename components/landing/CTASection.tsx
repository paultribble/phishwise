"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export function CTASection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 overflow-hidden bg-[#0f0f1a]"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/landing/cta-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/70" />

      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" aria-hidden="true" />

      {/* Pulsing glow rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div
          className="absolute w-[480px] h-[480px] rounded-full border border-violet-700/20 anim-pulse-ring"
        />
        <div
          className="absolute w-[360px] h-[360px] rounded-full border border-violet-600/25 anim-pulse-ring"
          style={{ animationDelay: "0.8s" }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(109,40,217,0.12) 0%, transparent 65%)",
            filter: "blur(30px)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        {/* Eyebrow */}
        <div
          className="transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(16px)",
            transitionDelay: "0ms",
          }}
        >
          <span className="text-xs uppercase tracking-[0.18em] font-semibold text-violet-400 mb-4 inline-block">
            Get Started Today
          </span>
        </div>

        {/* Headline */}
        <div
          className="transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
            transitionDelay: "100ms",
            transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Ready to Stop Phishing Attacks{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-600">
              Before They Start?
            </span>
          </h2>
        </div>

        {/* Subtext */}
        <div
          className="transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "200ms",
          }}
        >
          <p className="text-lg text-slate-300 mb-10">
            Join security teams already using PhishWise to train employees,
            reduce risk, and prove it with data.
          </p>
        </div>

        {/* Buttons — separate stagger */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <div
            className="transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transitionDelay: "300ms",
            }}
          >
            <Link
              href="/login"
              className="block px-8 py-3.5 text-base font-semibold text-white
                bg-violet-700 hover:bg-violet-600
                rounded-lg transition-all duration-150
                shadow-[0_0_24px_rgba(109,40,217,0.4)] hover:shadow-[0_0_32px_rgba(109,40,217,0.6)]"
            >
              Create Free Account
            </Link>
          </div>

          <div
            className="transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transitionDelay: "380ms",
            }}
          >
            <Link
              href="/login"
              className="block px-8 py-3.5 text-base font-medium text-violet-300
                border border-violet-700/60 hover:border-violet-500
                hover:bg-violet-950/50 hover:text-violet-200
                rounded-lg transition-all duration-150"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
