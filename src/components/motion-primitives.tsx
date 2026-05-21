"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

export const easeOrganic = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOrganic, delay: i * 0.06 }
  })
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } }
};

export const driftSpring = {
  type: "spring" as const,
  stiffness: 220,
  damping: 22,
  mass: 0.7
};

export function FadeUp({
  className,
  delay = 0,
  children,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: easeOrganic, delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Drift({
  className,
  children,
  amount = 8,
  duration = 7,
  ...props
}: HTMLMotionProps<"div"> & { amount?: number; duration?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -amount, 0], rotate: [0, 1.2, 0] }}
      transition={{ duration, ease: "easeInOut", repeat: Infinity }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
