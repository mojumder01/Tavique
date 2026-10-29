"use client";

import { MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { hydrateStores } from "@/store/hydration";
import type { Category, ProductSummary } from "@/types/catalog";
import { CatalogProvider } from "./CatalogProvider";

export function Providers({ products, categories, children }: { products: ProductSummary[]; categories: Category[]; children: ReactNode }) {
  useEffect(() => {
    void hydrateStores();
  }, []);
  return (
    <MotionConfig reducedMotion="user">
      <CatalogProvider products={products} categories={categories}>
        {children}
      </CatalogProvider>
    </MotionConfig>
  );
}
