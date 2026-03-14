import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-gray-700 bg-black/40">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Logo & Tagline */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.webp"
                alt="PhishWise"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <span className="font-bold text-gray-200">PhishWise</span>
            </div>
            <p className="text-sm text-gray-400">
              Security awareness training that actually works.
            </p>
          </div>

          {/* Page Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
                >
                  Log In
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <p className="text-sm text-gray-500 text-center">
            © 2025 PhishWise. Built by Team 20 at University of Arkansas.
          </p>
        </div>
      </div>
    </footer>
  );
}
