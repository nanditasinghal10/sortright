"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getItem } from "@/lib/items";
import type { QuizQuestion } from "@/lib/quiz-data";
import { easeOrganic } from "@/components/motion-primitives";

interface QuizQuestionViewProps {
  question: QuizQuestion;
  selected: number | null;
  onSelect: (idx: number) => void;
  onNext: () => void;
  isLast: boolean;
}

export function QuizQuestionView({
  question,
  selected,
  onSelect,
  onNext,
  isLast
}: QuizQuestionViewProps) {
  const item = question.itemId ? getItem(question.itemId) : undefined;
  const answered = selected !== null;
  const isCorrect = selected === question.correctIndex;

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: easeOrganic }}
      className="rounded-organic border border-sage-200/70 bg-cream-50/80 p-7 md:p-9 shadow-soft"
    >
      {item && (
        <div className="mb-5 inline-flex items-center gap-3 rounded-full bg-sage-50 px-4 py-2">
          <span className="text-2xl" aria-hidden>
            {item.emoji}
          </span>
          <span className="text-sm font-medium text-sage-800">{item.name}</span>
        </div>
      )}

      <h2 className="font-display text-3xl text-ink tracking-tight leading-snug">
        {question.prompt}
      </h2>

      <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {question.options.map((opt, idx) => {
          const isPicked = selected === idx;
          const isAnswerKey = idx === question.correctIndex;
          const showCorrect = answered && isAnswerKey;
          const showWrong = answered && isPicked && !isAnswerKey;
          return (
            <button
              key={idx}
              type="button"
              disabled={answered}
              onClick={() => onSelect(idx)}
              aria-pressed={isPicked}
              className={cn(
                "group flex items-center justify-between gap-3 rounded-organic border-2 px-5 py-4 text-left text-base transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
                !answered &&
                  "border-sage-200 bg-cream-50 text-ink hover:-translate-y-0.5 hover:border-sage-400 hover:shadow-soft",
                showCorrect && "border-sage-500 bg-sage-100 text-sage-900",
                showWrong && "border-berry bg-[#FBE4E4] text-[#7A2C2C]",
                answered &&
                  !showCorrect &&
                  !showWrong &&
                  "border-sage-100 bg-cream-50 text-ink-muted opacity-70"
              )}
            >
              <span className="font-medium">{opt}</span>
              {showCorrect && (
                <Check className="h-5 w-5 flex-none text-sage-700" aria-hidden />
              )}
              {showWrong && (
                <X className="h-5 w-5 flex-none text-berry" aria-hidden />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: easeOrganic }}
            className={cn(
              "mt-7 rounded-organic border px-5 py-4",
              isCorrect
                ? "border-sage-300 bg-sage-50 text-sage-900"
                : "border-clay-300 bg-clay-50 text-clay-800"
            )}
          >
            <p className="font-display text-lg">
              {isCorrect ? "Nice sort." : "Not quite."}
            </p>
            <p className="mt-1 text-ink-soft leading-relaxed">{question.explain}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-7 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={!answered}
          className="inline-flex items-center justify-center gap-2 rounded-organic bg-sage-700 px-6 py-3 font-medium text-cream shadow-leaf transition-all duration-200 hover:bg-sage-800 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          {isLast ? "See result" : "Next question"}
          <span aria-hidden>→</span>
        </button>
      </div>
    </motion.div>
  );
}
