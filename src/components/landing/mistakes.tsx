"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ITEMS, type WasteItem } from "@/lib/items";
import { BINS } from "@/lib/bins";
import { Card, Badge } from "@/components/ui/card";
import { fadeUp, stagger, easeOrganic } from "@/components/motion-primitives";
import { cn } from "@/lib/utils";

const MISTAKE_IDS = [
  "pizza-box-greasy",
  "receipt",
  "plastic-bag",
  "tshirt-worn"
];

const MISTAKES: WasteItem[] = MISTAKE_IDS
  .map((id) => ITEMS.find((i) => i.id === id))
  .filter((i): i is WasteItem => Boolean(i));

export function Mistakes() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: easeOrganic }}
        className="max-w-2xl mb-12"
      >
        <span className="text-xs uppercase tracking-[0.2em] text-clay-700 font-medium">
          Common mistakes
        </span>
        <h2 className="font-display text-4xl md:text-5xl tracking-tight mt-3">
          The four things almost everyone gets wrong.
        </h2>
        <p className="mt-4 text-ink-soft leading-relaxed">
          Don't worry, we did too. Here's the corrected version.
        </p>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
      >
        {MISTAKES.map((item) => {
          const bin = BINS[item.bin];
          return (
            <motion.div key={item.id} variants={fadeUp}>
              <Card className="h-full">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-4xl" aria-hidden="true">
                    {item.emoji}
                  </span>
                  <Badge
                    className={cn(bin.bg, bin.border, bin.text, "border")}
                  >
                    {bin.short}
                  </Badge>
                </div>
                <h3 className="font-display text-xl mt-4 tracking-tight">
                  {item.name}
                </h3>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                  {item.why}
                </p>
                {item.alternatives && (
                  <p className="mt-3 text-xs text-ink-muted leading-relaxed">
                    <span className="font-medium text-sage-700">Try instead: </span>
                    {item.alternatives}
                  </p>
                )}
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="mt-10 text-center">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1 text-sage-800 font-medium hover:text-sage-900"
        >
          Browse the full directory
          <span>→</span>
        </Link>
      </div>
    </section>
  );
}
