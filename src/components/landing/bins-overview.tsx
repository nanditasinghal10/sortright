"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BIN_LIST } from "@/lib/bins";
import { fadeUp, stagger, easeOrganic } from "@/components/motion-primitives";
import { cn } from "@/lib/utils";

export function BinsOverview() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: easeOrganic }}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <span className="text-xs uppercase tracking-[0.2em] text-sage-700 font-medium">
          The four bins
        </span>
        <h2 className="font-display text-4xl md:text-5xl tracking-tight mt-3">
          It really comes down to four piles.
        </h2>
        <p className="mt-4 text-ink-soft leading-relaxed">
          Almost everything you throw away belongs in one of these. Tap any to
          see exactly what fits, and what surprises live there.
        </p>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
      >
        {BIN_LIST.map((bin) => {
          const Icon = bin.icon;
          return (
            <motion.div key={bin.id} variants={fadeUp}>
              <Link
                href={`/learn?bin=${bin.id}`}
                className="group block h-full"
              >
                <div
                  className={cn(
                    "h-full rounded-organic border p-6 shadow-soft transition-all duration-300",
                    "group-hover:-translate-y-1 group-hover:shadow-leaf",
                    bin.bg,
                    bin.border
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "grid place-items-center h-12 w-12 rounded-2xl bg-cream-50/80 shadow-soft",
                        bin.text
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <span
                      className={cn(
                        "text-xs uppercase tracking-widest font-medium",
                        bin.text
                      )}
                    >
                      {bin.short}
                    </span>
                  </div>
                  <h3
                    className={cn(
                      "font-display text-2xl mt-5 tracking-tight",
                      bin.text
                    )}
                  >
                    {bin.label}
                  </h3>
                  <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                    {bin.blurb}
                  </p>
                  <span
                    className={cn(
                      "mt-5 inline-flex items-center gap-1 text-sm font-medium",
                      bin.text
                    )}
                  >
                    See what fits
                    <span className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
