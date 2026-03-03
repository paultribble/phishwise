import Link from "next/link";
import Image from "next/image";
import { bebas, playfair } from "@/lib/fonts";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Branding */}
          <div className="space-y-12">
            <div className="flex items-end gap-4">
              <Image
                src="/logo.webp"
                alt="PhishWise shield"
                width={100}
                height={100}
                className="object-contain"
              />
              <h1 className={`text-7xl lg:text-8xl font-bold tracking-tight leading-none ${bebas.className}`}>
                <span className="text-gray-200">PHISH</span>
                <br />
                <span className={`text-gray-300 italic ${playfair.className}`}>WISE</span>
              </h1>
            </div>
            
            <div className="space-y-3">
              <p className="text-2xl lg:text-3xl text-gray-300 font-light">
                Prepare Today.
              </p>
              <p className="text-2xl lg:text-3xl text-gray-300 font-light">
                Prevent Tomorrow.
              </p>
            </div>
          </div>

          {/* Right Side - Action Buttons */}
          <div className="flex flex-col items-center lg:items-end space-y-5">
            <Link
              href="/signup"
              className="w-full max-w-xs px-10 py-4 text-center text-lg font-medium tracking-wider text-white border-2 border-gray-500 rounded-md hover:bg-white hover:text-phish-navy hover:border-white transition-all duration-200"
            >
              SIGN UP
            </Link>
            
            <Link
              href="/login"
              className="w-full max-w-xs px-10 py-4 text-center text-lg font-medium tracking-wider text-white border-2 border-gray-500 rounded-md hover:bg-white hover:text-phish-navy hover:border-white transition-all duration-200"
            >
              LOG IN
            </Link>
            
            <Link
              href="/learn-more"
              className="w-full max-w-xs px-10 py-4 text-center text-lg font-medium tracking-wider text-white border-2 border-gray-500 rounded-md hover:bg-white hover:text-phish-navy hover:border-white transition-all duration-200"
            >
              LEARN MORE
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-600 text-sm">
        <p>University of Arkansas - CSCE Capstone 2025</p>
      </footer>
    </div>
  );
}
