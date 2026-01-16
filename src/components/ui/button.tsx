import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 rounded-full",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background hover:shadow-[0_0_24px_hsl(var(--glow)/0.35)]",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
        outline: "border border-foreground/20 bg-transparent text-foreground hover:shadow-[0_0_20px_hsl(var(--glow)/0.25)] hover:border-glow/40",
        secondary: "bg-secondary text-secondary-foreground hover:shadow-[0_0_18px_hsl(var(--glow)/0.2)]",
        ghost: "hover:text-glow",
        link: "text-foreground underline-offset-4 hover:text-glow",
      },
      size: {
        default: "h-11 px-7 py-2.5",
        sm: "h-9 px-5",
        lg: "h-14 px-12",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
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
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
