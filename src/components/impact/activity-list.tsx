"use client";

import { motion } from "framer-motion";
import { driftSpring } from "@/components/motion-primitives";
import { BINS } from "@/lib/bins";
import { getItem } from "@/lib/items";
import type { ImpactEntry } from "@/lib/store";

interface ActivityListProps {
  entries: ImpactEntry[];
}

function timeAgo(ms: number, now = Date.now()) {
  const diff = Math.max(0, now - ms);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  const w = Math.floor(d / 7);
  if (w < 5) return `${w}w ago`;
  return new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ActivityList({ entries }: ActivityListProps) {
  if (!entries.length) {
    return (
      <div className="rounded-organic border border-dashed border-sage-300/70 bg-cream-50/40 p-8 text-center">
        <p className="font-display text-lg text-ink">No sorts yet.</p>
        <p className="text-sm text-ink-soft mt-1">
          Your first item will land here. The list grows as you go.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-sage-100/80 rounded-organic border border-sage-200/70 bg-cream-50/80 shadow-soft overflow-hidden">
      {entries.map((entry, i) => {
        const item = getItem(entry.id);
        const bin = BINS[entry.bin];
        const Icon = bin.icon;
        return (
          <motion.li
            key={`${entry.id}-${entry.at}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...driftSpring, delay: i * 0.025 }}
            className="flex items-center gap-3 px-4 py-3"
          >
            <span className="text-2xl shrink-0" aria-hidden>{item?.emoji ?? "🗂️"}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-ink truncate">{item?.name ?? entry.id}</p>
              <p className="text-xs text-ink-muted">{timeAgo(entry.at)}</p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full ${bin.bg} ${bin.text} ${bin.border} border px-2.5 py-1 text-xs font-medium shrink-0`}
              aria-label={`Sorted into ${bin.label}`}
            >
              <Icon className="size-3" aria-hidden />
              {bin.short}
            </span>
          </motion.li>
        );
      })}
    </ul>
  );
}
