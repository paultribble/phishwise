"use client";

import { useEffect, useRef, useState } from "react";
import {
  Shield,
  BarChart2,
  GraduationCap,
  Calendar,
  Lock,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Realistic Phishing Simulations",
    description:
      "Send convincing phishing emails from a library of 20+ templates crafted to mirror real-world attacks.",
  },
  {
    icon: BarChart2,
    title: "Manager Analytics Dashboard",
    description:
      "Track open rates, click rates, and training completion across your organization in real time.",
  },
  {
    icon: GraduationCap,
    title: "Automated Training Assignment",
    description:
      "Employees who click are instantly enrolled in targeted micro-learning modules — no follow-up needed.",
  },
  {
    icon: Calendar,
    title: "Campaign Scheduling",
    description:
      "Schedule simulations weeks in advance with flexible options to keep employees consistently alert.",
  },
  {
    icon: Lock,
    title: "Role-Based Access Control",
    description:
      "Separate manager and employee views keep simulation data out of the wrong hands.",
  },
  {
    icon: TrendingUp,
    title: "Progress Reporting",
    description:
      "Exportable reports show security posture trends over time so you can demonstrate ROI to leadership.",
  },
];

export function Features() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>(
    new Array(features.length).fill(false)
  );
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll("[data-card-index]");
            cards.forEach((card) => {
              const index = parseInt(
                card.getAttribute("data-card-index") || "0"
              );
              setTimeout(() => {
                setVisibleCards((prev) => {
                  const updated = [...prev];
                  updated[index] = true;
                  return updated;
                });
              }, index * 100);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-24 px-6 bg-black/20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything You Need to Build a Security-Aware Culture
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Comprehensive tools designed for modern security teams
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                data-card-index={index}
                className={`transition-all duration-500 ${
                  visibleCards[index]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                <div className="h-full p-6 rounded-lg border border-gray-700 bg-gray-900/30 hover:border-primary-600/50 hover:bg-gray-900/50 transition-colors">
                  <Icon className="h-12 w-12 text-primary-500 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
