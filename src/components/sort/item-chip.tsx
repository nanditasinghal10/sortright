"use client";

import { useState } from "react";
import { motion, type PanInfo } from "framer-motion";
import { driftSpring } from "@/components/motion-primitives";
import type { WasteItem } from "@/lib/items";

interface ItemChipProps {
  item: WasteItem;
  isOverBin: boolean;
  onDragStart: () => void;
  onDrag: (point: { x: number; y: number }) => void;
  onDragEnd: (point: { x: number; y: number }) => void;
}

export function ItemChip({ item, isOverBin, onDragStart, onDrag, onDragEnd }: ItemChipProps) {
  const [dragging, setDragging] = useState(false);

  const handleDrag = (_: unknown, info: PanInfo) => {
    onDrag({ x: info.point.x, y: info.point.y });
  };

  const handleDragStart = () => {
    setDragging(true);
    onDragStart();
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    setDragging(false);
    onDragEnd({ x: info.point.x, y: info.point.y });
  };

  return (
    <motion.div
      drag
      dragSnapToOrigin
      dragElastic={0.2}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      animate={
        dragging
          ? isOverBin
            ? { opacity: 1, y: 0, scale: 0.55, rotate: 0, cursor: "grabbing" }
            : { opacity: 1, y: 0, scale: 1.12, rotate: -3, cursor: "grabbing" }
          : { opacity: 1, y: 0, scale: 1, rotate: 0 }
      }
      transition={driftSpring}
      initial={{ opacity: 0, y: 12, scale: 0.92 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.18 } }}
      className="relative z-50 cursor-grab active:cursor-grabbing"
      style={{ touchAction: "none" }}
    >
      <ChipBody item={item} />
    </motion.div>
  );
}

export function ChipBody({ item }: { item: WasteItem }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-organic bg-cream-50 border-2 border-sage-200 px-6 py-5 shadow-leaf min-w-[10rem]">
      <span className="text-5xl sm:text-6xl drop-shadow-sm" aria-hidden>
        {item.emoji}
      </span>
      <span className="font-display text-base sm:text-lg text-ink text-center leading-snug">
        {item.name}
      </span>
    </div>
  );
}
