"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronDown, Flame, Sparkles } from "lucide-react";
import { useSortStore } from "@/lib/store";
import { useHydrated } from "@/lib/api";
import { SortRightMark } from "@/components/brand/sortright-mark";

type NavItem = { href: string; label: string };

const PRIMARY_NAV: NavItem[] = [
  { href: "/sort", label: "Sort" },
  { href: "/identify", label: "Snap" },
  { href: "/locate", label: "Locate" },
  { href: "/challenges", label: "Challenges" }
];

const LEARN_NAV: { href: string; label: string; desc: string }[] = [
  { href: "/learn", label: "Learn the basics", desc: "What goes where, why it matters" },
  { href: "/quiz", label: "Take the quiz", desc: "Test what you know" },
  { href: "/sustainable-living", label: "Live sustainably", desc: "Small daily habits" }
];

const MOBILE_NAV: NavItem[] = [
  ...PRIMARY_NAV,
  { href: "/learn", label: "Learn" },
  { href: "/quiz", label: "Quiz" },
  { href: "/sustainable-living", label: "Live sustainably" },
  { href: "/impact", label: "Impact" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const totalScore = useSortStore((s) => s.totalScore);
  const highestStreak = useSortStore((s) => s.highestStreak);
  const score = hydrated ? totalScore : 0;
  const streak = hydrated ? highestStreak : 0;

  const [learnOpen, setLearnOpen] = useState(false);
  const learnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!learnOpen) return;
    function onDoc(e: MouseEvent) {
      if (learnRef.current && !learnRef.current.contains(e.target as Node)) {
        setLearnOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLearnOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [learnOpen]);

  useEffect(() => {
    setLearnOpen(false);
  }, [pathname]);

  const learnActive = LEARN_NAV.some((i) => pathname?.startsWith(i.href));

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <header className="z-20 sticky top-0 backdrop-blur-md bg-cream/70 border-b border-sage-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 group shrink-0"
          aria-label="SortRight home"
          title="SortRight — sort waste, live light"
        >
          <motion.span
            initial={{ rotate: -6 }}
            animate={{ rotate: [-6, 4, -6] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="grid place-items-center h-9 w-9 rounded-full bg-sage-200 shadow-soft"
          >
            <SortRightMark className="h-5 w-5" />
          </motion.span>
          <span className="font-display text-xl tracking-tight">
            Sort<span className="text-sage-700">Right</span>
          </span>
        </Link>

        <nav className="hidden lg:flex flex-1 items-center justify-evenly" aria-label="Primary">
          {PRIMARY_NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative px-3.5 py-2 text-sm rounded-full whitespace-nowrap transition-colors",
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

          <div className="relative" ref={learnRef}>
            <button
              type="button"
              onClick={() => setLearnOpen((o) => !o)}
              aria-expanded={learnOpen}
              aria-haspopup="menu"
              className={cn(
                "relative inline-flex items-center gap-1 px-3.5 py-2 text-sm rounded-full whitespace-nowrap transition-colors",
                learnActive ? "text-sage-900" : "text-ink-soft hover:text-ink"
              )}
            >
              {learnActive && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-sage-200/70"
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                />
              )}
              <span className="relative">Learn</span>
              <ChevronDown
                className={cn(
                  "relative h-3.5 w-3.5 transition-transform",
                  learnOpen ? "rotate-180" : ""
                )}
                aria-hidden
              />
            </button>
            <AnimatePresence>
              {learnOpen && (
                <motion.div
                  role="menu"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-full left-0 mt-2 w-72 rounded-organic border border-sage-200 bg-cream shadow-leaf p-2 z-30"
                >
                  {LEARN_NAV.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        role="menuitem"
                        className={cn(
                          "flex flex-col gap-0.5 px-3 py-2.5 rounded-xl transition-colors",
                          active
                            ? "bg-sage-100 text-sage-900"
                            : "text-ink hover:bg-sage-100/70"
                        )}
                      >
                        <span className="text-sm font-medium">{item.label}</span>
                        <span className="text-[11.5px] text-ink-muted leading-snug">
                          {item.desc}
                        </span>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="flex items-center gap-2 shrink-0 ml-auto lg:ml-0">
          <Link
            href="/impact"
            aria-label={`Your impact: ${score} points, best streak ${streak}`}
            title={`${score} total points · best streak ${streak} day${streak === 1 ? "" : "s"}`}
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-sage-300/70 bg-sage-50/80 hover:bg-sage-100/80 px-3 h-10 text-sm transition"
          >
            <span
              className="inline-flex items-center gap-1 text-sage-800"
              title="Total points earned"
            >
              <Sparkles className="h-3.5 w-3.5 text-clay-500" aria-hidden />
              <span className="font-medium tabular-nums">{score}</span>
            </span>
            <span className="h-3 w-px bg-sage-300/80" />
            <span
              className="inline-flex items-center gap-1 text-sage-800"
              title="Best streak ever"
            >
              <Flame
                className={cn(
                  "h-3.5 w-3.5",
                  streak > 0 ? "text-clay-500" : "text-ink-muted"
                )}
                aria-hidden
              />
              <span className="font-medium tabular-nums">{streak}</span>
            </span>
          </Link>
          <Link
            href="/sort"
            title="Jump into the sort game"
            className="inline-flex items-center gap-2 rounded-full bg-sage-700 hover:bg-sage-800 text-cream px-4 h-10 text-sm font-medium whitespace-nowrap shadow-leaf transition"
          >
            Start sorting
          </Link>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="lg:hidden border-t border-sage-200/60 overflow-x-auto">
        <div className="flex gap-1 px-4 py-2 min-w-max">
          {MOBILE_NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors",
                  active
                    ? "bg-sage-200/80 text-sage-900"
                    : "text-ink-soft hover:bg-sage-100/60"
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
