"use client";

import { motion } from "framer-motion";
import { driftSpring } from "@/components/motion-primitives";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  accent?: "sage" | "clay" | "sun" | "leaf";
}

const ACCENTS: Record<NonNullable<StatTileProps["accent"]>, string> = {
  sage: "bg-sage-100/70 text-sage-800",
  clay: "bg-clay-100/70 text-clay-800",
  sun: "bg-[#FBE7BE] text-clay-800",
  leaf: "bg-[#E8EFD8] text-[#3A4730]"
};

export function StatTile({ label, value, hint, icon, accent = "sage" }: StatTileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={driftSpring}
      className="rounded-organic border border-sage-200/70 bg-cream-50/80 shadow-soft p-5 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-ink-muted">{label}</span>
        {icon && (
          <span className={cn("size-8 rounded-full flex items-center justify-center", ACCENTS[accent])} aria-hidden>
            {icon}
          </span>
        )}
      </div>
      <div className="font-display text-3xl text-ink leading-none">{value}</div>
      {hint && <p className="text-xs text-ink-soft">{hint}</p>}
    </motion.div>
  );
}
