import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number, opts?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1, ...opts }).format(n);
}

export function pluralize(n: number, singular: string, plural?: string) {
  return `${n} ${n === 1 ? singular : plural ?? singular + "s"}`;
}
