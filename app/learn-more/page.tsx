import Link from "next/link";
import { CheckCircle } from "lucide-react";

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

export default function LearnMorePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f1a] text-white">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-[#1a1a2e]/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            PhishWise
          </Link>
          <nav className="flex gap-6">
            <Link
              href="/login"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-white">
              What is PhishWise?
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              A personal phishing awareness training platform designed for
              individuals, families, and small groups.
            </p>
          </div>

          {/* Problem Section */}
          <GlassCard>
            <h2 className="text-3xl font-semibold text-white mb-4">
              The Problem
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Phishing attacks are one of the most common cybersecurity threats
              today. An estimated{" "}
              <strong className="text-blue-400">
                3.4 billion phishing emails
              </strong>{" "}
              are sent every day. While large corporations use expensive training
              platforms like KnowBe4, everyday users don&apos;t have access to
              affordable, practical tools to protect themselves.
            </p>
            <p className="text-slate-300 leading-relaxed mt-4">
              Older adults are particularly vulnerable, with the FBI reporting
              nearly 150,000 cybercrime complaints from individuals aged 60+ in
              2024, resulting in losses approaching{" "}
              <strong className="text-blue-400">$5 billion</strong>.
            </p>
          </GlassCard>

          {/* Solution Section */}
          <GlassCard>
            <h2 className="text-3xl font-semibold text-white mb-4">
              Our Solution
            </h2>
            <p className="text-slate-300 leading-relaxed">
              PhishWise sends you realistic phishing simulations based on common
              scam patterns. If you click on a simulated phishing link,
              you&apos;ll immediately:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4 mt-3">
              <li>
                Be redirected to an instant feedback page showing what you missed
              </li>
              <li>
                Receive a short training module explaining the attack type
              </li>
              <li>Learn to recognize similar threats in the future</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-4">
              Unlike quiz-based tools, PhishWise delivers real emails to your
              inbox at unpredictable times -- just like real phishing attacks.
            </p>
          </GlassCard>

          {/* How It Works Section */}
          <section className="space-y-4">
            <h2 className="text-3xl font-semibold text-white">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: "Sign Up",
                  desc: 'Create an account using Google OAuth. Join an existing "school" or create your own to manage a group.',
                },
                {
                  step: "2",
                  title: "Receive Emails",
                  desc: "Get simulated phishing emails at random intervals based on your group's training frequency.",
                },
                {
                  step: "3",
                  title: "Learn & Improve",
                  desc: "If you click a phishing link, get instant feedback and targeted training. Track your progress over time.",
                },
              ].map((item) => (
                <GlassCard key={item.step}>
                  <div className="text-4xl font-mono font-bold text-blue-400 mb-3">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-300">{item.desc}</p>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section className="space-y-4">
            <h2 className="text-3xl font-semibold text-white">Features</h2>
            <div className="space-y-3">
              {[
                {
                  title: "Realistic Simulations",
                  desc: "Emails based on real-world phishing tactics and social engineering techniques",
                },
                {
                  title: "Instant Feedback",
                  desc: "Learn immediately what red flags you missed when you fail a simulation",
                },
                {
                  title: "Progress Tracking",
                  desc: "Monitor your improvement over time with detailed analytics dashboards",
                },
                {
                  title: "Group Management",
                  desc: 'Create "schools" to train family members or small teams together',
                },
              ].map((feature) => (
                <div key={feature.title} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-medium text-white">
                      {feature.title}
                    </h3>
                    <p className="text-slate-300">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Who It's For Section */}
          <GlassCard>
            <h2 className="text-3xl font-semibold text-white mb-4">
              Who It&apos;s For
            </h2>
            <p className="text-slate-300 leading-relaxed">
              PhishWise is designed for anyone who wants to improve their
              cybersecurity awareness:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4 mt-3">
              <li>Individuals concerned about online scams</li>
              <li>Families wanting to protect older relatives</li>
              <li>Small businesses without enterprise security budgets</li>
              <li>Students learning about cybersecurity</li>
              <li>Anyone who&apos;s been affected by phishing before</li>
            </ul>
          </GlassCard>

          {/* CTA Section */}
          <section className="text-center space-y-6 py-8">
            <h2 className="text-3xl font-semibold text-white">
              Ready to Get Started?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-4 text-lg font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.35)] transition-all duration-200"
              >
                Sign Up Now
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 text-lg font-medium text-white border-2 border-white/20 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                Log In
              </Link>
            </div>
          </section>
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
