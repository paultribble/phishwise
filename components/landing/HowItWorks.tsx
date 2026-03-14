"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Mail, AlertTriangle, BookOpen } from "lucide-react";
import { GridBackground } from "@/components/landing/AmbientBackground";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const steps = [
  {
    number: 1,
    title: "Create a Campaign",
    description: "Choose a phishing template, select employees, and schedule your send date. Takes under five minutes.",
    icon: Mail,
    lottieFile: "/landing/step1-lottie.json",
    color: "violet",
  },
  {
    number: 2,
    title: "Employees Receive the Simulation",
    description: "They get a realistic phishing email. Clicking takes them to a safe page that explains what just happened.",
    icon: AlertTriangle,
    lottieFile: "/landing/step2-lottie.json",
    color: "sky",
  },
  {
    number: 3,
    title: "Training Kicks In Automatically",
    description: "Clicked employees are enrolled in the right module. You get a full report. No manual work required.",
    icon: BookOpen,
    lottieFile: "/landing/step3-lottie.json",
    color: "emerald",
  },
];

export function HowItWorks() {
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>(
    new Array(steps.length).fill(false)
  );
  const [connectorVisible, setConnectorVisible] = useState(false);
  const [headingVisible, setHeadingVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHeadingVisible(true);
            // Stagger step reveals
            steps.forEach((_, index) => {
              setTimeout(() => {
                setVisibleSteps((prev) => {
                  const updated = [...prev];
                  updated[index] = true;
                  return updated;
                });
              }, 200 + index * 180);
            });
            // Connectors after steps appear
            setTimeout(() => setConnectorVisible(true), 200 + steps.length * 180 + 100);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-28 px-6 overflow-hidden bg-[#0f0f1a]"
    >
      <GridBackground />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Heading */}
        <div
          className="text-center mb-20 transition-all duration-700"
          style={{
            opacity: headingVisible ? 1 : 0,
            transform: headingVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <span className="text-xs uppercase tracking-[0.18em] font-semibold text-violet-400 mb-3 inline-block">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            From Setup to Security in Three Steps
          </h2>
          <p className="text-lg text-slate-400">Simple workflow, maximum impact</p>
        </div>

        {/* Steps grid */}
        <div className="relative grid md:grid-cols-3 gap-8 lg:gap-16">
          {/* SVG connector lines — desktop only */}
          <ConnectorLines visible={connectorVisible} />

          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const colorMap: Record<string, string> = {
              violet: "border-violet-600 text-violet-400 bg-violet-950/60",
              sky:    "border-sky-600    text-sky-400    bg-sky-950/60",
              emerald:"border-emerald-600 text-emerald-400 bg-emerald-950/60",
            };
            const iconBg = colorMap[step.color] ?? colorMap.violet;

            return (
              <div
                key={index}
                className="transition-all duration-700"
                style={{
                  opacity: visibleSteps[index] ? 1 : 0,
                  transform: visibleSteps[index]
                    ? "translateY(0) scale(1)"
                    : "translateY(40px) scale(0.96)",
                  transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
                  transitionDelay: `${index * 60}ms`,
                }}
              >
                <div className="flex flex-col items-center text-center group">
                  {/* Icon box */}
                  <div className={`relative mb-6 flex h-20 w-20 items-center justify-center
                    rounded-2xl border-2 ${iconBg}
                    group-hover:scale-105 transition-transform duration-200`}>
                    <IconComponent className="h-9 w-9" />
                    {/* Glow underneath */}
                    <div className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100
                      transition-opacity duration-300 blur-md"
                      style={{ background: "rgba(109,40,217,0.2)" }} />
                  </div>

                  {/* Step number badge */}
                  <div className="inline-flex items-center justify-center h-8 w-8
                    rounded-full border border-violet-700/60 bg-violet-950/60
                    text-violet-400 font-mono text-sm font-bold mb-4">
                    {step.number}
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-[240px]">
                    {step.description}
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

function ConnectorLines({ visible }: { visible: boolean }) {
  return (
    <div className="hidden md:block absolute top-[38px] left-0 right-0 pointer-events-none" aria-hidden="true">
      <svg
        viewBox="0 0 800 4"
        preserveAspectRatio="none"
        className="absolute w-full"
        style={{ top: 0 }}
      >
        {/* Left connector */}
        <line
          x1="160" y1="2" x2="310" y2="2"
          stroke="rgba(109,40,217,0.35)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          strokeDashoffset={visible ? 0 : 200}
          style={{
            transition: "stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s",
          }}
        />
        {/* Right connector */}
        <line
          x1="490" y1="2" x2="640" y2="2"
          stroke="rgba(109,40,217,0.35)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          strokeDashoffset={visible ? 0 : 200}
          style={{
            transition: "stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s",
          }}
        />
        {/* Arrow heads */}
        {visible && (
          <>
            <polygon points="310,0 318,2 310,4" fill="rgba(109,40,217,0.5)"
              style={{ animation: "fadeIn 0.3s ease-out 0.9s both" }} />
            <polygon points="640,0 648,2 640,4" fill="rgba(109,40,217,0.5)"
              style={{ animation: "fadeIn 0.3s ease-out 1.1s both" }} />
          </>
        )}
      </svg>
    </div>
  );
}

function LottieOrFallback({
  lottieFile,
  icon: Icon,
}: {
  lottieFile: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const [animationData, setAnimationData] = useState<any>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    fetch(lottieFile)
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch(() => setUseFallback(true));
  }, [lottieFile]);

  if (animationData) {
    return (
      <Lottie animationData={animationData} loop autoplay className="w-full h-full" />
    );
  }
  if (useFallback) {
    return <Icon className="h-10 w-10 text-inherit opacity-80" />;
  }
  return <Icon className="h-10 w-10 text-inherit opacity-50" />;
}
