"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stagger, fadeUp, easeOrganic } from "@/components/motion-primitives";

type DecorShape = "leafOval" | "leafCut" | "leafThin" | "sprout" | "drop" | "seed" | "recycle";

const PATHS: Record<Exclude<DecorShape, "seed">, string> = {
  leafOval: "M32 4c14 6 24 16 24 30 0 14-12 26-26 26C18 60 8 50 8 36 8 22 18 10 32 4z",
  leafCut:
    "M32 6c10 2 18 8 22 18 1 3-3 5-6 4-6-2-12-1-18 2-2 1-3 4-2 6 2 4 1 8-3 10-7 4-15-1-18-9C3 27 14 14 32 6z",
  leafThin:
    "M10 54c8-22 22-38 44-46-2 22-12 40-30 50-3 2-9 1-12-1-3-2-3-2-2-3z",
  sprout:
    "M32 60V34c0-10 6-18 16-22-2 10-7 18-16 22zM32 36c0-8-6-16-16-20 2 10 7 16 16 20z",
  drop: "M32 8c8 12 16 22 16 32a16 16 0 1 1-32 0c0-10 8-20 16-32z",
  recycle:
    "M22 14l6-10 6 10h-4v8h-4v-8zM48 32l10 6-10 6v-4h-8v-4h8zM34 50l-6 10-6-10h4v-8h4v8z"
};

interface DecorItem {
  shape: DecorShape;
  className: string;
  duration: number;
  yShift: number;
  rotateRange: [number, number];
  delay: number;
  baseRotate: number;
  flip?: boolean;
}

const DECOR: DecorItem[] = [
  { shape: "leafOval",  className: "hidden md:block absolute -top-6 -left-10 h-44 w-44 text-sage-200",                  duration: 9,  yShift: 12, rotateRange: [-14, 6],   delay: 0.1, baseRotate: -10 },
  { shape: "leafCut",   className: "hidden md:block absolute top-20 -right-14 h-56 w-56 text-clay-200",                 duration: 11, yShift: 14, rotateRange: [8, -6],    delay: 0.3, baseRotate: 12 },
  { shape: "leafThin",  className: "hidden lg:block absolute bottom-6 left-[28%] h-28 w-28 text-sage-300/80",           duration: 7,  yShift: 8,  rotateRange: [-4, 10],   delay: 0.55, baseRotate: 4 },
  { shape: "leafThin",  className: "hidden md:block absolute top-[55%] -left-6 h-20 w-20 text-clay-300/70",             duration: 8,  yShift: 9,  rotateRange: [12, -2],   delay: 0.9, baseRotate: 18, flip: true },
  { shape: "sprout",    className: "hidden md:block absolute top-12 right-[26%] h-12 w-12 text-sage-500/70",            duration: 6,  yShift: 6,  rotateRange: [-3, 3],    delay: 1.1, baseRotate: -6 },
  { shape: "leafOval",  className: "hidden lg:block absolute bottom-10 right-[18%] h-16 w-16 text-[#B5C79B]",           duration: 10, yShift: 10, rotateRange: [10, -8],   delay: 0.7, baseRotate: 22 },
  { shape: "drop",      className: "hidden md:block absolute top-[38%] left-[14%] h-7 w-7 text-sage-400/70",            duration: 5,  yShift: 5,  rotateRange: [-6, 6],    delay: 1.3, baseRotate: 0 },
  { shape: "recycle",   className: "hidden lg:block absolute top-[18%] left-[22%] h-9 w-9 text-clay-500/70",            duration: 12, yShift: 4,  rotateRange: [0, 360],   delay: 1.5, baseRotate: 0 },
  { shape: "leafCut",   className: "hidden md:block absolute -bottom-2 right-[8%] h-14 w-14 text-sage-400/60",          duration: 9,  yShift: 7,  rotateRange: [-12, 4],   delay: 0.8, baseRotate: -20, flip: true },
  { shape: "sprout",    className: "hidden lg:block absolute bottom-16 left-[8%] h-10 w-10 text-clay-400/60",           duration: 7,  yShift: 6,  rotateRange: [4, -6],    delay: 1.0, baseRotate: 8 }
];

