import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Neo-Brutalist card: 3px black border + 4px hard shadow.
 * Optional accent fills for header/section colouring.
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { accent?: string }
>(({ className, accent, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "border-neo border-ink shadow-neo rounded-card",
      accent,
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("border-b-neo border-ink p-4 flex items-center gap-2", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-headline-md font-extrabold tracking-tight leading-none", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5", className)} {...props} />
));
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent };
