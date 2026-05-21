"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchStats, type WasteStats } from "@/lib/api";
import { driftSpring } from "@/components/motion-primitives";
import { formatNumber } from "@/lib/utils";

interface CompareStripProps {
  itemsThisMonth: number;
  co2Kg: number;
}

export function CompareStrip({ itemsThisMonth, co2Kg }: CompareStripProps) {
  const [stats, setStats] = useState<WasteStats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchStats()
      .then((s) => {
        if (!cancelled) setStats(s);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-organic border border-sage-200/70 bg-cream-50/80 p-6 shadow-soft">
        <p className="font-display text-xl text-ink">How you compare</p>
        <p className="text-sm text-ink-soft mt-2">
          National stats couldn't load right now. Your impact still counts.
        </p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-organic border border-sage-200/70 bg-cream-50/80 p-6 shadow-soft">
        <p className="font-display text-xl text-ink">How you compare</p>
        <div className="mt-4 grid sm:grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-20 rounded-organic bg-sage-100/50 animate-pulse"
              aria-hidden
            />
          ))}
        </div>
        <span className="sr-only">Loading national waste stats…</span>
      </div>
    );
  }

  const lbsPerYear = stats.perCapitaLbsPerDay * 365;
  const recyclingRatePct = (stats.recyclingRate * 100).toFixed(1);

  const cards = [
    {
      head: `${stats.perCapitaLbsPerDay.toFixed(1)} lbs / day`,
      body: "Average American throws away that much. You've diverted "
        + `${itemsThisMonth} ${itemsThisMonth === 1 ? "item" : "items"} this month. Every one stays out.`
    },
    {
      head: `${recyclingRatePct}% national rate`,
      body: `That's how much US waste actually gets recycled. Each correct sort you make beats the average.`
    },
    {
      head: `${formatNumber(co2Kg, { maximumFractionDigits: 2 })} kg CO₂`,
      body: `That's your saved emissions so far. Roughly ${(co2Kg / 0.4).toFixed(1)} miles of driving avoided.`
    }
  ];

  return (
    <div className="rounded-organic border border-sage-200/70 bg-cream-50/80 p-6 shadow-soft">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <p className="font-display text-xl text-ink">How you compare</p>
        <p className="text-xs text-ink-muted">
          Source: {stats.source} · {stats.msw.year}. Average American: {lbsPerYear.toFixed(0)} lbs/year.
        </p>
      </div>
      <div className="mt-4 grid sm:grid-cols-3 gap-3">
        {cards.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...driftSpring, delay: i * 0.06 }}
            className="rounded-organic bg-sage-50/70 border border-sage-200/60 p-4"
          >
            <p className="font-display text-lg text-sage-800">{c.head}</p>
            <p className="text-sm text-ink-soft mt-1.5 leading-relaxed">{c.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
