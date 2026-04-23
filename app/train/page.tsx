import Link from "next/link";
import { CheckCircle, AlertTriangle, TrendingUp, Users } from "lucide-react";

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

export default function TrainPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f1a] text-white">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-[#1a1a2e]/60 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            PhishWise
          </Link>
          <nav className="flex gap-6">
            <Link href="/learn" className="text-slate-300 hover:text-white transition-colors">
              Learn
            </Link>
            <Link href="/login" className="text-slate-300 hover:text-white transition-colors">
              Log In
            </Link>
            <Link href="/signup" className="text-white bg-blue-700 px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
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
              Train Your Team
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Combat the most common cybersecurity threat: phishing attacks. With realistic simulations, you&apos;ll learn to spot and avoid them before real attackers strike.
            </p>
          </div>

          {/* The Problem */}
          <GlassCard>
            <h2 className="text-3xl font-semibold text-white mb-4">
              Why Phishing Awareness Matters
            </h2>
            <div className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                Phishing remains the #1 cybersecurity vulnerability. An estimated <strong className="text-blue-400">3.4 billion phishing emails</strong> are sent every day, and organizations are <strong className="text-blue-400">91% more likely</strong> to be breached through phishing attacks.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Unlike other security threats that require sophisticated technical knowledge to exploit, phishing works by manipulating human psychology. A single click from an untrained employee can compromise your entire organization.
              </p>
            </div>
          </GlassCard>

          {/* How It Works */}
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-white">How PhishWise Training Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: AlertTriangle,
                  title: "Realistic Simulations",
                  desc: "Receive genuine-looking phishing emails that test your ability to identify threats in real-world conditions.",
                },
                {
                  icon: TrendingUp,
                  title: "Instant Feedback",
                  desc: "If you click a malicious link, get immediate feedback explaining what red flags you missed and why the email was dangerous.",
                },
                {
                  icon: CheckCircle,
                  title: "Targeted Learning",
                  desc: "Receive short, focused training modules that address the specific attack type you fell for, cementing your new knowledge.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <GlassCard key={item.title}>
                    <Icon className="h-8 w-8 text-blue-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-300">{item.desc}</p>
                  </GlassCard>
                );
              })}
            </div>
          </div>

          {/* Features */}
          <GlassCard>
            <h2 className="text-3xl font-semibold text-white mb-6">What You&apos;ll Get</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Simulations based on real attack patterns",
                "Randomized send times (just like real phishing)",
                "Progress dashboards to track improvement",
                "Group management for teams & families",
                "Common scam awareness training",
                "Performance analytics & leaderboards",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Who It's For */}
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-white">Who Should Train</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: Users,
                  title: "Teams & Organizations",
                  desc: "Managers can create schools to train their teams, track progress, and identify at-risk members for additional support.",
                },
                {
                  icon: AlertTriangle,
                  title: "Families & Individuals",
                  desc: "Protect yourself and your loved ones by learning to recognize phishing attempts before they cause damage.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <GlassCard key={item.title}>
                    <Icon className="h-8 w-8 text-blue-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-300">{item.desc}</p>
                  </GlassCard>
                );
              })}
            </div>
          </div>

          {/* Common Scams Covered */}
          <GlassCard>
            <h2 className="text-3xl font-semibold text-white mb-6">Common Scams You&apos;ll Learn to Spot</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Account verification requests",
                "Password reset phishing",
                "Invoice & payment fraud",
                "CEO fraud & impersonation",
                "Credential harvesting",
                "Urgent action requests",
              ].map((scam) => (
                <div key={scam} className="flex items-start gap-3 p-4 rounded-lg border border-blue-500/20 bg-blue-500/5">
                  <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300 font-medium">{scam}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* CTA Section */}
          <section className="text-center space-y-6 py-8">
            <h2 className="text-3xl font-semibold text-white">
              Ready to Build a Phishing-Resistant Team?
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Start your training journey today. Create a school, invite your team, and begin receiving simulations immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-4 text-lg font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.35)] transition-all duration-200"
              >
                Get Started Now
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 text-lg font-medium text-white border-2 border-white/20 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                Already Have an Account?
              </Link>
            </div>
          </section>

          {/* Back to Home */}
          <div className="text-center">
            <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
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
