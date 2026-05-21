"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Leaf } from "lucide-react";

const NAV = [
  { href: "/sort", label: "Sort game" },
  { href: "/learn", label: "Learn" },
  { href: "/quiz", label: "Quiz" },
  { href: "/locate", label: "Find drop-off" },
  { href: "/challenges", label: "Challenges" },
  { href: "/impact", label: "Impact" },
  { href: "/sustainable-living", label: "Live sustainably" }
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="z-20 sticky top-0 backdrop-blur-md bg-cream/70 border-b border-sage-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="SortRight home"
        >
          <motion.span
            initial={{ rotate: -8 }}
            animate={{ rotate: [-8, 6, -8] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="grid place-items-center h-9 w-9 rounded-full bg-sage-200 text-sage-800 shadow-soft"
          >
            <Leaf className="h-5 w-5" />
          </motion.span>
          <span className="font-display text-xl tracking-tight">
            Sort<span className="text-sage-700">Right</span>
          </span>
        </Link>
        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-3 py-2 text-sm rounded-full transition-colors",
                  active ? "text-sage-900" : "text-ink-soft hover:text-ink"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-sage-200/70"
                    transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/sort"
            className="inline-flex items-center gap-2 rounded-full bg-sage-700 hover:bg-sage-800 text-cream px-4 h-10 text-sm font-medium shadow-leaf transition"
          >
            Start sorting
          </Link>
        </div>
      </div>
      {/* Mobile nav row */}
      <div className="lg:hidden border-t border-sage-200/60 overflow-x-auto">
        <div className="flex gap-1 px-4 py-2 min-w-max">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors",
                  active ? "bg-sage-200/80 text-sage-900" : "text-ink-soft hover:bg-sage-100/60"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
