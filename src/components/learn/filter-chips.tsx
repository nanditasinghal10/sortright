"use client";

import { cn } from "@/lib/utils";

export interface ChipOption {
  id: string;
  label: string;
}

interface FilterChipsProps {
  label: string;
  options: ChipOption[];
  active: string;
  onChange: (id: string) => void;
}

export function FilterChips({ label, options, active, onChange }: FilterChipsProps) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isActive = active === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(opt.id)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
              isActive
                ? "bg-sage-200 text-sage-800 border-sage-400 shadow-soft"
                : "bg-cream-50 text-ink-soft border-sage-200/70 hover:bg-sage-50 hover:border-sage-300"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
