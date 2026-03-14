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
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-6 bg-cover bg-center"
      style={{
        backgroundImage: "url('/landing/cta-bg.jpg')",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/65" />

      {/* Radial gradient glow */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="w-96 h-96 bg-primary-500 rounded-full filter blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <div
          className={`transition-all duration-700 ${
            isVisible
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Stop Phishing Attacks Before They Start?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Join security teams already using PhishWise to train employees,
            reduce risk, and prove it with data.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-3 text-lg font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 text-lg font-medium text-primary-400 border border-primary-600 rounded-md hover:bg-primary-600/10 transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
