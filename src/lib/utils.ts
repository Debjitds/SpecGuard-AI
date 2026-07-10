import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conditional logic. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a Date / ISO string into a short readable label. */
export function formatDate(input?: string | Date | null): string {
  if (!input) return "—";
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Pluralize helper for counts. */
export function plural(count: number, word: string, suffix = "s") {
  return `${count} ${word}${count === 1 ? "" : suffix}`;
}
