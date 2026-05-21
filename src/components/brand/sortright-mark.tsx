import type { CSSProperties } from "react";

interface SortRightMarkProps {
  className?: string;
  style?: CSSProperties;
  color?: string;
  strokeWidth?: number;
}

export function SortRightMark({
  className,
  style,
  color = "currentColor",
  strokeWidth = 2
}: SortRightMarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6" />
    </svg>
  );
}

export default SortRightMark;
