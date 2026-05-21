"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Flame } from "lucide-react";

interface ScoreBarProps {
  score: number;
  streak: number;
  highStreak: number;
  remaining: number;
  total: number;
}

function AnimatedNumber({ value }: { value: number }) {
  return (
    <span className="relative inline-block tabular-nums">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="inline-block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function ScoreBar({ score, streak, highStreak, remaining, total }: ScoreBarProps) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 rounded-organic bg-cream-50/80 border border-sage-200/70 p-3 shadow-soft">
      <Stat
        label="Score"
        title="Total points earned across all rounds"
        value={<AnimatedNumber value={score} />}
      />
      <Stat
        label="Streak"
        title="Correct sorts in a row this round"
        value={
          <span className="flex items-center gap-1">
            <Flame
              className={`h-4 w-4 ${streak > 0 ? "text-clay-500" : "text-ink-muted"}`}
              fill={streak > 0 ? "currentColor" : "none"}
            />
            <AnimatedNumber value={streak} />
          </span>
        }
      />
      <Stat
        label="Best"
        title="Your highest streak ever"
        value={<AnimatedNumber value={highStreak} />}
      />
      <Stat
        label="Left"
        title="Items remaining in this round"
        value={
          <span className="tabular-nums">
            {remaining}
            <span className="text-ink-muted text-sm">/{total}</span>
          </span>
        }
      />
    </div>
  );
}

function Stat({
  label,
  value,
  title
}: {
  label: string;
  value: React.ReactNode;
  title?: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-0.5"
      title={title}
    >
      <span className="text-[0.65rem] uppercase tracking-wider text-ink-muted font-medium">
        {label}
      </span>
      <span className="font-display text-lg sm:text-xl text-ink">{value}</span>
    </div>
  );
}
