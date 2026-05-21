"use client";

import { motion } from "framer-motion";
import { Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { easeOrganic } from "@/components/motion-primitives";

interface RoundSummaryProps {
  score: number;
  correct: number;
  total: number;
  bestStreak: number;
  badge: string | null;
  onPlayAgain: () => void;
}

const BADGE_LABELS: Record<string, string> = {
  "master-sorter": "Master Sorter",
  "perfect-sorter": "Perfect Round",
  "streak-keeper": "Streak Keeper"
};

export function RoundSummary({
  score,
  correct,
  total,
  bestStreak,
  badge,
  onPlayAgain
}: RoundSummaryProps) {
  const accuracy = Math.round((correct / total) * 100);
  const message =
    accuracy === 100
      ? "Flawless. You're sorting like a pro."
      : accuracy >= 80
      ? "Beautifully done. Your bins thank you."
      : accuracy >= 50
      ? "Good go. A few tricky ones in there. Try again?"
      : "Sorting is a habit. Keep at it. You'll get there.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: easeOrganic }}
      className="mx-auto max-w-md"
    >
      <Card className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-sage-100 border border-sage-300">
          <Trophy className="h-7 w-7 text-sage-700" />
        </div>
        <CardTitle className="text-3xl">Round complete</CardTitle>
        <p className="mt-2 text-ink-soft leading-relaxed">{message}</p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <SummaryStat label="Score" value={score.toString()} />
          <SummaryStat label="Accuracy" value={`${accuracy}%`} />
          <SummaryStat label="Best streak" value={bestStreak.toString()} />
        </div>

        {badge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 20 }}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-sun/30 border border-sun px-4 py-2 text-sm font-medium text-clay-800"
          >
            <Sparkles className="h-4 w-4" />
            Badge unlocked: {BADGE_LABELS[badge] ?? badge}
          </motion.div>
        )}

        <Button variant="primary" size="lg" className="mt-6 w-full" onClick={onPlayAgain}>
          Play again
        </Button>
      </Card>
    </motion.div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-organic bg-cream-100 border border-sage-200/70 py-3 px-2">
      <div className="text-[0.65rem] uppercase tracking-wider text-ink-muted font-medium">
        {label}
      </div>
      <div className="font-display text-2xl text-ink mt-1 tabular-nums">{value}</div>
    </div>
  );
}
