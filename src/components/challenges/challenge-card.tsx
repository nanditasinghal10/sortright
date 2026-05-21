"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { driftSpring, easeOrganic } from "@/components/motion-primitives";
import { AREA_EMOJI, AREA_LABEL, type Challenge } from "@/lib/challenges-data";
import { cn } from "@/lib/utils";

interface ChallengeCardProps {
  challenge: Challenge;
  done: boolean;
  onComplete: (id: string) => void;
  ctaLabel?: string;
}

export function ChallengeCard({ challenge, done, onComplete, ctaLabel = "Mark as done" }: ChallengeCardProps) {
  const dots = Array.from({ length: 3 }, (_, i) => i < challenge.difficulty);

  return (
    <motion.div
      layout
      transition={driftSpring}
      className={cn(
        "relative rounded-organic border bg-cream-50/80 p-6 shadow-soft overflow-hidden flex flex-col",
        done ? "border-sage-400/70 bg-sage-50/80" : "border-sage-200/70"
      )}
    >
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: easeOrganic }}
            className="flex flex-col items-center justify-center text-center py-6 gap-3"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -10, 0] }}
              transition={{ ...driftSpring, delay: 0.05 }}
              className="size-14 rounded-full bg-sage-600 text-cream flex items-center justify-center shadow-leaf"
              aria-hidden
            >
              <Check className="size-7" strokeWidth={3} />
            </motion.div>
            <div>
              <p className="font-display text-xl text-ink">Nice one.</p>
              <p className="text-sm text-ink-soft mt-1">{challenge.title}</p>
              <p className="text-xs text-sage-700 mt-2 font-medium">+{challenge.reward} points earned</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="open"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4 h-full"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-4xl" aria-hidden>{challenge.emoji}</span>
              <Badge aria-label={`Area: ${AREA_LABEL[challenge.area]}`}>
                <span aria-hidden>{AREA_EMOJI[challenge.area]}</span> {AREA_LABEL[challenge.area]}
              </Badge>
            </div>

            <div className="flex-1">
              <h3 className="font-display text-xl text-ink leading-snug">{challenge.title}</h3>
              <p className="text-ink-soft text-sm mt-2 leading-relaxed">{challenge.blurb}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-ink-muted">
              <div className="flex items-center gap-1.5" aria-label={`Difficulty ${challenge.difficulty} of 3`}>
                {dots.map((on, i) => (
                  <span
                    key={i}
                    className={cn("size-1.5 rounded-full", on ? "bg-clay-500" : "bg-sage-200")}
                    aria-hidden
                  />
                ))}
                <span className="ml-1">~{challenge.estMinutes} min</span>
              </div>
              <span className="font-medium text-sage-700">+{challenge.reward} pts</span>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => onComplete(challenge.id)}
              aria-label={`${ctaLabel}: ${challenge.title}`}
              className="w-full"
            >
              {ctaLabel}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
