import * as React from "react";
import { cn } from "@/lib/utils";

/** A small Neo-Brutalist tag/chip. */
function Chip({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border-2 border-ink px-2 py-0.5 text-caption font-bold uppercase tracking-wider rounded",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Chip };
