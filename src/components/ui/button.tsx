import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "cursor-pointer bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 text-zinc-300 hover:text-white px-4 py-1.5 rounded-md text-xs font-medium transition-all tracking-wide uppercase",
        destructive:
          "cursor-pointer rounded-md border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-red-300 transition-all hover:bg-red-500/20 hover:text-red-200",
        primary:
          "bg-blue-600 hover:bg-blue-700 px-12 py-5 rounded-full font-bold text-sm uppercase tracking-widest shadow-[0_20px_50px_rgba(37,99,235,0.3)] transition-all active:scale-95",
        secondary:
          "bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 px-12 py-5 rounded-full font-bold text-sm uppercase tracking-widest transition-all",
        link: "text-[11px] font-bold uppercase tracking-widest border-b border-blue-600 pb-2 hover:text-blue-500 transition-colors",
      },
      size: {
        default:
          "gap-1.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
