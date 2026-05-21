"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Flame, Leaf, Recycle, Trash2 } from "lucide-react";
import { useSortStore, selectImpactTotals } from "@/lib/store";
import { useHydrated } from "@/lib/api";
import { FadeUp, easeOrganic } from "@/components/motion-primitives";
import { StatTile } from "@/components/impact/stat-tile";
import { Sparkline } from "@/components/impact/sparkline";
import { BadgeGrid } from "@/components/impact/badge-grid";
import { ActivityList } from "@/components/impact/activity-list";
import { CompareStrip } from "@/components/impact/compare-strip";
import { ShareCardButton } from "@/components/impact/share-card-button";
import { formatNumber } from "@/lib/utils";

function AnimatedNumber({
  value,
  decimals = 2,
  className
}: {
  value: number;
  decimals?: number;
  className?: string;
}) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 80, damping: 20, mass: 0.9 });
  const display = useTransform(spring, (v) =>
    formatNumber(v, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  );

  useEffect(() => {
    mv.set(value);
  }, [value, mv]);

  return <motion.span className={className}>{display}</motion.span>;
}

function buildLast30(impactLog: { at: number }[]) {
  const days = 30;
  const buckets = new Array(days).fill(0);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  for (const entry of impactLog) {
    const diffDays = Math.floor((startOfToday - new Date(entry.at).setHours(0, 0, 0, 0)) / 86400000);
    if (diffDays >= 0 && diffDays < days) {
      buckets[days - 1 - diffDays] += 1;
    }
  }
  return buckets;
}

export default function ImpactPage() {
  const hydrated = useHydrated();
  const state = useSortStore();
  const totals = useMemo(() => selectImpactTotals(state), [state]);

  const [last30, setLast30] = useState<number[]>(() => new Array(30).fill(0));
  useEffect(() => {
    if (!hydrated) return;
    setLast30(buildLast30(state.impactLog));
  }, [hydrated, state.impactLog]);

  const recentEntries = hydrated ? state.impactLog.slice(0, 10) : [];

  const itemsThisMonth = useMemo(() => {
    if (!hydrated) return 0;
    const cutoff = Date.now() - 30 * 86400000;
    return state.impactLog.filter((e) => e.at >= cutoff).length;
  }, [state.impactLog, hydrated]);

  const handleReset = () => {
    if (typeof window === "undefined") return;
    if (window.confirm("Reset all your progress? This clears your streak, badges, and history.")) {
      state.reset();
    }
  };

  const co2 = hydrated ? totals.co2Kg : 0;
  const landfillKg = hydrated ? totals.landfillKg : 0;

  return (
    <main className="mx-auto max-w-5xl px-5 sm:px-6 py-12 sm:py-16">
      <FadeUp>
        <p className="text-sm text-sage-700 font-medium">Your impact</p>
        <h1 className="font-display text-4xl sm:text-5xl text-ink mt-2 leading-tight">
          You&apos;ve kept{" "}
          <AnimatedNumber value={co2} decimals={2} className="text-sage-700" />
          {" "}kg of CO₂ in the ground
        </h1>
        <p className="text-ink-soft mt-3 leading-relaxed max-w-xl">
          and{" "}
          <AnimatedNumber value={landfillKg} decimals={2} className="font-medium text-clay-700" />
          {" "}kg out of landfill. Small sorts, real numbers.
        </p>
        {hydrated ? (
          <div className="mt-6">
            <ShareCardButton
              co2Kg={totals.co2Kg}
              items={totals.items}
              streak={state.currentStreak}
              diverted={totals.diverted}
              badges={state.badges.map((b) => b.id)}
            />
          </div>
        ) : null}
      </FadeUp>

      <section aria-label="Quick stats" className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile
          label="Items diverted"
          value={hydrated ? totals.diverted : 0}
          hint="Anything that didn't end up in landfill."
          icon={<Leaf className="size-4" />}
          accent="leaf"
        />
        <StatTile
          label="Composted"
          value={hydrated ? totals.composted : 0}
          hint="Back to the soil where it belongs."
          icon={<Leaf className="size-4" />}
          accent="sage"
        />
        <StatTile
          label="Recycled"
          value={hydrated ? totals.recycled : 0}
          hint="Sent on to a second life."
          icon={<Recycle className="size-4" />}
          accent="sun"
        />
        <StatTile
          label="Streak"
          value={hydrated ? state.currentStreak : 0}
          hint={`Best so far: ${hydrated ? state.highestStreak : 0} days.`}
          icon={<Flame className="size-4" />}
          accent="clay"
        />
      </section>

      <section aria-labelledby="trend-heading" className="mt-12">
        <div className="rounded-organic border border-sage-200/70 bg-cream-50/80 shadow-soft p-6">
          <div className="flex items-baseline justify-between flex-wrap gap-2 mb-3">
            <div>
              <h2 id="trend-heading" className="font-display text-xl text-ink">Your sorts over time</h2>
              <p className="text-xs text-ink-muted mt-0.5">Last 30 days · {last30.reduce((a, b) => a + b, 0)} items total</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-ink-muted">
              <span className="size-2 rounded-full bg-sage-600" aria-hidden /> daily count
            </div>
          </div>
          <Sparkline values={last30} />
        </div>
      </section>

      <section aria-labelledby="badges-heading" className="mt-12">
        <h2 id="badges-heading" className="font-display text-2xl text-ink mb-1">Badges</h2>
        <p className="text-ink-soft text-sm mb-5">
          Earned ones glow. Locked ones are waiting for you.
        </p>
        <BadgeGrid earned={hydrated ? state.badges : []} />
      </section>

      <section aria-labelledby="recent-heading" className="mt-12">
        <h2 id="recent-heading" className="font-display text-2xl text-ink mb-1">Recent activity</h2>
        <p className="text-ink-soft text-sm mb-5">Your last ten sorts.</p>
        <ActivityList entries={recentEntries} />
      </section>

      <section aria-label="Comparison with national stats" className="mt-12">
        <CompareStrip itemsThisMonth={itemsThisMonth} co2Kg={co2} />
      </section>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6, ease: easeOrganic }}
        className="mt-16 text-center"
      >
        <button
          onClick={handleReset}
          className="text-xs text-ink-muted underline underline-offset-4 hover:text-clay-700 transition-colors"
        >
          Reset progress
        </button>
      </motion.div>
    </main>
  );
}
