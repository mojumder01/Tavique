"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useCatalog } from "@/components/layout/CatalogProvider";
import { EmptyState } from "@/components/ui/EmptyState";
import { enabledStores } from "@/config/stores";
import { categoryHref, searchHref } from "@/lib/routes";
import { searchProducts } from "@/lib/search";
import { useHistory } from "@/store/history";
import type { StoreConfig } from "@/types/store";
import { ProductListing } from "./ProductListing";

interface Props {
  card: StoreConfig["productCard"];
  popular: string[];
  storeHomeHref: string;
  suggestedCategories: { slug: string; name: string }[];
}

const facets = ["category", "brand", "price", "rating", "availability"] as const;

/** Client-side search over every enabled storefront, with the same filters and sorting as listings. */
export function SearchResults({ card, popular, storeHomeHref, suggestedCategories }: Props) {
  const params = useSearchParams();
  const q = (params.get("q") ?? "").trim().slice(0, 80);
  const { products, categoryNames } = useCatalog();
  const addSearch = useHistory((s) => s.addSearch);
  const pool = useMemo(() => products.filter((p) => enabledStores.includes(p.niche)), [products]);
  const results = useMemo(() => (q ? searchProducts(q, pool, categoryNames) : []), [q, pool, categoryNames]);

  useEffect(() => {
    if (q) addSearch(q);
  }, [q, addSearch]);

  return (
    <>
      <div className="mb-10">
        <form action="/search" role="search" className="flex max-w-2xl items-center gap-2 border-b border-fg/60 pb-2">
          <label htmlFor="search-page-q" className="sr-only">
            Search products
          </label>
          <input id="search-page-q" name="q" type="search" defaultValue={q} key={q} placeholder="Search products, brands and categories" className="h-12 min-w-0 flex-1 bg-transparent text-xl focus:outline-none md:text-2xl" />
          <button type="submit" className="btn-type rounded-btn bg-primary px-5 py-2.5 text-primary-fg hover:opacity-90">
            Search
          </button>
        </form>
        <h1 className="heading mt-8 text-3xl md:text-5xl" aria-live="polite">
          {q ? (
            <>
              {results.length} {results.length === 1 ? "result" : "results"} for “{q}”
            </>
          ) : (
            "Search the store"
          )}
        </h1>
      </div>

      {!q || results.length === 0 ? (
        <EmptyState
          title={q ? "No matches found" : "What are you looking for?"}
          body={
            q ? (
              <>
                We couldn&apos;t find anything for “{q}”. Check the spelling, try a more general term, or start from a popular search below.
              </>
            ) : (
              "Try one of these popular searches."
            )
          }
          className="py-10"
        >
          <div className="flex w-full flex-col items-center gap-6">
            <ul className="flex flex-wrap justify-center gap-2">
              {popular.map((t) => (
                <li key={t}>
                  <Link href={searchHref(t)} className="inline-flex h-9 items-center rounded-full border border-line px-4 text-sm hover:border-fg">
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
              {suggestedCategories.map((c) => (
                <li key={c.slug}>
                  <Link href={categoryHref(c.slug)} className="underline underline-offset-4">
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={storeHomeHref} className="underline underline-offset-4">
                  Back to the shop
                </Link>
              </li>
            </ul>
          </div>
        </EmptyState>
      ) : (
        <ProductListing items={results} facets={facets} labels={{}} categoryNames={categoryNames} card={card} emptyHref={searchHref(q)} emptyLabel="Reset filters" relevance />
      )}
    </>
  );
}
