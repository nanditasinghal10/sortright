import { BINS, type BinId } from "@/lib/bins";
import { cn } from "@/lib/utils";

interface BinPillProps {
  bin: BinId;
  size?: "sm" | "md";
  className?: string;
}

export function BinPill({ bin, size = "sm", className }: BinPillProps) {
  const def = BINS[bin];
  const Icon = def.icon;
  const sizing =
    size === "md"
      ? "px-3.5 py-1.5 text-sm"
      : "px-2.5 py-1 text-[0.72rem]";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        def.bg,
        def.border,
        def.text,
        sizing,
        className
      )}
    >
      <Icon className={size === "md" ? "h-4 w-4" : "h-3.5 w-3.5"} aria-hidden />
      {def.short}
    </span>
  );
}
