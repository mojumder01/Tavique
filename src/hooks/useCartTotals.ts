"use client";

import { useMemo } from "react";
import { useCatalog } from "@/components/layout/CatalogProvider";
import { priceCart } from "@/lib/pricing";
import { useCart } from "@/store/cart";
import { useHydrated } from "@/store/hydration";

/** Cart totals re-derived from the catalogue (never from stored prices). Empty until storage has loaded. */
export function useCartTotals() {
  const { byId } = useCatalog();
  const hydrated = useHydrated();
  const lines = useCart((s) => s.lines);
  const discountCode = useCart((s) => s.discountCode);
  const shippingMethodId = useCart((s) => s.shippingMethodId);
  const totals = useMemo(
    () => priceCart(hydrated ? lines : [], { getProduct: (id) => byId.get(id), discountCode, shippingMethodId }),
    [hydrated, lines, byId, discountCode, shippingMethodId],
  );
  return { totals, hydrated };
}
