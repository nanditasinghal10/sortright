import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-organic border border-sage-200/70 bg-cream-50/80 backdrop-blur-[2px] p-6 shadow-soft",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-display text-2xl text-ink tracking-tight", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-ink-soft mt-2 leading-relaxed", className)} {...props} />;
}

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-sage-300/70 bg-sage-100/70 px-3 py-1 text-xs font-medium text-sage-800",
        className
      )}
      {...props}
    />
  );
}
