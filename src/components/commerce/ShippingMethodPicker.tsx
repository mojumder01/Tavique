"use client";

import { commerceConfig } from "@/config/commerce.config";
import { formatMoney, formatPrice, toCents } from "@/lib/money";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import type { CartTotals } from "@/types/commerce";

/** Radio list of delivery methods; the choice is shared between cart estimate and checkout. */
export function ShippingMethodPicker({ totals, legend = "Delivery method", name = "shipping-method" }: { totals: CartTotals; legend?: string; name?: string }) {
  const selected = useCart((s) => s.shippingMethodId);
  const setMethod = useCart((s) => s.setShippingMethod);
  const afterDiscount = totals.subtotal - totals.discount;
  return (
    <fieldset>
      <legend className="mb-2.5 text-sm font-medium">{legend}</legend>
      <div className="space-y-2">
        {commerceConfig.shippingMethods.map((m) => {
          const free = ("freeOver" in m && m.freeOver != null && afterDiscount >= toCents(m.freeOver)) || (totals.shipping === 0 && totals.shippingMethod.id === m.id && totals.itemCount > 0);
          const checked = (selected ?? commerceConfig.shippingMethods[0]?.id) === m.id;
          return (
            <label key={m.id} className={cn("flex cursor-pointer items-center gap-3 rounded-input border px-3.5 py-3 text-sm transition-colors", checked ? "border-fg bg-surface" : "border-line hover:border-fg/50")}>
              <input type="radio" name={name} value={m.id} checked={checked} onChange={() => setMethod(m.id)} className="size-4 accent-[var(--c-primary)]" />
              <span className="flex-1">
                <span className="block font-medium">{m.label}</span>
                <span className="block text-xs text-fg-muted">
                  {m.description}
                  {"freeOver" in m && m.freeOver ? ` · free over ${formatPrice(m.freeOver)}` : ""}
                </span>
              </span>
              <span className="tabular-nums">{free ? "Free" : formatMoney(toCents(m.price))}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
