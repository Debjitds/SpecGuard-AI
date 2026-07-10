import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Neo-Brutalist input. White fill contrasts against cream page; on focus the
 * teal hard-shadow appears to signal activity (DESIGN.md "Input Fields").
 */
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      "w-full bg-paper border-neo border-ink rounded-brutalist px-3 py-2 text-body-md text-on-surface placeholder:text-on-surface-variant/60 transition-all duration-150",
      "focus:outline-none focus:shadow-neo-teal focus:-translate-x-0.5 focus:-translate-y-0.5",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
