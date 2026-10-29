"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCatalog } from "@/components/layout/CatalogProvider";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { Select } from "@/components/ui/Field";
import { formatMoney } from "@/lib/money";
import { productHref } from "@/lib/routes";
import { isOptionAvailable, resolveVariant } from "@/lib/variants";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import type { PricedLine } from "@/types/commerce";

const issueText = {
  unavailable: "This option is sold out. Remove it to continue.",
  "invalid-options": "Please choose the options for this item again.",
  "quantity-reduced": "Quantity reduced to what's in stock.",
};

/** One cart line. `editable` adds option pickers so variants can be changed in the bag. */
export function CartItem({ line, editable = false, compact = false, onNavigate }: { line: PricedLine; editable?: boolean; compact?: boolean; onNavigate?: () => void }) {
  const { byId } = useCatalog();
  const product = byId.get(line.productId);
  const stored = useCart((s) => s.lines.find((l) => l.key === line.key));
  const setQuantity = useCart((s) => s.setQuantity);
  const changeOptions = useCart((s) => s.changeOptions);
  const remove = useCart((s) => s.remove);
  if (!product || !stored) return null;
  const sellable = line.lineTotal > 0;

  return (
    <li className={cn("flex gap-4", compact ? "py-4" : "py-6")}>
      <Link href={productHref(line.slug)} onClick={onNavigate} className={cn("relative shrink-0 overflow-hidden rounded-card bg-muted", compact ? "h-24 w-20" : "h-32 w-26 sm:h-36 sm:w-28")}>
        <Image src={line.image} alt={line.imageAlt} fill sizes="112px" className="object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-fg-muted">{line.brand}</p>
            <Link href={productHref(line.slug)} onClick={onNavigate} className="mt-0.5 block text-[0.9375rem] leading-snug font-medium hover:underline">
              {line.title}
            </Link>
            {!editable && line.options.length > 0 && <p className="mt-1 text-xs text-fg-muted">{line.options.map((o) => `${o.group}: ${o.label}`).join(" · ")}</p>}
          </div>
          <p className="shrink-0 text-right text-sm font-medium tabular-nums">
            {sellable ? formatMoney(line.lineTotal) : "—"}
            {line.unitOriginalPrice && line.unitOriginalPrice > line.unitPrice && sellable && (
              <s className="block text-xs font-normal text-fg-muted">
                <span className="sr-only">was </span>
                {formatMoney(line.unitOriginalPrice * line.quantity)}
              </s>
            )}
          </p>
        </div>

        {editable && (product.variants ?? []).length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {product.variants.map((group) => (
              <label key={group.id} className="flex min-w-32 flex-col gap-1 text-xs text-fg-muted">
                {group.name}
                <Select
                  value={stored.options[group.id] ?? ""}
                  onChange={(e) => {
                    const next = { ...stored.options, [group.id]: e.target.value };
                    changeOptions(line.key, next, resolveVariant(product, next).stock);
                  }}
                  className="h-9 text-sm"
                >
                  {!stored.options[group.id] && <option value="">Select</option>}
                  {group.options.map((o) => {
                    const ok = isOptionAvailable(product, group.id, o.value, stored.options);
                    return (
                      <option key={o.value} value={o.value} disabled={!ok}>
                        {o.label}
                        {ok ? "" : " — sold out"}
                      </option>
                    );
                  })}
                </Select>
              </label>
            ))}
          </div>
        )}

        {line.issue && (
          <p role="status" className="mt-2 flex items-start gap-1.5 text-xs font-medium text-sale">
            <AlertTriangle className="mt-px size-3.5 shrink-0" aria-hidden />
            {issueText[line.issue]}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          {sellable ? (
            <QuantitySelector size="sm" value={line.quantity} max={Math.max(1, line.available)} onChange={(q) => setQuantity(line.key, q, line.available)} label={`Quantity for ${line.title}`} />
          ) : (
            <span />
          )}
          <button type="button" onClick={() => remove(line.key)} className="inline-flex items-center gap-1.5 text-xs text-fg-muted underline-offset-4 hover:text-fg hover:underline">
            <Trash2 className="size-3.5" aria-hidden />
            Remove<span className="sr-only"> {line.title}</span>
          </button>
        </div>
      </div>
    </li>
  );
}
