"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  value: string;
  label: string;
}

const stats: Stat[] = [
  { value: "91%", label: "of cyberattacks begin with a phishing email" },
  { value: "3.4x", label: "reduction in click rates after PhishWise training" },
  { value: "< 5 min", label: "to launch a simulation campaign" },
];

export function StatsBar() {
  const [displayValues, setDisplayValues] = useState(["0%", "0x", "0 min"]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            animateStats();
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

  const animateStats = () => {
    const targetValues = [91, 3.4, 5];
    const targets = ["91%", "3.4x", "< 5 min"];
    const durations = [1500, 1500, 1500];

    targetValues.forEach((target, index) => {
      const startTime = performance.now();
      const duration = durations[index];

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (index === 0) {
          setDisplayValues((prev) => [
            `${Math.floor(progress * target)}%`,
            prev[1],
            prev[2],
          ]);
        } else if (index === 1) {
          setDisplayValues((prev) => [
            prev[0],
            `${(progress * target).toFixed(1)}x`,
            prev[2],
          ]);
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-6 bg-cover bg-center"
      style={{
        backgroundImage: "url('/landing/stats-bg.jpg')",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="border-l-4 border-primary-500 pl-6 text-center md:text-left"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {displayValues[index]}
              </div>
              <p className="text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
