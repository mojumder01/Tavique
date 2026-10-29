"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { RatingStars } from "@/components/ui/RatingStars";
import { useAddToCart } from "@/hooks/useAddToCart";
import { productHref } from "@/lib/routes";
import { defaultSelection, needsSelection } from "@/lib/variants";
import { useUI } from "@/store/ui";
import type { ProductSummary } from "@/types/catalog";

/** Compact "you may also like" card for the product page's left column. */
export function SuggestedProducts({ products, title = "You may also like" }: { products: ProductSummary[]; title?: string }) {
  const addToCart = useAddToCart();
  const setQuickAdd = useUI((s) => s.setQuickAdd);
  if (!products.length) return null;
  return (
    <section aria-labelledby="suggested-title" className="rounded-card border border-line bg-surface p-6 md:p-8">
      <h2 id="suggested-title" className="heading text-2xl md:text-3xl">
        {title}
      </h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {products.map((p) => (
          <li key={p.id} className="flex gap-4 rounded-card border border-line bg-bg p-3">
            <Link href={productHref(p.slug)} className="relative h-28 w-22 shrink-0 overflow-hidden rounded-[calc(var(--r-card)/1.5)] bg-muted">
              <Image src={p.images[0]?.src ?? ""} alt={p.images[0]?.alt ?? p.title} fill sizes="88px" className="object-cover" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="text-xs text-fg-muted">{p.brand}</p>
              <Link href={productHref(p.slug)} className="mt-0.5 line-clamp-2 text-sm leading-snug font-medium hover:underline">
                {p.title}
              </Link>
              <RatingStars rating={p.rating} count={p.reviewCount} size={11} className="mt-1" />
              <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                <PriceDisplay price={p.price} originalPrice={p.originalPrice} size="sm" />
                <button
                  type="button"
                  onClick={() => (needsSelection(p) ? setQuickAdd(p.slug) : addToCart(p, defaultSelection(p, { fillAll: true })))}
                  disabled={p.stock <= 0}
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-line hover:border-fg disabled:opacity-40"
                  aria-label={p.stock <= 0 ? `${p.title} is sold out` : `Quick add ${p.title}`}
                >
                  <Plus className="size-4" aria-hidden />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
