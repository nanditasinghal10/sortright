"use client";

import { motion } from "framer-motion";
import { easeOrganic } from "@/components/motion-primitives";

interface QuizProgressProps {
  current: number;
  total: number;
}

export function QuizProgress({ current, total }: QuizProgressProps) {
  const pct = Math.min(100, Math.round((current / total) * 100));
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-medium text-ink-muted">
        <span>
          Question {current} of {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-sage-100">
        <motion.div
          className="h-full rounded-full bg-sage-600"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: easeOrganic }}
        />
      </div>
    </div>
  );
}
