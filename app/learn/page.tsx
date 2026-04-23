import Link from "next/link";
import { BookOpen, Lightbulb, Shield, Zap, Lock, Eye } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { AmbientBackground } from "@/components/landing/AmbientBackground";

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-white/[0.06] bg-[#1a1a2e]/80 backdrop-blur-sm p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export default function LearnPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f1a] text-white">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 px-6 py-12 pt-32">
        <div className="max-w-4xl mx-auto space-y-12 relative">
          {/* Hero Section */}
          <div className="relative text-center space-y-4">
            <AmbientBackground variant="subtle" />
            <h1 className="text-5xl font-bold text-white relative z-10">
              Expand Your Security Knowledge
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto relative z-10">
              Go beyond phishing. Explore the broader cybersecurity landscape and understand the diverse threats organizations face today.
            </p>
          </div>

          {/* Why Learn Beyond Phishing */}
          <GlassCard>
            <h2 className="text-3xl font-semibold text-white mb-4">
              Why Broader Security Knowledge Matters
            </h2>
            <div className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                While phishing is the most common entry point for attacks, cybersecurity threats extend far beyond the inbox. Understanding malware, network attacks, data breaches, and defense strategies gives you a complete picture of the digital threat landscape.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Whether you&apos;re securing a business, protecting your personal data, or studying cybersecurity professionally, a comprehensive knowledge base helps you make better security decisions and respond effectively to threats.
              </p>
            </div>
          </GlassCard>

          {/* Topics Overview */}
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-white">Explore Security Topics</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: Lock,
                  title: "Authentication & Access Control",
                  desc: "Learn how passwords, multi-factor authentication, and permission systems protect your accounts and data.",
                },
                {
                  icon: Zap,
                  title: "Malware & Attacks",
                  desc: "Understand ransomware, trojans, worms, and how attackers deploy malicious software to compromise systems.",
                },
                {
                  icon: Eye,
                  title: "Data Breaches & Privacy",
                  desc: "Explore how breaches happen, the methods attackers use to steal data, and how to protect sensitive information.",
                },
                {
                  icon: Shield,
                  title: "Defense Strategies",
                  desc: "Discover best practices for network security, firewalls, encryption, and security architecture.",
                },
                {
                  icon: Lightbulb,
                  title: "Social Engineering",
                  desc: "Learn the psychological tactics attackers use beyond phishing: pretexting, baiting, quid pro quo, and manipulation.",
                },
                {
                  icon: BookOpen,
                  title: "Emerging Threats",
                  desc: "Stay informed about new attack vectors, zero-day vulnerabilities, and evolving threat landscapes.",
                },
              ].map((topic) => {
                const Icon = topic.icon;
                return (
                  <GlassCard key={topic.title}>
                    <Icon className="h-8 w-8 text-purple-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {topic.title}
                    </h3>
                    <p className="text-slate-300">{topic.desc}</p>
                  </GlassCard>
                );
              })}
            </div>
          </div>

          {/* Learning Approach */}
          <GlassCard>
            <h2 className="text-3xl font-semibold text-white mb-6">Our Learning Philosophy</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-purple-400">Practical, Not Theoretical</h3>
                <p className="text-slate-300">
                  We focus on real-world applications. Understand how attacks work so you can defend against them effectively, not just memorize definitions.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-purple-400">Case Studies & Examples</h3>
                <p className="text-slate-300">
                  Learn from documented breaches and real-world attacks. Understanding what happened and why helps you avoid the same mistakes.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-purple-400">Interconnected Knowledge</h3>
                <p className="text-slate-300">
                  Security isn&apos;t siloed. We show how different threats connect, how defenses work together, and how to build a comprehensive security mindset.
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Who Should Learn */}
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-white">Who Should Explore These Topics</h2>
            <div className="space-y-4">
              {[
                {
                  role: "Security Professionals",
                  reason: "Deepen your expertise across the security landscape and stay current with emerging threats.",
                },
                {
                  role: "IT & System Administrators",
                  reason: "Understand the threats your infrastructure faces and implement effective defense strategies.",
                },
                {
                  role: "Business Leaders",
                  reason: "Make informed decisions about security investments and understand the risks your organization faces.",
                },
                {
                  role: "Students & Learners",
                  reason: "Build foundational knowledge for a cybersecurity career or personal expertise.",
                },
                {
                  role: "Security-Conscious Individuals",
                  reason: "Understand threats beyond phishing and protect yourself across digital and physical domains.",
                },
              ].map((item) => (
                <div key={item.role} className="border-l-4 border-purple-500 pl-4 py-2">
                  <h3 className="text-lg font-semibold text-white">{item.role}</h3>
                  <p className="text-slate-300">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Example Topics Coming Soon */}
          <GlassCard>
            <h2 className="text-3xl font-semibold text-white mb-6">Topics Being Developed</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                "Introduction to Cybersecurity",
                "Network Security Fundamentals",
                "Malware Analysis & Classification",
                "Cryptography & Encryption",
                "Incident Response & Recovery",
                "Security Compliance & Regulations",
                "Cloud Security",
                "Mobile Device Security",
              ].map((topic) => (
                <div key={topic} className="p-3 rounded-lg border border-purple-500/20 bg-purple-500/5">
                  <span className="text-slate-300">{topic}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Combining Train + Learn */}
          <GlassCard className="border-purple-500/50 bg-gradient-to-r from-purple-500/10 to-transparent">
            <h2 className="text-2xl font-semibold text-white mb-4">Combine Training & Learning</h2>
            <p className="text-slate-300 mb-4">
              Use <strong>Train</strong> to build practical phishing awareness through hands-on simulations, and use <strong>Learn</strong> to understand the broader security context. Together, they create a comprehensive security education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/train"
                className="px-6 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-600 transition-colors text-center"
              >
                Go to Train
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 text-sm font-medium text-white bg-purple-700 rounded-lg hover:bg-purple-600 transition-colors text-center"
              >
                Sign Up to Explore
              </Link>
            </div>
          </GlassCard>

          {/* Back to Home */}
          <div className="text-center">
            <Link href="/" className="text-purple-400 hover:text-purple-300 transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-6 text-center text-slate-500 text-sm">
        <p>University of Arkansas - CSCE Capstone 2025</p>
        <p className="mt-1">
          Built by Team 20: Tribble, Pumford, Smith, Norden, Berrios, Olvey
        </p>
      </footer>
    </div>
  );
}
