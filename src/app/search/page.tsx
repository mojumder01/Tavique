import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchResults } from "@/components/commerce/SearchResults";
import { StoreShell } from "@/components/layout/StoreShell";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { getStoreConfig } from "@/config/stores";
import { getCategory } from "@/data/categories";
import { getActiveStore } from "@/lib/active-store";
import { storeHome } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Search",
  description: "Search products, brands and categories.",
  alternates: { canonical: "/search" },
  // Result pages are thin and infinite; keep them out of the index but let crawlers follow links.
  robots: { index: false, follow: true },
};

export default async function SearchPage() {
  const store = await getActiveStore();
  const config = getStoreConfig(store);
  const suggested = config.categories
    .map((s) => getCategory(s))
    .filter((c) => c && !c.rule)
    .slice(0, 5)
    .map((c) => ({ slug: c!.slug, name: c!.name }));
  return (
    <StoreShell store={store}>
      <div className="page pt-10 pb-24">
        <Suspense fallback={<ProductGridSkeleton />}>
          <SearchResults card={config.productCard} popular={config.search.popular} storeHomeHref={storeHome(store)} suggestedCategories={suggested} />
        </Suspense>
      </div>
    </StoreShell>
  );
}
