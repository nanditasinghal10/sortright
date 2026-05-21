"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { BinId } from "./bins";

export interface ImpactEntry {
  id: string;          // item id
  bin: BinId;
  at: number;          // ms epoch
  co2Saved: number;    // kg
  landfillSavedG: number;
}

export interface ChallengeRecord {
  id: string;          // challenge id
  completedOn: string; // YYYY-MM-DD
}

export interface Badge {
  id: string;          // recycler-bronze, composter-silver, master-sorter, etc.
  earnedAt: number;
}

export interface SortState {
  // gamification
  totalScore: number;
  highestStreak: number;
  currentStreak: number;
  lastChallengeDate: string | null;
  badges: Badge[];
  completedChallenges: ChallengeRecord[];
  quizLevels: Record<string, { best: number; passes: number }>;
  impactLog: ImpactEntry[];

  // mutators
  addScore: (delta: number) => void;
  recordSort: (entry: ImpactEntry) => void;
  bumpStreak: () => void;
  resetStreak: () => void;
  awardBadge: (id: string) => void;
  completeChallenge: (id: string) => void;
  recordQuiz: (levelId: string, score: number) => void;
  reset: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

export const useSortStore = create<SortState>()(
  persist(
    (set, get) => ({
      totalScore: 0,
      highestStreak: 0,
      currentStreak: 0,
      lastChallengeDate: null,
      badges: [],
      completedChallenges: [],
      quizLevels: {},
      impactLog: [],

      addScore: (delta) => set((s) => ({ totalScore: s.totalScore + delta })),

      recordSort: (entry) =>
        set((s) => ({
          impactLog: [entry, ...s.impactLog].slice(0, 500)
        })),

      bumpStreak: () =>
        set((s) => {
          const next = s.currentStreak + 1;
          return {
            currentStreak: next,
            highestStreak: Math.max(s.highestStreak, next)
          };
        }),

      resetStreak: () => set({ currentStreak: 0 }),

      awardBadge: (id) =>
        set((s) =>
          s.badges.some((b) => b.id === id)
            ? s
            : { badges: [...s.badges, { id, earnedAt: Date.now() }] }
        ),

      completeChallenge: (id) => {
        const t = today();
        const already = get().completedChallenges.some(
          (c) => c.id === id && c.completedOn === t
        );
        if (already) return;
        set((s) => ({
          completedChallenges: [...s.completedChallenges, { id, completedOn: t }],
          lastChallengeDate: t,
          totalScore: s.totalScore + 10
        }));
      },

      recordQuiz: (levelId, score) =>
        set((s) => {
          const prev = s.quizLevels[levelId] ?? { best: 0, passes: 0 };
          return {
            quizLevels: {
              ...s.quizLevels,
              [levelId]: {
                best: Math.max(prev.best, score),
                passes: prev.passes + (score >= 70 ? 1 : 0)
              }
            }
          };
        }),

      reset: () =>
        set({
          totalScore: 0,
          highestStreak: 0,
          currentStreak: 0,
          lastChallengeDate: null,
          badges: [],
          completedChallenges: [],
          quizLevels: {},
          impactLog: []
        })
    }),
    {
      name: "sortright:store:v1",
      storage: createJSONStorage(() => localStorage),
      // Avoid hydration mismatches: only persist after client mount.
      skipHydration: false
    }
  )
);

/** Aggregations derived from impactLog. */
export function selectImpactTotals(s: SortState) {
  const co2 = s.impactLog.reduce((sum, e) => sum + (e.co2Saved ?? 0), 0);
  const landfillG = s.impactLog.reduce((sum, e) => sum + (e.landfillSavedG ?? 0), 0);
  return {
    co2Kg: co2,
    landfillKg: landfillG / 1000,
    items: s.impactLog.length,
    composted: s.impactLog.filter((e) => e.bin === "compost").length,
    recycled: s.impactLog.filter((e) => e.bin === "recycle").length,
    diverted: s.impactLog.filter((e) => e.bin !== "trash").length
  };
}
