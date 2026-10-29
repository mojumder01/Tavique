"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Category, ProductSummary } from "@/types/catalog";

interface CatalogValue {
  products: ProductSummary[];
  categories: Category[];
  byId: Map<string, ProductSummary>;
  bySlug: Map<string, ProductSummary>;
  categoryNames: Record<string, string>;
}

const CatalogContext = createContext<CatalogValue | null>(null);

/** Shares the lightweight product index with client components (cart, search, wishlist). */
export function CatalogProvider({ products, categories, children }: { products: ProductSummary[]; categories: Category[]; children: ReactNode }) {
  const value = useMemo(
    () => ({
      products,
      categories,
      byId: new Map(products.map((p) => [p.id, p])),
      bySlug: new Map(products.map((p) => [p.slug, p])),
      categoryNames: Object.fromEntries(categories.map((c) => [c.slug, c.name])),
    }),
    [products, categories],
  );
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used inside <CatalogProvider>");
  return ctx;
}
