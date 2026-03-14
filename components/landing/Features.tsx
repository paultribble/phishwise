"use client";

import { useEffect, useRef, useState } from "react";
import { Shield, BarChart2, GraduationCap, Calendar, Lock, TrendingUp } from "lucide-react";
import { AmbientBackground } from "@/components/landing/AmbientBackground";

const features = [
  {
    icon: Shield,
    title: "Realistic Phishing Simulations",
    description: "Send convincing phishing emails from a library of 20+ templates crafted to mirror real-world attacks.",
    accent: "from-violet-500/20 to-violet-600/5",
  },
  {
    icon: BarChart2,
    title: "Manager Analytics Dashboard",
    description: "Track open rates, click rates, and training completion across your organization in real time.",
    accent: "from-sky-500/20 to-sky-600/5",
  },
  {
    icon: GraduationCap,
    title: "Automated Training Assignment",
    description: "Employees who click are instantly enrolled in targeted micro-learning modules — no follow-up needed.",
    accent: "from-emerald-500/20 to-emerald-600/5",
  },
  {
    icon: Calendar,
    title: "Campaign Scheduling",
    description: "Schedule simulations weeks in advance with flexible options to keep employees consistently alert.",
    accent: "from-violet-500/20 to-violet-600/5",
  },
  {
    icon: Lock,
    title: "Role-Based Access Control",
    description: "Separate manager and employee views keep simulation data out of the wrong hands.",
    accent: "from-amber-500/20 to-amber-600/5",
  },
  {
    icon: TrendingUp,
    title: "Progress Reporting",
    description: "Exportable reports show security posture trends over time so you can demonstrate ROI to leadership.",
    accent: "from-violet-500/20 to-violet-600/5",
  },
];

export function Features() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>(
    new Array(features.length).fill(false)
  );
  const [headingVisible, setHeadingVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const headingObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeadingVisible(true);
          headingObserver.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll("[data-card-index]");
            cards.forEach((card) => {
              const index = parseInt(card.getAttribute("data-card-index") || "0");
              setTimeout(() => {
                setVisibleCards((prev) => {
                  const updated = [...prev];
                  updated[index] = true;
                  return updated;
                });
              }, index * 90);
            });
            cardObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (headingRef.current) headingObserver.observe(headingRef.current);
    if (sectionRef.current) cardObserver.observe(sectionRef.current);

    return () => {
      headingObserver.disconnect();
      cardObserver.disconnect();
    };
  }, []);

  return (
    <section id="features" ref={sectionRef} className="relative py-28 px-6 overflow-hidden">
      <AmbientBackground variant="subtle" />

      {/* Line grid background */}
      <div className="absolute inset-0 line-grid pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section heading */}
        <div
          ref={headingRef}
          className="text-center mb-16 transition-all duration-700"
          style={{
            opacity: headingVisible ? 1 : 0,
            transform: headingVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <span className="text-xs uppercase tracking-[0.18em] font-semibold text-violet-400 mb-3 inline-block">
            Platform Capabilities
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything You Need to Build a Security-Aware Culture
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Comprehensive tools designed for modern security teams
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                data-card-index={index}
                className="transition-all duration-600"
                style={{
                  opacity: visibleCards[index] ? 1 : 0,
                  transform: visibleCards[index]
                    ? "translateY(0) scale(1)"
                    : "translateY(32px) scale(0.97)",
                  transitionDuration: "550ms",
                  transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                <div className="group relative h-full p-6 rounded-xl overflow-hidden cursor-default
                  border border-white/[0.06] bg-[#1a1a2e]
                  hover:border-violet-600/40
                  transition-colors duration-200">

                  {/* Hover background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.accent}
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                  {/* Top shimmer line on hover */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r
                    from-transparent via-violet-500/60 to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Icon container */}
                  <div className="relative mb-5 flex h-11 w-11 items-center justify-center
                    rounded-lg bg-violet-950/80 border border-violet-800/40
                    group-hover:bg-violet-900/60 group-hover:border-violet-600/50
                    transition-all duration-200">
                    <Icon className="h-5 w-5 text-violet-400 group-hover:text-violet-300 transition-colors duration-200" />
                  </div>

                  <h3 className="relative text-base font-semibold text-slate-100 mb-2 group-hover:text-white transition-colors duration-150">
                    {feature.title}
                  </h3>
                  <p className="relative text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-150">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
