import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-surface/95 text-fg border border-line",
  dark: "bg-fg text-bg",
  sale: "bg-sale text-sale-fg",
  accent: "bg-accent text-accent-fg",
  outline: "border border-current text-fg",
} as const;

export function Badge({ tone = "neutral", className, children }: { tone?: keyof typeof tones; className?: string; children: ReactNode }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-[calc(var(--r-card)+2px)] px-2 py-1 text-[10px] leading-none font-semibold tracking-[0.08em] uppercase", tones[tone], className)}>{children}</span>;
}

/** "−20%" label for discounted products. Renders nothing when there's no discount. */
export function DiscountBadge({ percent, className }: { percent: number; className?: string }) {
  if (percent <= 0) return null;
  return (
    <Badge tone="sale" className={className}>
      <span className="sr-only">Save </span>
      {percent}%<span className="sr-only"> off</span>
      <span aria-hidden> off</span>
    </Badge>
  );
}
