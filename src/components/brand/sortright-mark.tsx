import type { CSSProperties } from "react";

interface SortRightMarkProps {
  className?: string;
  style?: CSSProperties;
  /** Filled leaf body. Defaults to sage-700. */
  leafColor?: string;
  /** Internal vein. Defaults to sage-300. */
  veinColor?: string;
  /** Tail/nock stem. Defaults to clay-500. */
  stemColor?: string;
}

/**
 * The SortRight mark: a leaf shape with a strong diagonal axis pointing
 * up-right so it reads as both a leaf (nature) and an arrow (the "right"
 * direction). A subtle internal vein gives organic detail; a small clay
 * stem at the tail adds warmth and reinforces the arrow nock.
 */
export function SortRightMark({
  className,
  style,
  leafColor = "#4A6B4F",
  veinColor = "#CDDABA",
  stemColor = "#C77A4A"
}: SortRightMarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden
    >
      {/* Leaf body — sharp tip at top-right, gentle tail at bottom-left */}
      <path
        d="M5 20.2C3.9 13.5 10.7 4.7 19.5 3.5c.6 7.6-7 16.6-14.5 16.7Z"
        fill={leafColor}
      />
      {/* Inner vein — organic curve from tail to tip */}
      <path
        d="M6 18.5C9 14.5 13.5 9.5 18 6"
        stroke={veinColor}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Stem / arrow nock */}
      <path
        d="M2.2 21.8 5 19"
        stroke={stemColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default SortRightMark;
