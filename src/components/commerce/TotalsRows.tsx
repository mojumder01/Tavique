import { commerceConfig } from "@/config/commerce.config";
import { formatMoney } from "@/lib/money";
import type { CartTotals } from "@/types/commerce";

export function TotalsRows({ totals, shippingLabel }: { totals: CartTotals; shippingLabel?: string }) {
  return (
    <dl className="space-y-2.5 text-sm">
      <div className="flex justify-between">
        <dt className="text-fg-muted">Subtotal</dt>
        <dd className="tabular-nums">{formatMoney(totals.subtotal)}</dd>
      </div>
      {totals.discount > 0 && (
        <div className="flex justify-between text-success">
          <dt>Discount ({totals.discountCode})</dt>
          <dd className="tabular-nums">−{formatMoney(totals.discount)}</dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt className="text-fg-muted">{shippingLabel ?? `Shipping (${totals.shippingMethod.label})`}</dt>
        <dd className="tabular-nums">{totals.itemCount === 0 ? "—" : totals.shipping === 0 ? "Free" : formatMoney(totals.shipping)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-fg-muted">
          {commerceConfig.taxLabel} ({Math.round(commerceConfig.taxRate * 100)}%)
        </dt>
        <dd className="tabular-nums">{formatMoney(totals.tax)}</dd>
      </div>
      <div className="flex items-baseline justify-between border-t border-line pt-3 text-base font-semibold">
        <dt>Total</dt>
        <dd className="tabular-nums">{formatMoney(totals.total)}</dd>
      </div>
    </dl>
  );
}
