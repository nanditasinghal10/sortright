"use client";

import { motion } from "framer-motion";
import { Flame, Trophy } from "lucide-react";
import { driftSpring } from "@/components/motion-primitives";

interface StreakBannerProps {
  current: number;
  highest: number;
  hydrated: boolean;
}

function streakCopy(n: number) {
  if (n <= 0) return "Plant the first seed today.";
  if (n === 1) return "Day one. The hardest one.";
  if (n < 4) return `You're ${n} days deep. A habit's forming.`;
  if (n < 7) return `${n} days strong. Keep the rhythm going.`;
  if (n < 14) return `A whole week-plus. ${n} days and counting.`;
  if (n < 30) return `${n} days. You're not playing around.`;
  return `${n} days. You've made this who you are.`;
}

export function StreakBanner({ current, highest, hydrated }: StreakBannerProps) {
  const display = hydrated ? current : 0;
  const pr = hydrated ? highest : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={driftSpring}
      className="rounded-organic border border-clay-200 bg-clay-50/80 shadow-soft p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5"
    >
      <div className="flex items-center gap-4">
        <motion.div
          animate={{ rotate: [0, -6, 6, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="size-14 rounded-full bg-clay-400/80 flex items-center justify-center shadow-leaf"
          aria-hidden
        >
          <Flame className="size-7 text-clay-800" />
        </motion.div>
        <div>
          <div className="flex items-baseline gap-2">
            <motion.span
              key={display}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={driftSpring}
              className="font-display text-4xl text-ink leading-none"
            >
              {display}
            </motion.span>
            <span className="text-ink-soft text-sm">day streak</span>
          </div>
          <p className="text-sm text-ink-soft mt-1">{streakCopy(display)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-clay-800 sm:flex-col sm:items-end sm:gap-0">
        <Trophy className="size-4" aria-hidden />
        <div className="sm:text-right">
          <span className="font-medium">PR: {pr}</span>
          <span className="text-ink-muted ml-1.5 sm:block sm:ml-0 sm:text-xs">your best run</span>
        </div>
      </div>
    </motion.div>
  );
}
