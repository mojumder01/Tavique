"use client";

import { Lock, ShoppingBag } from "lucide-react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { commerceConfig } from "@/config/commerce.config";
import { useCartTotals } from "@/hooks/useCartTotals";
import { toCents } from "@/lib/money";
import type { ProductSummary } from "@/types/catalog";
import type { StoreConfig } from "@/types/store";
import { CartItem } from "./CartItem";
import { DiscountCodeForm } from "./DiscountCodeForm";
import { FreeShippingProgress } from "./FreeShippingProgress";
import { ShippingMethodPicker } from "./ShippingMethodPicker";
import { TotalsRows } from "./TotalsRows";

const threshold = toCents(commerceConfig.shippingMethods.find((m) => "freeOver" in m)?.freeOver ?? 0);

export function CartView({ continueHref, suggestions, card }: { continueHref: string; suggestions: ProductSummary[]; card: StoreConfig["productCard"] }) {
  const { totals, hydrated } = useCartTotals();
  const blocking = totals.lines.some((l) => l.issue === "unavailable" || l.issue === "invalid-options");

  if (!hydrated) {
    return (
      <div className="grid gap-10 lg:grid-cols-12" role="status" aria-label="Loading your bag">
        <div className="space-y-6 lg:col-span-8">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-36 w-28" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-80 lg:col-span-4" />
      </div>
    );
  }

  if (totals.lines.length === 0) {
    return (
      <>
        <EmptyState icon={<ShoppingBag />} title="Your bag is empty" body="Looks like you haven't added anything yet. Start with our best sellers.">
          <ButtonLink href={continueHref}>Continue shopping</ButtonLink>
        </EmptyState>
        {suggestions.length > 0 && (
          <section aria-labelledby="cart-suggest" className="mt-10">
            <h2 id="cart-suggest" className="heading mb-8 text-2xl md:text-3xl">
              Popular right now
            </h2>
            <ProductGrid products={suggestions} card={card} />
          </section>
        )}
      </>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <section aria-labelledby="bag-items" className="lg:col-span-8">
        <h2 id="bag-items" className="sr-only">
          Items
        </h2>
        {threshold > 0 && (
          <div className="mb-2 rounded-card border border-line bg-surface p-4">
            <FreeShippingProgress remaining={totals.freeShippingRemaining} threshold={threshold} />
          </div>
        )}
        <ul className="divide-y divide-line border-b border-line">
          {totals.lines.map((line) => (
            <CartItem key={line.key} line={line} editable />
          ))}
        </ul>
        <ButtonLink href={continueHref} variant="link" className="mt-6">
          Continue shopping
        </ButtonLink>
      </section>

      <aside aria-labelledby="summary-title" className="lg:col-span-4">
        <div className="space-y-6 rounded-card border border-line bg-surface p-5 sm:p-6 lg:sticky lg:top-28">
          <h2 id="summary-title" className="heading text-2xl">
            Order summary
          </h2>
          <DiscountCodeForm totals={totals} />
          <ShippingMethodPicker totals={totals} legend="Shipping estimate" name="cart-shipping" />
          <TotalsRows totals={totals} />
          {blocking && (
            <p role="alert" className="text-sm text-sale">
              Remove or update unavailable items to continue.
            </p>
          )}
          {blocking ? (
            <Button size="lg" className="w-full" disabled>
              <Lock className="size-4" aria-hidden /> Checkout
            </Button>
          ) : (
            <ButtonLink href="/checkout" size="lg" className="w-full">
              <Lock className="size-4" aria-hidden /> Checkout
            </ButtonLink>
          )}
          <p className="text-xs leading-relaxed text-fg-muted">
            Prices are re-calculated from the product catalogue. Tax is an estimate. In production, totals and payment must be confirmed by a trusted server or commerce platform.
          </p>
        </div>
      </aside>
    </div>
  );
}
