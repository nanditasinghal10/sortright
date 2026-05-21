"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Home, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stagger, fadeUp, easeOrganic } from "@/components/motion-primitives";

const LEAF_OVAL =
  "M32 4c14 6 24 16 24 30 0 14-12 26-26 26C18 60 8 50 8 36 8 22 18 10 32 4z";
const LEAF_THIN =
  "M10 54c8-22 22-38 44-46-2 22-12 40-30 50-3 2-9 1-12-1-3-2-3-2-2-3z";
const SPROUT =
  "M32 60V34c0-10 6-18 16-22-2 10-7 18-16 22zM32 36c0-8-6-16-16-20 2 10 7 16 16 20z";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-paper">
      {/* subtle leaf decorations */}
      <motion.svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        className="hidden md:block absolute -top-8 -left-10 h-48 w-48 text-sage-200"
        initial={{ opacity: 0, rotate: -14 }}
        animate={{ opacity: 1, rotate: [-14, -6, -14], y: [0, -10, 0] }}
        transition={{
          opacity: { duration: 1.2, ease: easeOrganic, delay: 0.1 },
          rotate: { duration: 10, ease: "easeInOut", repeat: Infinity },
          y: { duration: 8, ease: "easeInOut", repeat: Infinity }
        }}
      >
        <path d={LEAF_OVAL} fill="currentColor" />
      </motion.svg>

      <motion.svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        className="hidden md:block absolute top-24 -right-12 h-56 w-56 text-clay-200"
        initial={{ opacity: 0, rotate: 8 }}
        animate={{ opacity: 1, rotate: [8, -4, 8], y: [0, -12, 0] }}
        transition={{
          opacity: { duration: 1.2, ease: easeOrganic, delay: 0.25 },
          rotate: { duration: 11, ease: "easeInOut", repeat: Infinity },
          y: { duration: 9, ease: "easeInOut", repeat: Infinity }
        }}
      >
        <path d={LEAF_THIN} fill="currentColor" />
      </motion.svg>

      <motion.svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        className="hidden lg:block absolute bottom-12 left-[14%] h-24 w-24 text-sage-300/80"
        initial={{ opacity: 0, rotate: 4 }}
        animate={{ opacity: 1, rotate: [4, 12, 4], y: [0, -6, 0] }}
        transition={{
          opacity: { duration: 1.2, ease: easeOrganic, delay: 0.4 },
          rotate: { duration: 7, ease: "easeInOut", repeat: Infinity },
          y: { duration: 6, ease: "easeInOut", repeat: Infinity }
        }}
      >
        <path d={SPROUT} fill="currentColor" />
      </motion.svg>

      <div className="relative mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="space-y-6"
        >
          <motion.p
            variants={fadeUp}
            className="text-sm uppercase tracking-[0.18em] text-sage-700 font-medium"
          >
            Page not found
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-display text-6xl md:text-7xl tracking-tight text-ink leading-[0.95]"
          >
            404
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="font-display text-2xl md:text-3xl text-sage-800 italic"
          >
            This page composted itself.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mx-auto max-w-md text-lg text-ink-soft leading-relaxed"
          >
            Looks like that link decomposed. Try one of these instead.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row"
          >
            <Link href="/">
              <Button size="lg" className="min-h-[44px]">
                <Home className="h-4 w-4" />
                Back home
              </Button>
            </Link>
            <Link href="/sort">
              <Button size="lg" variant="secondary" className="min-h-[44px]">
                Play the sort game
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/locate">
              <Button size="lg" variant="secondary" className="min-h-[44px]">
                <MapPin className="h-4 w-4" />
                Find a drop-off
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
