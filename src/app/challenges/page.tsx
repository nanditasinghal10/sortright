"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSortStore } from "@/lib/store";
import { useHydrated } from "@/lib/api";
import {
  AREA_EMOJI,
  AREA_LABEL,
  CHALLENGES,
  pickDaily,
  todayKey,
  type Challenge,
  type ChallengeArea
} from "@/lib/challenges-data";
import { StreakBanner } from "@/components/challenges/streak-banner";
import { DailyTrio } from "@/components/challenges/daily-trio";
import { ChallengeCard } from "@/components/challenges/challenge-card";
import { ConfettiBurst } from "@/components/challenges/confetti-burst";
import { FadeUp, easeOrganic } from "@/components/motion-primitives";
import { cn } from "@/lib/utils";

const AREAS: ChallengeArea[] = ["kitchen", "bath", "shopping", "transport", "home", "social"];

function shuffleStable<T>(list: T[], seed: number): T[] {
  const arr = [...list];
  let s = seed || 1;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function ChallengesPage() {
  const hydrated = useHydrated();
  const currentStreak = useSortStore((s) => s.currentStreak);
  const highestStreak = useSortStore((s) => s.highestStreak);
  const completedChallenges = useSortStore((s) => s.completedChallenges);
  const completeChallenge = useSortStore((s) => s.completeChallenge);
  const bumpStreak = useSortStore((s) => s.bumpStreak);
  const awardBadge = useSortStore((s) => s.awardBadge);
  const lastChallengeDate = useSortStore((s) => s.lastChallengeDate);
  const badges = useSortStore((s) => s.badges);

  const [showBurst, setShowBurst] = useState(false);
  const [areaTab, setAreaTab] = useState<ChallengeArea | "all">("all");

  const today = todayKey();
  const trio = useMemo(() => pickDaily(new Date()), []);

  const doneIds = useMemo(() => {
    if (!hydrated) return new Set<string>();
    return new Set(
      completedChallenges
        .filter((c) => c.completedOn === today)
        .map((c) => c.id)
    );
  }, [completedChallenges, today, hydrated]);

  const trioCompleteCount = trio.filter((c) => doneIds.has(c.id)).length;
  const trioComplete = trioCompleteCount === 3;
  const dailyTrioBadgeEarned = badges.some((b) => b.id === "daily-trio");

  useEffect(() => {
    if (!hydrated) return;
    if (trioComplete && !dailyTrioBadgeEarned) {
      awardBadge("daily-trio");
      setShowBurst(true);
      const t = setTimeout(() => setShowBurst(false), 2000);
      return () => clearTimeout(t);
    }
  }, [hydrated, trioComplete, dailyTrioBadgeEarned, awardBadge]);

  const handleComplete = (id: string) => {
    if (doneIds.has(id)) return;
    completeChallenge(id);
    if (lastChallengeDate !== today) {
      bumpStreak();
    }
    if (currentStreak + 1 >= 7) awardBadge("streak-7");
    if (currentStreak + 1 >= 30) awardBadge("streak-30");
  };

  const moreToTry = useMemo(() => {
    const trioIds = new Set(trio.map((c) => c.id));
    const seed = Number(today.replace(/-/g, "")) || 1;
    return shuffleStable(
      CHALLENGES.filter((c) => !trioIds.has(c.id)),
      seed
    ).slice(0, 6);
  }, [trio, today]);

  const filteredCatalog = useMemo<Challenge[]>(() => {
    const trioIds = new Set(trio.map((c) => c.id));
    const list = CHALLENGES.filter((c) => !trioIds.has(c.id));
    if (areaTab === "all") return list;
    return list.filter((c) => c.area === areaTab);
  }, [areaTab, trio]);

  return (
    <main className="mx-auto max-w-5xl px-5 sm:px-6 py-12 sm:py-16">
      <ConfettiBurst show={showBurst} />

      <FadeUp>
        <div className="flex items-center gap-2 text-sm text-sage-700 font-medium">
          <span aria-hidden>🌿</span>
          <span>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-ink mt-2 leading-tight">
          Today&apos;s small wins
        </h1>
        <p className="text-ink-soft mt-3 max-w-xl leading-relaxed">
          Three doable things, picked for today. Stack a few and a habit starts to build itself.
        </p>
      </FadeUp>

      <div className="mt-8">
        <StreakBanner current={currentStreak} highest={highestStreak} hydrated={hydrated} />
      </div>

      <DailyTrio challenges={trio} doneIds={doneIds} onComplete={handleComplete} />

      <section aria-labelledby="more-heading" className="mt-14">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 id="more-heading" className="font-display text-2xl text-ink">
              More to try
            </h2>
            <p className="text-ink-soft text-sm mt-1">Pick one if you&apos;re feeling it.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {moreToTry.map((c) => (
            <ChallengeCard
              key={c.id}
              challenge={c}
              done={doneIds.has(c.id)}
              onComplete={handleComplete}
              ctaLabel="Add to today"
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="byarea-heading" className="mt-14">
        <h2 id="byarea-heading" className="font-display text-2xl text-ink mb-2">
          By area
        </h2>
        <p className="text-ink-soft text-sm mb-5">
          Browse the full catalog by where it fits in your day.
        </p>

        <div role="tablist" aria-label="Filter by area" className="flex flex-wrap gap-2 mb-6">
          <button
            role="tab"
            aria-selected={areaTab === "all"}
            onClick={() => setAreaTab("all")}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm border transition-colors",
              areaTab === "all"
                ? "bg-sage-700 text-cream border-sage-700"
                : "bg-cream-50 text-ink border-sage-200 hover:bg-sage-100/60"
            )}
          >
            All
          </button>
          {AREAS.map((a) => (
            <button
              key={a}
              role="tab"
              aria-selected={areaTab === a}
              onClick={() => setAreaTab(a)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm border transition-colors inline-flex items-center gap-1.5",
                areaTab === a
                  ? "bg-sage-700 text-cream border-sage-700"
                  : "bg-cream-50 text-ink border-sage-200 hover:bg-sage-100/60"
              )}
            >
              <span aria-hidden>{AREA_EMOJI[a]}</span>
              {AREA_LABEL[a]}
            </button>
          ))}
        </div>

        <motion.div
          key={areaTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOrganic }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredCatalog.map((c) => (
            <ChallengeCard
              key={c.id}
              challenge={c}
              done={doneIds.has(c.id)}
              onComplete={handleComplete}
              ctaLabel="Add to today"
            />
          ))}
          {filteredCatalog.length === 0 && (
            <p className="text-sm text-ink-soft col-span-full">Nothing here yet. Try another area.</p>
          )}
        </motion.div>
      </section>
    </main>
  );
}
