"use client";

import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCatalog } from "@/components/layout/CatalogProvider";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { useAddToCart } from "@/hooks/useAddToCart";
import { productHref } from "@/lib/routes";
import { defaultSelection, needsSelection } from "@/lib/variants";
import { useHydrated } from "@/store/hydration";
import { useUI } from "@/store/ui";
import { useWishlist } from "@/store/wishlist";

/** Saved products with "move to bag" (via quick add when options are needed) and remove. */
export function WishlistView({ continueHref }: { continueHref: string }) {
  const hydrated = useHydrated();
  const ids = useWishlist((s) => s.ids);
  const remove = useWishlist((s) => s.remove);
  const { byId } = useCatalog();
  const addToCart = useAddToCart();
  const setQuickAdd = useUI((s) => s.setQuickAdd);
  const items = ids.map((id) => byId.get(id)).filter((p) => p != null);

  if (!hydrated) return <ProductGridSkeleton count={4} />;
  if (!items.length) {
    return (
      <EmptyState icon={<Heart />} title="Your wishlist is empty" body="Tap the heart on any product to save it here for later.">
        <ButtonLink href={continueHref}>Discover products</ButtonLink>
      </EmptyState>
    );
  }

  return (
    <>
      <p className="mb-6 text-sm text-fg-muted" aria-live="polite">
        {items.length} saved {items.length === 1 ? "item" : "items"}
      </p>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
        {items.map((p) => {
          const soldOut = p.stock <= 0;
          return (
            <li key={p.id} className="flex flex-col">
              <Link href={productHref(p.slug)} className="relative aspect-[4/5] overflow-hidden rounded-card bg-muted">
                <Image src={p.images[0]?.src ?? ""} alt={p.images[0]?.alt ?? p.title} fill sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw" className="object-cover" />
              </Link>
              <p className="mt-3 text-xs text-fg-muted">{p.brand}</p>
              <Link href={productHref(p.slug)} className="text-[0.9375rem] font-medium hover:underline">
                {p.title}
              </Link>
              <PriceDisplay price={p.price} originalPrice={p.originalPrice} size="sm" className="mt-1" />
              <div className="mt-auto flex gap-2 pt-4">
                <Button
                  size="sm"
                  className="flex-1"
                  disabled={soldOut}
                  onClick={() => {
                    if (needsSelection(p)) return setQuickAdd(p.slug);
                    const result = addToCart(p, defaultSelection(p, { fillAll: true }));
                    if (result.ok) remove(p.id);
                  }}
                >
                  <ShoppingBag className="size-3.5" aria-hidden />
                  {soldOut ? "Sold out" : "Move to bag"}
                  <span className="sr-only"> {p.title}</span>
                </Button>
                <button type="button" onClick={() => remove(p.id)} className="inline-flex size-9 shrink-0 items-center justify-center rounded-btn border border-line hover:border-fg" aria-label={`Remove ${p.title} from wishlist`}>
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
