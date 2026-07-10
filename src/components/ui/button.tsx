import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Neo-Brutalist button.
 *
 * Visual rules (DESIGN.md "Buttons"):
 *  - 3px black border, solid fill
 *  - default: 4px hard shadow
 *  - hover:  8px hard shadow (lifts -2/-2)
 *  - active: 0px shadow (pushes +2/+2)
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold uppercase tracking-tight rounded-brutalist border-neo border-ink shadow-neo transition-all duration-100 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ink/15 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-neo-sm select-none",
  {
    variants: {
      variant: {
        // Primary action — coral (matches Stitch dashboard "Upload PRD")
        coral: "bg-coral-deep text-paper hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-neo-active",
        teal: "bg-teal-bright text-ink hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-neo-active",
        lavender: "bg-lavender text-ink hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-neo-active",
        yellow: "bg-yellow text-ink hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-neo-active",
        ink: "bg-ink text-paper hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-neo-active",
        outline: "bg-paper text-ink hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-neo-active",
        ghost: "border-transparent bg-transparent shadow-none hover:bg-surface-container-high",
        subtle: "bg-surface-container-low text-ink hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo active:translate-x-0.5 active:translate-y-0.5 active:shadow-neo-active",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-7 text-sm",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "coral",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
