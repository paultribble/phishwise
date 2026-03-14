"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { prefix: "",   value: 91,   suffix: "%",       label: "of cyberattacks begin with phishing", source: "Verizon DBIR" },
  { prefix: "",   value: 3.4,  suffix: "x",       label: "reduction in click rates after training", source: "PhishWise Data" },
  { prefix: "< ", value: 5,    suffix: " min",    label: "to launch a simulation campaign", source: "Platform Average" },
];

export function StatsBar() {
  const [displayValues, setDisplayValues] = useState(["0", "0", "0"]);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            setVisible(true);
            animateStats();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const animateStats = () => {
    const targets = [91, 3.4, 5];
    const duration = 1400;

    targets.forEach((target, index) => {
      const startTime = performance.now();
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = easeOut(Math.min(elapsed / duration, 1));
        const current = target * progress;

        setDisplayValues((prev) => {
          const updated = [...prev];
          if (index === 0) updated[0] = Math.floor(current).toString();
          else if (index === 1) updated[1] = current.toFixed(1);
          else updated[2] = Math.floor(current).toString();
          return updated;
        });

        if (progress < 1) requestAnimationFrame(animate);
      };

      // Stagger start
      setTimeout(() => requestAnimationFrame(animate), index * 150);
    });
  };

  return (
    <div ref={sectionRef} className="relative overflow-hidden bg-[#13131f]">
      {/* Top divider line with shimmer */}
      <div className="absolute top-0 left-0 right-0 h-px shimmer-border" />

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/landing/stats-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/75" />

      {/* Violet glow center */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="w-[600px] h-[200px] rounded-full opacity-30 anim-float-c"
          style={{
            background: "radial-gradient(ellipse, rgba(37,99,235,0.35) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16">
        <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="px-8 py-8 md:py-0 transition-all duration-700 first:pl-0 last:pr-0"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${index * 120}ms`,
              }}
            >
              <div className="flex items-start gap-4">
                {/* Violet left border accent */}
                <div className="mt-1 h-12 w-0.5 shrink-0 bg-gradient-to-b from-blue-500 to-blue-800 rounded-full" />

                <div>
                  <div className="font-mono text-5xl font-bold text-white tabular-nums tracking-tight leading-none">
                    {stat.prefix}{displayValues[index]}{stat.suffix}
                  </div>
                  <div className="mt-2 text-sm text-slate-400 leading-snug max-w-[180px]">
                    {stat.label}
                  </div>
                  <div className="mt-1.5 text-[11px] font-medium tracking-wider uppercase text-slate-600">
                    {stat.source}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px shimmer-border" />
    </div>
  );
}
