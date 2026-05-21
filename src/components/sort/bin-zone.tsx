"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";
import { BINS, type BinId } from "@/lib/bins";
import { cn } from "@/lib/utils";

interface BinZoneProps {
  bin: BinId;
  isHovered: boolean;
}

export const BinZone = forwardRef<HTMLDivElement, BinZoneProps>(
  ({ bin, isHovered }, ref) => {
    const def = BINS[bin];
    const Icon = def.icon;

    return (
      <motion.div
        ref={ref}
        data-bin={bin}
        title={`${def.label} — ${def.blurb}`}
        animate={{
          scale: isHovered ? 1.12 : 1,
          y: isHovered ? -6 : 0
        }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        className={cn(
          "relative flex flex-col items-center justify-center gap-1 rounded-organic border-2 px-2 py-3 sm:py-4 select-none",
          def.bg,
          def.border,
          def.text,
          isHovered ? "shadow-leaf ring-2 ring-offset-2 ring-offset-cream-100" : "shadow-soft",
          isHovered && bin === "recycle" && "ring-sage-500",
          isHovered && bin === "compost" && "ring-[#7E9863]",
          isHovered && bin === "trash" && "ring-clay-500",
          isHovered && bin === "hazardous" && "ring-berry"
        )}
      >
        <Icon
          className="h-6 w-6 sm:h-7 sm:w-7"
          aria-hidden
          strokeWidth={2}
        />
        <span className="text-[0.7rem] sm:text-xs font-medium leading-tight text-center">
          {def.short}
        </span>
      </motion.div>
    );
  }
);
BinZone.displayName = "BinZone";
