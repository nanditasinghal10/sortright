"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { QUIZ_LEVELS, type QuizLevel } from "@/lib/quiz-data";
import { useSortStore } from "@/lib/store";
import { fadeUp, stagger } from "@/components/motion-primitives";
import { LevelCard } from "@/components/quiz/level-card";
import { QuizProgress } from "@/components/quiz/quiz-progress";
import { QuizQuestionView } from "@/components/quiz/quiz-question";
import { QuizResult } from "@/components/quiz/quiz-result";

type Phase = "select" | "playing" | "done";

export default function QuizPage() {
  const recordQuiz = useSortStore((s) => s.recordQuiz);
  const awardBadge = useSortStore((s) => s.awardBadge);
  const addScore = useSortStore((s) => s.addScore);

  const [phase, setPhase] = useState<Phase>("select");
  const [activeLevelId, setActiveLevelId] = useState<string | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const activeLevel: QuizLevel | undefined = useMemo(
    () => QUIZ_LEVELS.find((l) => l.id === activeLevelId),
    [activeLevelId]
  );

  const score = activeLevel
    ? Math.round((correctCount / activeLevel.questions.length) * 100)
    : 0;
  const passed = activeLevel ? score >= activeLevel.passScore : false;

  useEffect(() => {
    if (phase !== "done" || !activeLevel) return;
    recordQuiz(activeLevel.id, score);
    addScore(score);
    if (passed) awardBadge(activeLevel.badge);
  }, [phase, activeLevel, score, passed, recordQuiz, awardBadge, addScore]);

  function startLevel(id: string) {
    setActiveLevelId(id);
    setQIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setPhase("playing");
  }

  function handleSelect(idx: number) {
    if (selected !== null || !activeLevel) return;
    setSelected(idx);
    if (idx === activeLevel.questions[qIndex].correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  }

  function handleNext() {
    if (!activeLevel) return;
    if (qIndex + 1 >= activeLevel.questions.length) {
      setPhase("done");
      return;
    }
    setQIndex((i) => i + 1);
    setSelected(null);
  }

  function backToLevels() {
    setPhase("select");
    setActiveLevelId(null);
    setQIndex(0);
    setSelected(null);
    setCorrectCount(0);
  }

  function nextHarder() {
    if (!activeLevel) return;
    const idx = QUIZ_LEVELS.findIndex((l) => l.id === activeLevel.id);
    const next = QUIZ_LEVELS[idx + 1];
    if (next) startLevel(next.id);
    else backToLevels();
  }

  if (phase === "select") {
    return (
      <div className="bg-paper">
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-24 md:pt-24">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.p
              variants={fadeUp}
              className="text-sm uppercase tracking-[0.18em] text-sage-700 font-medium"
            >
              Pop quiz
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="mt-3 font-display text-5xl md:text-6xl text-ink leading-[1.05] tracking-tight"
            >
              How well do you sort?
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-2xl text-lg text-ink-soft leading-relaxed"
            >
              Three levels, three badges. Each question explains its answer so
              you walk away a little sharper than you started.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {QUIZ_LEVELS.map((level, i) => (
              <LevelCard
                key={level.id}
                level={level}
                index={i}
                onStart={startLevel}
              />
            ))}
          </motion.div>
        </section>
      </div>
    );
  }

  if (!activeLevel) return null;

  return (
    <div className="bg-paper">
      <section className="mx-auto max-w-3xl px-6 pt-12 pb-24 md:pt-16">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={backToLevels}
            className="inline-flex items-center gap-2 text-sm font-medium text-sage-700 hover:text-sage-900"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Levels
          </button>
          <span className="text-sm text-ink-muted">{activeLevel.title}</span>
        </div>

        {phase === "playing" && (
          <>
            <div className="mt-6">
              <QuizProgress
                current={qIndex + 1}
                total={activeLevel.questions.length}
              />
            </div>
            <div className="mt-8">
              <AnimatePresence mode="wait">
                <QuizQuestionView
                  key={activeLevel.questions[qIndex].id}
                  question={activeLevel.questions[qIndex]}
                  selected={selected}
                  onSelect={handleSelect}
                  onNext={handleNext}
                  isLast={qIndex + 1 >= activeLevel.questions.length}
                />
              </AnimatePresence>
            </div>
          </>
        )}

        {phase === "done" && (
          <div className="mt-10">
            <QuizResult
              level={activeLevel}
              score={score}
              passed={passed}
              onRetake={() => startLevel(activeLevel.id)}
              onBackToLevels={backToLevels}
              nextLevel={
                QUIZ_LEVELS[
                  QUIZ_LEVELS.findIndex((l) => l.id === activeLevel.id) + 1
                ]
              }
              onNextLevel={nextHarder}
            />
            <div className="mt-8 text-center">
              <Link
                href="/learn"
                className="text-sm text-ink-muted hover:text-sage-700"
              >
                Browse the directory →
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
