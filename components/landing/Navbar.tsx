"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-white/10 bg-black/40 backdrop-blur-md"
          : "bg-black/40 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.jpg"
            alt="PhishWise"
            width={36}
            height={36}
            className="h-9 w-auto"
          />
          <span className="text-lg font-bold text-gray-200">PhishWise</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#faq"
            className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
          >
            FAQ
          </a>
        </div>

        {/* Desktop CTA Button */}
        <div className="hidden md:block">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors"
          >
            Log In / Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-400 hover:text-gray-200"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/80 backdrop-blur-md">
          <div className="px-6 py-4 space-y-4">
            <a
              href="#features"
              className="block text-sm text-gray-400 hover:text-gray-200 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block text-sm text-gray-400 hover:text-gray-200 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#faq"
              className="block text-sm text-gray-400 hover:text-gray-200 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              FAQ
            </a>
            <Link
              href="/login"
              className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Log In / Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
