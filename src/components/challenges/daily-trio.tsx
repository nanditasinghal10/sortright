"use client";

import { motion } from "framer-motion";
import { driftSpring } from "@/components/motion-primitives";
import { ChallengeCard } from "./challenge-card";
import type { Challenge } from "@/lib/challenges-data";

interface DailyTrioProps {
  challenges: Challenge[];
  doneIds: Set<string>;
  onComplete: (id: string) => void;
}

export function DailyTrio({ challenges, doneIds, onComplete }: DailyTrioProps) {
  const completedCount = challenges.filter((c) => doneIds.has(c.id)).length;

  return (
    <section aria-labelledby="today-heading" className="mt-10">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 id="today-heading" className="font-display text-2xl text-ink">
            Today
          </h2>
          <p className="text-ink-soft text-sm mt-1">
            {completedCount === 3
              ? "All three done. The whole streak just got brighter."
              : completedCount > 0
                ? `${completedCount} of 3 done. Keep the rhythm.`
                : "Three small wins, hand-picked for you."}
          </p>
        </div>
        <div
          className="hidden sm:flex items-center gap-1.5"
          aria-label={`${completedCount} of 3 completed`}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ scale: i < completedCount ? 1.1 : 1 }}
              transition={driftSpring}
              className={`size-2.5 rounded-full ${i < completedCount ? "bg-sage-600" : "bg-sage-200"}`}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {challenges.map((c) => (
          <ChallengeCard
            key={c.id}
            challenge={c}
            done={doneIds.has(c.id)}
            onComplete={onComplete}
          />
        ))}
      </div>
    </section>
  );
}
