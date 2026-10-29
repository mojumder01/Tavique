import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "accent" | "outline" | "ghost" | "inverse" | "link";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "btn-type relative inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-btn transition-[background-color,color,border-color,opacity,box-shadow] duration-200 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";
const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-fg hover:opacity-90",
  accent: "bg-accent text-accent-fg hover:opacity-90",
  outline: "border border-fg/70 text-fg hover:bg-fg hover:text-bg",
  ghost: "text-fg hover:bg-muted",
  inverse: "bg-bg text-fg hover:bg-surface",
  link: "h-auto! px-0! underline decoration-1 underline-offset-4 hover:decoration-2",
};
const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4",
  md: "h-11 px-6",
  lg: "h-13 px-8",
};

export const buttonClass = (variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) => cn(base, variants[variant], sizes[size], className);

type ButtonProps = ComponentProps<"button"> & { variant?: ButtonVariant; size?: ButtonSize; loading?: boolean };

export function Button({ variant, size, className, loading, children, disabled, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={buttonClass(variant, size, className)} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {loading && <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden />}
      {children}
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize; children: ReactNode };

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

type IconButtonProps = ComponentProps<"button"> & { label: string; badge?: number | null };

/** Square icon button. `label` is required so every icon control has an accessible name. */
export function IconButton({ label, badge, className, children, type = "button", ...props }: IconButtonProps) {
  return (
    <button type={type} aria-label={label} title={label} className={cn("relative inline-flex size-10 items-center justify-center rounded-full text-fg transition-colors hover:bg-muted", className)} {...props}>
      {children}
      {badge ? <CountBadge count={badge} /> : null}
    </button>
  );
}

export function CountBadge({ count }: { count: number }) {
  return (
    <span aria-hidden className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] leading-none font-semibold text-primary-fg tabular-nums">
      {count > 99 ? "99+" : count}
    </span>
  );
}
