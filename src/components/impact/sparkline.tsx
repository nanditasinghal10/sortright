"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { easeOrganic } from "@/components/motion-primitives";

interface SparklineProps {
  values: number[];
  width?: number;
  height?: number;
}

export function Sparkline({ values, width = 600, height = 80 }: SparklineProps) {
  const { path, points, max } = useMemo(() => {
    const max = Math.max(1, ...values);
    const stepX = values.length > 1 ? width / (values.length - 1) : width;
    const points = values.map((v, i) => {
      const x = i * stepX;
      const y = height - (v / max) * (height - 8) - 4;
      return { x, y, v };
    });
    const path = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
    return { path, points, max };
  }, [values, width, height]);

  const lastIdx = points.length - 1;
  const last = points[lastIdx];
  const allZero = max === 1 && values.every((v) => v === 0);

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full h-20"
        role="img"
        aria-label={`Daily sorts over the last ${values.length} days`}
      >
        <defs>
          <linearGradient id="sparkfill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#9CB380" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#9CB380" stopOpacity="0" />
          </linearGradient>
        </defs>
        {!allZero && (
          <>
            <motion.path
              d={`${path} L ${width} ${height} L 0 ${height} Z`}
              fill="url(#sparkfill)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: easeOrganic }}
            />
            <motion.path
              d={path}
              fill="none"
              stroke="#647A4D"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: easeOrganic }}
            />
            {last && (
              <motion.circle
                cx={last.x}
                cy={last.y}
                r={4}
                fill="#4D5D3D"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 1.0, ease: easeOrganic }}
              />
            )}
          </>
        )}
        {allZero && (
          <line
            x1={0}
            x2={width}
            y1={height - 6}
            y2={height - 6}
            stroke="#CDDABA"
            strokeWidth={1.5}
            strokeDasharray="4 6"
          />
        )}
      </svg>
    </div>
  );
}
