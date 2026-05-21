"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { easeOrganic } from "@/components/motion-primitives";

interface ConfettiBurstProps {
  show: boolean;
}

const PARTICLES = ["🍃", "🌿", "🍀", "🌱", "🍃", "🌿", "🍀", "🌱", "🍃", "🌿", "🍃", "🌿"];

export function ConfettiBurst({ show }: ConfettiBurstProps) {
  const particles = useMemo(
    () =>
      PARTICLES.map((emoji, i) => {
        const angle = (i / PARTICLES.length) * Math.PI * 2;
        const radius = 80 + Math.random() * 80;
        return {
          emoji,
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius - 40,
          rot: (Math.random() - 0.5) * 240,
          delay: i * 0.025
        };
      }),
    []
  );

  return (
    <AnimatePresence>
      {show && (
        <div
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
          aria-hidden
        >
          {particles.map((p, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.4, rotate: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: p.x,
                y: p.y,
                scale: [0.4, 1.1, 1],
                rotate: p.rot
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, delay: p.delay, ease: easeOrganic }}
              className="absolute text-3xl"
            >
              {p.emoji}
            </motion.span>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
