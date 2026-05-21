import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-organic font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
  {
    variants: {
      variant: {
        primary:
          "bg-sage-700 text-cream hover:bg-sage-800 shadow-leaf",
        secondary:
          "bg-cream-100 text-ink hover:bg-cream-300 border border-sage-200 shadow-soft",
        ghost: "text-ink hover:bg-sage-100/60",
        clay: "bg-clay-400 text-ink hover:bg-clay-500 shadow-leaf",
        outline:
          "border-2 border-sage-700 text-sage-800 hover:bg-sage-100/60"
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-[0.95rem]",
        lg: "h-14 px-7 text-base"
      }
    },
    defaultVariants: { variant: "primary", size: "md" }
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { buttonVariants };
