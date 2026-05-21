"use client";

import { cn } from "@/lib/utils";

export const MATERIALS = [
  { id: "all", label: "All" },
  { id: "batteries", label: "Batteries" },
  { id: "electronics", label: "Electronics" },
  { id: "paint", label: "Paint" },
  { id: "compost", label: "Compost" },
  { id: "glass", label: "Glass" },
  { id: "plastic", label: "Plastic" },
  { id: "metal", label: "Metal" },
  { id: "textiles", label: "Textiles" },
  { id: "lightbulbs", label: "Lightbulbs" }
] as const;

export type MaterialId = (typeof MATERIALS)[number]["id"];

interface Props {
  active: MaterialId;
  onChange: (id: MaterialId) => void;
}

export function MaterialFilter({ active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {MATERIALS.map((m) => {
        const isActive = active === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-sage-200 border-sage-400 text-sage-900 shadow-soft"
                : "bg-cream-50 border-sage-200/70 text-ink-soft hover:bg-sage-100/60 hover:border-sage-300"
            )}
            aria-pressed={isActive}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
