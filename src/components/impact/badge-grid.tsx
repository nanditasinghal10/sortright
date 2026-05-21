"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { driftSpring } from "@/components/motion-primitives";
import type { Badge } from "@/lib/store";
import { cn } from "@/lib/utils";

interface BadgeDef {
  id: string;
  emoji: string;
  label: string;
  blurb: string;
}

const KNOWN_BADGES: BadgeDef[] = [
  { id: "recycler-bronze", emoji: "♻️", label: "Recycler (Bronze)", blurb: "First ten correctly recycled items." },
  { id: "composter-silver", emoji: "🌱", label: "Composter (Silver)", blurb: "Twenty-five composts logged." },
  { id: "master-sorter", emoji: "🏆", label: "Master Sorter", blurb: "Sorted across every bin type." },
  { id: "daily-trio", emoji: "🌼", label: "Daily Trio", blurb: "All three of today's challenges done." },
  { id: "streak-7", emoji: "🔥", label: "Seven-Day Streak", blurb: "A full week of small wins." },
  { id: "streak-30", emoji: "🌟", label: "Thirty-Day Streak", blurb: "A month of staying with it." },
  { id: "quiz-greenhorn", emoji: "📗", label: "Quiz Greenhorn", blurb: "Passed the first quiz level." },
  { id: "quiz-sorter", emoji: "📘", label: "Quiz Sorter", blurb: "Passed the intermediate quiz." },
  { id: "quiz-master", emoji: "📕", label: "Quiz Master", blurb: "Aced the master-level quiz." }
];

function labelize(id: string) {
  return id
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

interface BadgeGridProps {
  earned: Badge[];
}

export function BadgeGrid({ earned }: BadgeGridProps) {
  const earnedMap = new Map(earned.map((b) => [b.id, b]));

  const knownIds = new Set(KNOWN_BADGES.map((b) => b.id));
  const extras: BadgeDef[] = earned
    .filter((b) => !knownIds.has(b.id))
    .map((b) => ({
      id: b.id,
      emoji: "🎖️",
      label: labelize(b.id),
      blurb: "An achievement you've unlocked."
    }));

  const all = [...KNOWN_BADGES, ...extras];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {all.map((b, i) => {
        const e = earnedMap.get(b.id);
        const unlocked = !!e;
        return (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...driftSpring, delay: i * 0.03 }}
            aria-label={`${b.label}${unlocked ? " (earned)" : " (locked)"}`}
            title={`${b.label}${unlocked ? " — earned" : " (locked)"}: ${b.blurb}`}
            className={cn(
              "rounded-organic border p-4 flex flex-col items-center text-center gap-2 shadow-soft",
              unlocked
                ? "bg-sage-50/80 border-sage-300/70"
                : "bg-cream-50/50 border-sage-200/40 grayscale opacity-60"
            )}
          >
            <span className="text-3xl relative" aria-hidden>
              {b.emoji}
              {!unlocked && (
                <span className="absolute -bottom-1 -right-1 size-4 rounded-full bg-cream-300 flex items-center justify-center">
                  <Lock className="size-2.5 text-ink-muted" strokeWidth={3} />
                </span>
              )}
            </span>
            <p className={cn("text-xs font-medium leading-tight", unlocked ? "text-ink" : "text-ink-muted")}>
              {b.label}
            </p>
            <p className="text-[10px] text-ink-muted leading-snug">{b.blurb}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

export const BADGE_IDS = KNOWN_BADGES.map((b) => b.id);
