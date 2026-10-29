"use client";

import { useCatalog } from "@/components/layout/CatalogProvider";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useHistory } from "@/store/history";
import { useHydrated } from "@/store/hydration";
import type { StoreConfig } from "@/types/store";

export function RecentlyViewed({ excludeId, card }: { excludeId?: string; card: StoreConfig["productCard"] }) {
  const hydrated = useHydrated();
  const viewed = useHistory((s) => s.viewed);
  const { byId } = useCatalog();
  if (!hydrated) return null;
  const items = viewed
    .filter((id) => id !== excludeId)
    .map((id) => byId.get(id))
    .filter((p) => p != null)
    .slice(0, 8);
  if (!items.length) return null;
  return (
    <section aria-labelledby="recent-title" className="page pb-20">
      <SectionHeading id="recent-title" title="Recently viewed" titleClassName="text-2xl md:text-3xl" className="md:mb-0" />
      <ProductCarousel products={items} card={card} label="Recently viewed" />
    </section>
  );
}
