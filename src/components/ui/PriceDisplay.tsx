import { discountPercent, formatPrice } from "@/lib/money";
import { cn } from "@/lib/utils";

/** Current price with optional struck-through original price. Sale state is shown in text, not colour alone. */
export function PriceDisplay({ price, originalPrice, className, size = "md", showSaving = false }: { price: number; originalPrice?: number; className?: string; size?: "sm" | "md" | "lg"; showSaving?: boolean }) {
  const onSale = originalPrice != null && originalPrice > price;
  const pct = discountPercent(price, originalPrice);
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2 gap-y-1 tabular-nums", size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-[0.9375rem]", className)}>
      {onSale && <span className="sr-only">Sale price</span>}
      <span className={cn("font-medium", onSale && "text-sale")}>{formatPrice(price)}</span>
      {onSale && (
        <>
          <span className="sr-only">, was</span>
          <s className={cn("text-fg-muted", size === "lg" ? "text-base" : "text-[0.8125rem]")}>{formatPrice(originalPrice)}</s>
          {showSaving && <span className="text-xs font-medium text-sale">Save {pct}%</span>}
        </>
      )}
    </span>
  );
}
