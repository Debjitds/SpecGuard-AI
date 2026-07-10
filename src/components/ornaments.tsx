import { cn } from "@/lib/utils";

/** Floating decorative star/spark ornament (DESIGN.md "Floating Ornaments"). */
export function StarOrnament({
  className,
  color = "bg-ink",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("ornament-star block w-4 h-4", color, className)}
    />
  );
}

/** A decorative checker pattern used on empty states. */
export function CheckPattern({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "w-full h-full opacity-[0.15]",
        className,
      )}
      style={{
        backgroundImage:
          "repeating-conic-gradient(#000 0% 25%, transparent 0% 50%)",
        backgroundSize: "16px 16px",
      }}
    />
  );
}
