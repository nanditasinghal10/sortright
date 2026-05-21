"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useHydrated } from "@/lib/api";
import { useSortStore } from "@/lib/store";
import type { QuizLevel } from "@/lib/quiz-data";
import { fadeUp, easeOrganic } from "@/components/motion-primitives";

interface LevelCardProps {
  level: QuizLevel;
  index: number;
  onStart: (id: string) => void;
}

const TIER_ACCENT = ["bg-sage-100 text-sage-800", "bg-clay-100 text-clay-800", "bg-[#FBE4E4] text-[#7A2C2C]"];

export function LevelCard({ level, index, onStart }: LevelCardProps) {
  const hydrated = useHydrated();
  const best = useSortStore((s) => s.quizLevels[level.id]?.best ?? 0);
  const passes = useSortStore((s) => s.quizLevels[level.id]?.passes ?? 0);
  const accent = TIER_ACCENT[index] ?? TIER_ACCENT[0];

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3, ease: easeOrganic }}
      className="flex h-full flex-col rounded-organic border border-sage-200/70 bg-cream-50/80 p-7 shadow-soft"
    >
      <div className="flex items-center justify-between">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${accent}`}>
          Level {index + 1}
        </span>
        {hydrated && best > 0 && (
          <span className="text-xs text-ink-muted">Best: {best}%</span>
        )}
      </div>
      <h3 className="mt-5 font-display text-3xl text-ink tracking-tight">
        {level.title}
      </h3>
      <p className="mt-2 text-ink-soft leading-relaxed">{level.subtitle}</p>

      <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-sage-50 px-4 py-3">
          <dt className="text-ink-muted text-xs uppercase tracking-wide">Questions</dt>
          <dd className="mt-1 font-display text-xl text-ink">{level.questions.length}</dd>
        </div>
        <div className="rounded-2xl bg-sage-50 px-4 py-3">
          <dt className="text-ink-muted text-xs uppercase tracking-wide">Pass</dt>
          <dd className="mt-1 font-display text-xl text-ink">{level.passScore}%</dd>
        </div>
      </dl>

      {hydrated && passes > 0 && (
        <p className="mt-4 text-xs text-sage-700">
          Passed {passes} time{passes === 1 ? "" : "s"}. Badge earned.
        </p>
      )}

      <button
        type="button"
        onClick={() => onStart(level.id)}
        className="mt-auto inline-flex items-center justify-center gap-2 rounded-organic bg-sage-700 px-5 py-3 mt-7 font-medium text-cream shadow-leaf transition-all duration-200 hover:bg-sage-800 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
      >
        Start level
        <span aria-hidden>→</span>
      </button>
      <Link
        href="/learn"
        className="mt-3 text-center text-sm text-ink-muted hover:text-sage-700"
      >
        Brush up in the directory first
      </Link>
    </motion.div>
  );
}
