import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CategoryHeader } from "@/components/commerce/CategoryHeader";
import { ProductListing } from "@/components/commerce/ProductListing";
import { StoreShell } from "@/components/layout/StoreShell";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { enabledStores, getStoreConfig } from "@/config/stores";
import { categories, getCategoriesByStore, getCategory } from "@/data/categories";
import { summariesFor } from "@/data/products";
import { productsInCategory } from "@/lib/collections";
import { categoryHref, storeHome } from "@/lib/routes";

type Props = { params: Promise<{ slug: string }> };

// Only the slugs from generateStaticParams exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return categories.filter((c) => enabledStores.includes(c.niche)).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategory((await params).slug);
  if (!category) return {};
  const store = getStoreConfig(category.niche);
  const title = `${category.name} — ${store.label}`;
  return {
    title,
    description: category.description,
    alternates: { canonical: categoryHref(category.slug) },
    openGraph: { title, description: category.description, url: categoryHref(category.slug), images: [{ url: category.image }] },
  };
}

export default async function CategoryPage({ params }: Props) {
  const category = getCategory((await params).slug);
  if (!category || !enabledStores.includes(category.niche)) notFound();
  const config = getStoreConfig(category.niche);
  const items = productsInCategory(category, summariesFor(category.niche));
  const categoryNames = Object.fromEntries(getCategoriesByStore(category.niche).filter((c) => !c.rule).map((c) => [c.slug, c.name]));
  // A category page doesn't need a category facet for its own membership — keep it for virtual collections.
  const facets = category.rule ? config.filters : config.filters.filter((f) => f !== "category");

  return (
    <StoreShell store={category.niche}>
      <CategoryHeader category={category} count={items.length} />
      <div className="page pb-24">
        <Suspense fallback={<ProductGridSkeleton aspect={config.productCard.aspect === "1/1" ? "aspect-square" : "aspect-[3/4]"} />}>
          <ProductListing items={items} facets={facets} labels={config.facetLabels} categoryNames={categoryNames} card={config.productCard} emptyHref={storeHome(category.niche)} emptyLabel={`Back to ${config.label}`} />
        </Suspense>
      </div>
    </StoreShell>
  );
}
