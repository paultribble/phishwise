"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Mail, AlertTriangle, BookOpen } from "lucide-react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const steps = [
  {
    number: 1,
    title: "Create a Campaign",
    description:
      "Choose a phishing template, select employees, and schedule your send date. Takes under five minutes.",
    icon: Mail,
    lottieFile: "/landing/step1-lottie.json",
  },
  {
    number: 2,
    title: "Employees Receive the Simulation",
    description:
      "They get a realistic phishing email. Clicking takes them to a safe page that explains what just happened.",
    icon: AlertTriangle,
    lottieFile: "/landing/step2-lottie.json",
  },
  {
    number: 3,
    title: "Training Kicks In Automatically",
    description:
      "Clicked employees are enrolled in the right module. You get a full report. No manual work required.",
    icon: BookOpen,
    lottieFile: "/landing/step3-lottie.json",
  },
];

export function HowItWorks() {
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>(
    new Array(steps.length).fill(false)
  );
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            steps.forEach((_, index) => {
              setTimeout(() => {
                setVisibleSteps((prev) => {
                  const updated = [...prev];
                  updated[index] = true;
                  return updated;
                });
              }, index * 150);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-24 px-6 bg-black/20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            From Setup to Security in Three Steps
          </h2>
          <p className="text-lg text-gray-400">
            Simple workflow, maximum impact
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  visibleSteps[index]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  {/* Lottie or Icon */}
                  <div className="h-48 w-48 mb-6 flex items-center justify-center">
                    <LottieOrFallback
                      lottieFile={step.lottieFile}
                      icon={IconComponent}
                    />
                  </div>

                  {/* Step Number */}
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full border-2 border-primary-600 text-primary-400 font-bold text-lg mb-4">
                    {step.number}
                  </div>

                  {/* Step Title */}
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
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
      <Lottie
        animationData={animationData}
        loop
        autoplay
        className="w-full h-full"
      />
    );
  }

  if (useFallback) {
    return <Icon className="h-24 w-24 text-primary-500 opacity-75" />;
  }

  return <Icon className="h-24 w-24 text-primary-500 opacity-50" />;
}
