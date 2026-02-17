"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Shield,
  LayoutDashboard,
  Users,
  BookOpen,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const userNav = [
  { label: "Dashboard", href: "/dashboard/user", icon: LayoutDashboard },
  { label: "Training", href: "/dashboard/user/training", icon: BookOpen },
];

const managerNav = [
  { label: "Overview", href: "/dashboard/manager", icon: LayoutDashboard },
  { label: "Users", href: "/dashboard/manager/users", icon: Users },
  { label: "Training", href: "/dashboard/manager/training", icon: BookOpen },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isManager =
    session?.user?.role === "MANAGER" || session?.user?.role === "ADMIN";
  const navItems = isManager ? managerNav : userNav;

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-700 bg-phish-navy/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary-500" />
          <span className="text-xl font-bold text-gray-200">PhishWise</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" role="navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-500/10 text-primary-400"
                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User menu */}
        <div className="flex items-center gap-3">
          {session?.user && (
            <div className="hidden items-center gap-3 md:flex">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user.image ?? undefined} />
                <AvatarFallback className="bg-primary-800 text-xs text-white">
                  {initials ?? "U"}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-gray-400 transition-colors hover:text-gray-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Sign out</span>
              </button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-md p-2 text-gray-400 hover:text-gray-200 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t border-gray-700 px-4 py-3 md:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-500/10 text-primary-400"
                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          {session?.user && (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-400 hover:text-gray-200"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          )}
        </nav>
      )}
    </header>
  );
}
