"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { WasteItem } from "@/lib/items";
import { ChipBody } from "./item-chip";

export interface FlyAwayPayload {
  item: WasteItem;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  key: number;
}

export function FlyAway({ payload }: { payload: FlyAwayPayload | null }) {
  return (
    <AnimatePresence>
      {payload && (
        <motion.div
          key={payload.key}
          initial={{
            x: payload.fromX,
            y: payload.fromY,
            scale: 1.1,
            opacity: 1,
            rotate: -3
          }}
          animate={{
            x: payload.toX,
            y: payload.toY,
            scale: 0.25,
            opacity: 0,
            rotate: 220
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.5, 0, 0.75, 0] }}
          className="pointer-events-none fixed left-0 top-0 z-40"
          style={{ transformOrigin: "center" }}
        >
          <ChipBody item={payload.item} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
