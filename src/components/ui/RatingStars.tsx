import { cn } from "@/lib/utils";

const STAR = "M10 1.5l2.6 5.3 5.9.9-4.25 4.15 1 5.85L10 14.95 4.75 17.7l1-5.85L1.5 7.7l5.9-.9L10 1.5z";

/** Five stars with fractional fill. Announced as text, e.g. "Rated 4.6 out of 5, 128 reviews". */
export function RatingStars({ rating, count, size = 14, className, showValue = false }: { rating: number; count?: number; size?: number; className?: string; showValue?: boolean }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-fg", className)}>
      <span className="relative inline-flex" aria-hidden style={{ height: size }}>
        <span className="flex text-fg/20">
          {Array.from({ length: 5 }, (_, i) => (
            <svg key={i} viewBox="0 0 20 20" width={size} height={size} fill="currentColor">
              <path d={STAR} />
            </svg>
          ))}
        </span>
        <span className="absolute inset-0 flex overflow-hidden text-current" style={{ width: `${pct}%` }}>
          {Array.from({ length: 5 }, (_, i) => (
            <svg key={i} viewBox="0 0 20 20" width={size} height={size} fill="currentColor" className="shrink-0">
              <path d={STAR} />
            </svg>
          ))}
        </span>
      </span>
      <span className="sr-only">
        Rated {rating.toFixed(1)} out of 5{count != null ? `, ${count.toLocaleString("en-US")} reviews` : ""}
      </span>
      {(showValue || count != null) && (
        <span aria-hidden className="text-xs text-fg-muted tabular-nums">
          {showValue && <span className="font-medium text-fg">{rating.toFixed(1)}</span>}
          {count != null && <span>{showValue ? " " : ""}({count.toLocaleString("en-US")})</span>}
        </span>
      )}
    </span>
  );
}
