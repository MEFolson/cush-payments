import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ink" | "ghost" | "outline" | "danger";
type Size = "md" | "lg" | "sm" | "icon";

const variants: Record<Variant, string> = {
  primary: "bg-champagne text-bone hover:bg-champagne-2 shadow-cta",
  ink: "bg-ink text-bone hover:bg-ink-2",
  ghost: "bg-transparent text-ink hover:bg-bone-2",
  outline: "bg-surface text-ink shadow-border hover:shadow-border-hover",
  danger: "bg-destructive/10 text-destructive",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-[15px]",
  lg: "h-14 px-6 text-base",
  icon: "size-12 p-0",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    size?: Size;
    block?: boolean;
  }
>(function Button(
  { className, variant = "primary", size = "md", block, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold",
        "transition-[opacity,transform,background-color,color,box-shadow] duration-150 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/70 focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
        "disabled:pointer-events-none disabled:opacity-40 tap-press",
        variants[variant],
        sizes[size],
        block && "w-full",
        className,
      )}
      {...props}
    />
  );
});
