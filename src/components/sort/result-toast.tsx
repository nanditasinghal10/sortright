"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeedbackPayload {
  correct: boolean;
  message: string;
  key: number;
}

export function ResultToast({ feedback }: { feedback: FeedbackPayload | null }) {
  return (
    <AnimatePresence>
      {feedback && (
        <motion.div
          key={feedback.key}
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 360, damping: 28 }}
          className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
          role="status"
          aria-live="polite"
        >
          <div
            className={cn(
              "pointer-events-auto max-w-md rounded-organic border-2 px-5 py-3 shadow-leaf flex items-start gap-3",
              feedback.correct
                ? "bg-sage-100 border-sage-300 text-sage-800"
                : "bg-[#FBE4E4] border-[#E8B6B6] text-[#7A2C2C]"
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                feedback.correct ? "bg-sage-700 text-cream" : "bg-berry text-cream"
              )}
              aria-hidden
            >
              {feedback.correct ? <Check className="h-4 w-4" strokeWidth={3} /> : <X className="h-4 w-4" strokeWidth={3} />}
            </span>
            <p className="text-sm leading-relaxed font-medium">{feedback.message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
