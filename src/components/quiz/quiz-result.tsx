"use client";

import { motion } from "framer-motion";
import { Award, RotateCw, ArrowRight } from "lucide-react";
import type { QuizLevel } from "@/lib/quiz-data";
import { fadeUp, stagger, easeOrganic } from "@/components/motion-primitives";

interface QuizResultProps {
  level: QuizLevel;
  score: number;
  passed: boolean;
  onRetake: () => void;
  onBackToLevels: () => void;
  nextLevel?: QuizLevel;
  onNextLevel?: () => void;
}

const PASS_COPY = [
  "Sorted. Your bins are lucky to have you.",
  "Crisp work. That's a real-world recycler.",
  "Mastery looks calm, careful, and well-rinsed."
];

const FAIL_COPY = [
  "Close. The trickiest items earn their reputation.",
  "A solid try. Sorting is a skill, not a vibe.",
  "One more pass. The directory has your back."
];

export function QuizResult({
  level,
  score,
  passed,
  onRetake,
  onBackToLevels,
  nextLevel,
  onNextLevel
}: QuizResultProps) {
  const copy = passed
    ? PASS_COPY[Math.floor(Math.random() * PASS_COPY.length)]
    : FAIL_COPY[Math.floor(Math.random() * FAIL_COPY.length)];

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={stagger}
      className="rounded-organic border border-sage-200/70 bg-cream-50/80 p-8 md:p-12 shadow-soft text-center"
    >
      <motion.div variants={fadeUp} className="flex justify-center">
        <motion.div
          initial={{ scale: 0.6, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: easeOrganic }}
          className={`flex h-24 w-24 items-center justify-center rounded-full ${
            passed ? "bg-sage-200" : "bg-clay-100"
          }`}
        >
          <Award
            className={`h-12 w-12 ${passed ? "text-sage-800" : "text-clay-700"}`}
            aria-hidden
          />
        </motion.div>
      </motion.div>

      <motion.p
        variants={fadeUp}
        className="mt-6 text-sm uppercase tracking-[0.18em] text-sage-700 font-medium"
      >
        {level.title} · {passed ? "Passed" : "Try again"}
      </motion.p>
      <motion.h2
        variants={fadeUp}
        className="mt-3 font-display text-5xl md:text-6xl text-ink tracking-tight"
      >
        {score}%
      </motion.h2>
      <motion.p
        variants={fadeUp}
        className="mt-3 text-ink-muted text-sm"
      >
        Pass mark: {level.passScore}%
      </motion.p>
      <motion.p
        variants={fadeUp}
        className="mx-auto mt-6 max-w-md text-lg text-ink-soft leading-relaxed"
      >
        {copy}
      </motion.p>

      {passed && (
        <motion.div
          variants={fadeUp}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-sage-300 bg-sage-50 px-4 py-1.5 text-sm font-medium text-sage-800"
        >
          <Award className="h-4 w-4" aria-hidden />
          Badge earned: {level.badge}
        </motion.div>
      )}

      <motion.div
        variants={fadeUp}
        className="mt-10 flex flex-wrap items-center justify-center gap-3"
      >
        <button
          type="button"
          onClick={onRetake}
          className="inline-flex items-center gap-2 rounded-organic border-2 border-sage-700 px-5 py-3 text-sm font-medium text-sage-800 transition-colors hover:bg-sage-100/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          <RotateCw className="h-4 w-4" aria-hidden />
          Retake this level
        </button>
        {passed && nextLevel && onNextLevel ? (
          <button
            type="button"
            onClick={onNextLevel}
            className="inline-flex items-center gap-2 rounded-organic bg-sage-700 px-5 py-3 text-sm font-medium text-cream shadow-leaf transition-colors hover:bg-sage-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            Try a harder level
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        ) : (
          <button
            type="button"
            onClick={onBackToLevels}
            className="inline-flex items-center gap-2 rounded-organic bg-sage-700 px-5 py-3 text-sm font-medium text-cream shadow-leaf transition-colors hover:bg-sage-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            Back to levels
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