const SEEDS = [
  { className: "hidden md:block absolute top-32 left-1/4 h-2.5 w-2.5 rounded-full bg-clay-400",            delay: 0.5, dur: 5, shift: 7 },
  { className: "hidden md:block absolute top-1/2 right-[22%] h-2 w-2 rounded-full bg-sage-500",            delay: 0.8, dur: 6, shift: 5 },
  { className: "hidden lg:block absolute top-[28%] right-[40%] h-1.5 w-1.5 rounded-full bg-clay-500/70",   delay: 1.2, dur: 4, shift: 4 },
  { className: "hidden lg:block absolute bottom-[18%] left-[42%] h-1.5 w-1.5 rounded-full bg-sage-700/70", delay: 0.6, dur: 5, shift: 6 },
  { className: "hidden md:block absolute top-[12%] right-[36%] h-1 w-1 rounded-full bg-ink-muted/50",      delay: 1.4, dur: 7, shift: 3 }
];

function DecorShapeEl({ d }: { d: DecorItem }) {
  if (d.shape === "seed") return null;
  return (
    <motion.svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={d.className}
      initial={{ opacity: 0, scale: 0.6, rotate: d.baseRotate }}
      animate={{
        opacity: 1,
        rotate: [d.baseRotate + d.rotateRange[0], d.baseRotate + d.rotateRange[1], d.baseRotate + d.rotateRange[0]],
        y: [0, -d.yShift, 0]
      }}
      transition={{
        opacity: { duration: 1.2, ease: easeOrganic, delay: d.delay },
        rotate: { duration: d.duration, ease: "easeInOut", repeat: Infinity, delay: d.delay },
        y: { duration: d.duration * 0.8, ease: "easeInOut", repeat: Infinity, delay: d.delay }
      }}
      style={d.flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d={PATHS[d.shape]} fill="currentColor" />
    </motion.svg>
  );
}

function Seed({ className, delay, dur, shift }: { className: string; delay: number; dur: number; shift: number }) {
  return (
    <motion.span
      aria-hidden="true"
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: [0, -shift, 0] }}
      transition={{
        opacity: { duration: 1, delay },
        y: { duration: dur, ease: "easeInOut", repeat: Infinity, delay }
      }}
    />
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {DECOR.map((d, i) => (
        <DecorShapeEl key={i} d={d} />
      ))}
      {SEEDS.map((s, i) => (
        <Seed key={i} {...s} />
      ))}

      <div className="mx-auto max-w-5xl px-6 pt-20 pb-24 md:pt-28 md:pb-32 text-center relative">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="space-y-7"
        >
          <motion.div variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2 rounded-full border border-sage-300/70 bg-sage-100/70 px-4 py-1.5 text-xs font-medium text-sage-800">
              <span className="h-1.5 w-1.5 rounded-full bg-sage-600" />
              A friendlier way to sort the planet
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-ink leading-[0.95]"
          >
            Sort right.
            <br />
            <span className="text-sage-700 italic">Live light.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mx-auto max-w-2xl text-lg md:text-xl text-ink-soft leading-relaxed"
          >
            Most of us mean well at the bin and still get it wrong. SortRight is
            a small, kind guide for everyday choices: what goes where, what
            swaps actually matter, and where the nearest drop-off lives.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
          >
            <Link href="/sort">
              <Button size="lg" className="min-h-[44px]">
                Play the sort game
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/locate">
              <Button size="lg" variant="secondary" className="min-h-[44px]">
                <MapPin className="h-4 w-4" />
                Find drop-off near me
              </Button>
            </Link>
          </motion.div>

          <motion.p
            variants={fadeUp}
            custom={4}
            className="text-sm text-ink-muted pt-4"
          >
            No signups. No guilt. Just better aim.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
