import Link from "next/link";

export default function LearnMorePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-700 bg-phish-navy/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-300">
            PhishWise
          </Link>
          <nav className="flex gap-6">
            <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
              Log In
            </Link>
            <Link href="/signup" className="text-gray-300 hover:text-white transition-colors">
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
            <h1 className="text-5xl font-bold text-gray-200">
              What is PhishWise?
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              A personal phishing awareness training platform designed for individuals, 
              families, and small groups.
            </p>
          </div>

          {/* Problem Section */}
          <section className="space-y-4">
            <h2 className="text-3xl font-semibold text-gray-300">The Problem</h2>
            <p className="text-gray-400 leading-relaxed">
              Phishing attacks are one of the most common cybersecurity threats today. 
              An estimated <strong className="text-white">3.4 billion phishing emails</strong> are 
              sent every day. While large corporations use expensive training platforms like 
              KnowBe4, everyday users don&apos;t have access to affordable, practical tools to
              protect themselves.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Older adults are particularly vulnerable, with the FBI reporting nearly 150,000 
              cybercrime complaints from individuals aged 60+ in 2024, resulting in losses 
              approaching <strong className="text-white">$5 billion</strong>.
            </p>
          </section>

          {/* Solution Section */}
          <section className="space-y-4">
            <h2 className="text-3xl font-semibold text-gray-300">Our Solution</h2>
            <p className="text-gray-400 leading-relaxed">
              PhishWise sends you realistic phishing simulations based on common scam patterns. 
              If you click on a simulated phishing link, you&apos;ll immediately:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4">
              <li>Be redirected to an instant feedback page showing what you missed</li>
              <li>Receive a short training module explaining the attack type</li>
              <li>Learn to recognize similar threats in the future</li>
            </ul>
            <p className="text-gray-400 leading-relaxed mt-4">
              Unlike quiz-based tools, PhishWise delivers real emails to your inbox at 
              unpredictable times—just like real phishing attacks.
            </p>
          </section>

          {/* How It Works Section */}
          <section className="space-y-4">
            <h2 className="text-3xl font-semibold text-gray-300">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-phish-blue/20 p-6 rounded-lg border border-gray-700">
                <div className="text-4xl font-bold text-phish-accent mb-3">1</div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Sign Up</h3>
                <p className="text-gray-400">
                  Create an account using Google OAuth. Join an existing &ldquo;school&rdquo; or
                  create your own to manage a group.
                </p>
              </div>
              
              <div className="bg-phish-blue/20 p-6 rounded-lg border border-gray-700">
                <div className="text-4xl font-bold text-phish-accent mb-3">2</div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Receive Emails</h3>
                <p className="text-gray-400">
                  Get simulated phishing emails at random intervals based on your 
                  group&apos;s training frequency.
                </p>
              </div>
              
              <div className="bg-phish-blue/20 p-6 rounded-lg border border-gray-700">
                <div className="text-4xl font-bold text-phish-accent mb-3">3</div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Learn & Improve</h3>
                <p className="text-gray-400">
                  If you click a phishing link, get instant feedback and targeted 
                  training. Track your progress over time.
                </p>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="space-y-4">
            <h2 className="text-3xl font-semibold text-gray-300">Features</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-phish-accent mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-lg font-medium text-gray-300">Realistic Simulations</h3>
                  <p className="text-gray-400">
                    Emails based on real-world phishing tactics and social engineering techniques
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-phish-accent mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-lg font-medium text-gray-300">Instant Feedback</h3>
                  <p className="text-gray-400">
                    Learn immediately what red flags you missed when you fail a simulation
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-phish-accent mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-lg font-medium text-gray-300">Progress Tracking</h3>
                  <p className="text-gray-400">
                    Monitor your improvement over time with detailed analytics dashboards
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-phish-accent mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-lg font-medium text-gray-300">Group Management</h3>
                  <p className="text-gray-400">
                    Create &ldquo;schools&rdquo; to train family members or small teams together
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Who It's For Section */}
          <section className="space-y-4">
            <h2 className="text-3xl font-semibold text-gray-300">Who It&apos;s For</h2>
            <p className="text-gray-400 leading-relaxed">
              PhishWise is designed for anyone who wants to improve their cybersecurity awareness:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4">
              <li>Individuals concerned about online scams</li>
              <li>Families wanting to protect older relatives</li>
              <li>Small businesses without enterprise security budgets</li>
              <li>Students learning about cybersecurity</li>
              <li>Anyone who&apos;s been affected by phishing before</li>
            </ul>
          </section>

          {/* CTA Section */}
          <section className="text-center space-y-6 py-8">
            <h2 className="text-3xl font-semibold text-gray-300">Ready to Get Started?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-4 text-lg font-medium text-white bg-phish-accent rounded-lg hover:bg-phish-accent/80 transition-all duration-200"
              >
                Sign Up Now
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 text-lg font-medium text-white border-2 border-gray-400 rounded-lg hover:bg-white hover:text-phish-navy transition-all duration-200"
              >
                Log In
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700 py-6 text-center text-gray-500 text-sm">
        <p>University of Arkansas - CSCE Capstone 2025</p>
        <p className="mt-1">Built by Team 20: Tribble, Pumford, Smith, Norden, Berrios, Olvey</p>
      </footer>
    </div>
  );
}