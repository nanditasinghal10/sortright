"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BIN_LIST, type BinId } from "@/lib/bins";
import type { WasteItem } from "@/lib/items";
import { useHydrated } from "@/lib/api";
import { useSortStore } from "@/lib/store";
import { pickRound, scoreFor, shouldAwardBadge } from "@/lib/sort-game";
import { FadeUp } from "@/components/motion-primitives";
import { BinZone } from "@/components/sort/bin-zone";
import { ItemChip } from "@/components/sort/item-chip";
import { FlyAway, type FlyAwayPayload } from "@/components/sort/fly-away";
import { ResultToast, type FeedbackPayload } from "@/components/sort/result-toast";
import { ScoreBar } from "@/components/sort/score-bar";
import { RoundSummary } from "@/components/sort/round-summary";

const ROUND_SIZE = 10;

export default function SortGamePage() {
  const hydrated = useHydrated();
  const totalScore = useSortStore((s) => s.totalScore);
  const currentStreak = useSortStore((s) => s.currentStreak);
  const highestStreak = useSortStore((s) => s.highestStreak);
  const addScore = useSortStore((s) => s.addScore);
  const recordSort = useSortStore((s) => s.recordSort);
  const bumpStreak = useSortStore((s) => s.bumpStreak);
  const resetStreak = useSortStore((s) => s.resetStreak);
  const awardBadge = useSortStore((s) => s.awardBadge);

  const [round, setRound] = useState<WasteItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [bestStreakInRound, setBestStreakInRound] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackPayload | null>(null);
  const [hoverBin, setHoverBin] = useState<BinId | null>(null);
  const [flyAway, setFlyAway] = useState<FlyAwayPayload | null>(null);
  const [done, setDone] = useState(false);
  const [awardedBadge, setAwardedBadge] = useState<string | null>(null);

  const binRefs = useRef<Record<BinId, HTMLDivElement | null>>({
    recycle: null,
    compost: null,
    trash: null,
    hazardous: null
  });
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flyAwayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startRound = useCallback(() => {
    setRound(pickRound({ count: ROUND_SIZE }));
    setIdx(0);
    setCorrectCount(0);
    setBestStreakInRound(0);
    setFeedback(null);
    setHoverBin(null);
    setFlyAway(null);
    setDone(false);
    setAwardedBadge(null);
  }, []);

  useEffect(() => {
    if (hydrated && round.length === 0 && !done) {
      startRound();
    }
  }, [hydrated, round.length, done, startRound]);

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
      if (flyAwayTimer.current) clearTimeout(flyAwayTimer.current);
    };
  }, []);

  const item = round[idx];

  const binAtPoint = useCallback((x: number, y: number): BinId | null => {
    for (const b of BIN_LIST) {
      const el = binRefs.current[b.id];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
        return b.id;
      }
    }
    return null;
  }, []);

  const handleDrag = useCallback(
    (point: { x: number; y: number }) => {
      setHoverBin(binAtPoint(point.x, point.y));
    },
    [binAtPoint]
  );

  const handleDragStart = useCallback(() => {
    setFeedback(null);
  }, []);

  const finishRound = useCallback(
    (finalCorrect: number, finalBestStreak: number) => {
      const accuracy = finalCorrect / ROUND_SIZE;
      const badge = shouldAwardBadge(finalBestStreak, accuracy);
      if (accuracy >= 0.8) {
        awardBadge("master-sorter");
      }
      if (badge) {
        awardBadge(badge);
        setAwardedBadge(badge);
      }
      setDone(true);
    },
    [awardBadge]
  );

  const handleDragEnd = useCallback(
    (point: { x: number; y: number }) => {
      if (!item) return;
      const dropBin = binAtPoint(point.x, point.y);
      setHoverBin(null);

      if (!dropBin) {
        return;
      }

      const correct = item.bin === dropBin;
      const nextStreak = correct ? currentStreak + 1 : 0;
      const delta = scoreFor(item, correct, currentStreak);

      if (correct) {
        bumpStreak();
        addScore(delta);
        recordSort({
          id: item.id,
          bin: item.bin,
          at: Date.now(),
          co2Saved: item.co2Saved ?? 0,
          landfillSavedG: item.landfillSavedG ?? 0
        });
      } else {
        resetStreak();
        addScore(delta);
      }

      const targetEl = binRefs.current[dropBin];
      if (targetEl) {
        const tRect = targetEl.getBoundingClientRect();
        setFlyAway({
          item,
          fromX: point.x - 80,
          fromY: point.y - 64,
          toX: tRect.left + tRect.width / 2 - 80,
          toY: tRect.top + tRect.height / 2 - 64,
          key: Date.now()
        });
        if (flyAwayTimer.current) clearTimeout(flyAwayTimer.current);
        flyAwayTimer.current = setTimeout(() => setFlyAway(null), 600);
      }

      const message = correct
        ? `Right on. ${item.why}`
        : `Actually, this belongs in ${item.bin}. ${item.why}`;
      setFeedback({ correct, message, key: Date.now() });

      const newCorrect = correctCount + (correct ? 1 : 0);
      const newBest = Math.max(bestStreakInRound, nextStreak);
      setCorrectCount(newCorrect);
      setBestStreakInRound(newBest);

      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
      feedbackTimer.current = setTimeout(() => setFeedback(null), 5000);

      if (idx + 1 >= ROUND_SIZE) {
        finishRound(newCorrect, newBest);
      } else {
        setIdx((n) => n + 1);
      }
    },
    [
      item,
      binAtPoint,
      currentStreak,
      bumpStreak,
      addScore,
      recordSort,
      resetStreak,
      correctCount,
      bestStreakInRound,
      idx,
      finishRound
    ]
  );

  const remaining = useMemo(
    () => Math.max(0, ROUND_SIZE - idx),
    [idx]
  );

  return (
    <div className="relative min-h-[calc(100vh-8rem)]">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12 flex flex-col gap-6">
        <FadeUp className="text-center">
          <h1 className="font-display text-4xl sm:text-5xl text-ink tracking-tight">
            Sort it out
          </h1>
          <p className="mt-3 text-ink-soft leading-relaxed max-w-md mx-auto">
            Drag each item into the right bin. Streaks unlock badges.
          </p>
        </FadeUp>

        {hydrated && (
          <ScoreBar
            score={totalScore}
            streak={currentStreak}
            highStreak={highestStreak}
            remaining={remaining}
            total={ROUND_SIZE}
          />
        )}

        {!done && (
          <>
            <div className="relative z-20 flex h-56 sm:h-64 items-center justify-center rounded-organic border border-dashed border-sage-300/70 bg-cream-50/40">
              <AnimatePresence mode="popLayout">
                {item && (
                  <ItemChip
                    key={`${item.id}-${idx}`}
                    item={item}
                    isOverBin={hoverBin !== null}
                    onDragStart={handleDragStart}
                    onDrag={handleDrag}
                    onDragEnd={handleDragEnd}
                  />
                )}
              </AnimatePresence>
            </div>

            <div className="relative z-10 grid grid-cols-4 gap-2 sm:gap-3">
              {BIN_LIST.map((b) => (
                <BinZone
                  key={b.id}
                  bin={b.id}
                  isHovered={hoverBin === b.id}
                  ref={(el) => {
                    binRefs.current[b.id] = el;
                  }}
                />
              ))}
            </div>

            <p className="text-center text-xs text-ink-muted">
              Tip: drag and drop. Lift your finger over a bin to sort.
            </p>
          </>
        )}

        {done && (
          <RoundSummary
            score={totalScore}
            correct={correctCount}
            total={ROUND_SIZE}
            bestStreak={bestStreakInRound}
            badge={awardedBadge}
            onPlayAgain={startRound}
          />
        )}
      </div>

      <FlyAway payload={flyAway} />
      <ResultToast feedback={feedback} />
    </div>
  );
}
