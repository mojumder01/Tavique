"use client";

import { AlertCircle, CheckCircle2, Clock, Lock, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { WishlistButton } from "@/components/product/WishlistButton";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { RatingStars } from "@/components/ui/RatingStars";
import { VariantSelector } from "@/components/ui/VariantSelector";
import { commerceConfig } from "@/config/commerce.config";
import { useAddToCart } from "@/hooks/useAddToCart";
import { formatPrice } from "@/lib/money";
import { searchHref } from "@/lib/routes";
import { defaultSelection, resolveVariant } from "@/lib/variants";
import { cn } from "@/lib/utils";
import { useHistory } from "@/store/history";
import type { ProductBadge, ProductImage, StoreId, VariantGroup } from "@/types/catalog";
import type { SelectedOptions } from "@/types/commerce";
import { ProductGallery } from "./ProductGallery";
import { SizeGuide } from "./SizeGuide";

export interface ProductViewData {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  brand: string;
  niche: StoreId;
  price: number;
  originalPrice?: number;
  stock: number;
  rating: number;
  reviewCount: number;
  images: ProductImage[];
  variants: VariantGroup[];
  badges: ProductBadge[];
  sizeGuide?: "apparel" | "footwear";
  fit?: string;
  warranty?: string;
}

const badgeLabel: Record<ProductBadge, string> = { new: "New", bestseller: "Bestseller", limited: "Limited edition", eco: "Eco", exclusive: "Exclusive" };
const freeOver = commerceConfig.shippingMethods.find((m) => "freeOver" in m)?.freeOver;

/**
 * Product layout: gallery with content cards beneath it on the left, and a sticky purchase panel
 * (with compact detail accordions) on the right. On small screens the order is gallery → panel → cards.
 */
export function ProductView({ product, aspect, details, below }: { product: ProductViewData; aspect: string; details?: ReactNode; below?: ReactNode }) {
  const router = useRouter();
  const addToCart = useAddToCart();
  const addViewed = useHistory((s) => s.addViewed);
  const [selection, setSelection] = useState<SelectedOptions>(() => defaultSelection(product, { fillSwatches: true }));
  const [quantity, setQuantity] = useState(1);
  const [invalid, setInvalid] = useState<string[]>([]);
  const [imageIndex, setImageIndex] = useState(0);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const v = useMemo(() => resolveVariant(product, selection), [product, selection]);

  useEffect(() => addViewed(product.id), [product.id, addViewed]);

  const soldOut = v.complete ? v.stock <= 0 : product.stock <= 0;
  const maxQty = Math.max(1, Math.min(commerceConfig.maxQuantityPerLine, v.complete ? v.stock : product.stock));
  // Derived rather than synced: switching to a lower-stock option caps the quantity automatically.
  const qty = Math.min(quantity, maxQty);

  const choose = (groupId: string, value: string) => {
    const next = { ...selection, [groupId]: value };
    setSelection(next);
    setInvalid((i) => i.filter((x) => x !== groupId));
    // Show the image that belongs to the newly chosen colour/shade.
    const image = resolveVariant(product, next).image;
    const index = image ? product.images.findIndex((img) => img.src === image) : -1;
    if (index >= 0) setImageIndex(index);
  };

  const submit = (buyNow: boolean) => {
    const result = addToCart(product, selection, qty, { openCart: !buyNow });
    if (!result.ok && result.reason === "missing") {
      setInvalid(result.missing);
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    if (buyNow && (result.ok || result.reason === "limit")) router.push("/checkout");
  };

  const availability = !v.complete
    ? { icon: Clock, text: product.stock > 0 ? "Choose your options to check availability" : "Sold out", tone: "text-fg-muted" }
    : v.stock <= 0
      ? { icon: AlertCircle, text: "Sold out in this option — try another", tone: "text-sale" }
      : v.stock <= 3
        ? { icon: AlertCircle, text: `Low stock — only ${v.stock} left`, tone: "text-sale" }
        : { icon: CheckCircle2, text: "In stock, ready to ship", tone: "text-success" };

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-8 xl:gap-x-16">
      <div className="min-w-0 lg:col-span-7 lg:row-start-1">
        <ProductGallery images={product.images} index={imageIndex} onIndexChange={setImageIndex} aspect={aspect} title={product.title} />
      </div>

      <div className="lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">
        <div className="lg:sticky lg:top-24">
          <div className="flex flex-wrap items-center gap-2">
            {product.badges.map((b) => (
              <Badge key={b} tone={b === "new" ? "outline" : "dark"}>
                {badgeLabel[b]}
              </Badge>
            ))}
          </div>
          <Link href={searchHref(product.brand)} className="mt-3 inline-block text-sm text-fg-muted underline-offset-4 hover:text-fg hover:underline">
            {product.brand}
          </Link>
          <h1 className="heading mt-1 text-3xl md:text-[2.6rem]">{product.title}</h1>
          {product.subtitle && <p className="mt-2 text-[0.9375rem] text-fg-muted">{product.subtitle}</p>}
          <a href="#reviews" className="mt-3 inline-flex items-center gap-2 text-sm hover:underline">
            <RatingStars rating={product.rating} showValue count={product.reviewCount} />
          </a>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <PriceDisplay price={v.price} originalPrice={v.originalPrice} size="lg" showSaving />
          </div>
          {freeOver && <p className="mt-1 text-xs text-fg-muted">Free standard shipping on orders over {formatPrice(freeOver)}.</p>}

          {product.variants.length > 0 && (
            <div className="mt-7">
              <VariantSelector
                product={product}
                selection={selection}
                invalidGroups={invalid}
                onChange={choose}
                groupAction={(g) => (g === "size" && product.sizeGuide ? <SizeGuide kind={product.sizeGuide} fit={product.fit} /> : null)}
              />
            </div>
          )}

          <p className={cn("mt-6 flex items-center gap-2 text-sm font-medium", availability.tone)} role="status">
            <availability.icon className="size-4 shrink-0" aria-hidden />
            {availability.text}
          </p>

          {invalid.length > 0 && (
            <p ref={errorRef} tabIndex={-1} role="alert" className="mt-4 rounded-card border border-sale/40 bg-sale/5 px-4 py-3 text-sm text-sale focus:outline-none">
              Please choose {invalid.map((id) => product.variants.find((g) => g.id === id)?.name.toLowerCase() ?? id).join(" and ")} before adding to your bag.
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <QuantitySelector value={qty} onChange={setQuantity} max={maxQty} />
            <Button size="lg" className="flex-1" onClick={() => submit(false)} disabled={soldOut}>
              {soldOut ? "Sold out" : `Add to bag · ${formatPrice(v.price * qty)}`}
            </Button>
          </div>
          <div className="mt-3 flex gap-3">
            <Button size="lg" variant="outline" className="flex-1" onClick={() => submit(true)} disabled={soldOut}>
              Buy now
            </Button>
            <WishlistButton productId={product.id} title={product.title} variant="button" />
          </div>

          <ul className="mt-6 grid gap-3 rounded-card border border-line bg-surface p-4 text-sm sm:grid-cols-2">
            <li className="flex items-start gap-2.5">
              <Truck className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>
                <span className="block font-medium">Delivery in 3–5 days</span>
                <span className="text-xs text-fg-muted">Express and next-day available</span>
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <RotateCcw className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>
                <span className="block font-medium">Free 30-day returns</span>
                <span className="text-xs text-fg-muted">On unworn, unused items</span>
              </span>
            </li>
            {product.warranty && (
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>
                  <span className="block font-medium">Warranty</span>
                  <span className="text-xs text-fg-muted">{product.warranty}</span>
                </span>
              </li>
            )}
            <li className="flex items-start gap-2.5">
              <Lock className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>
                <span className="block font-medium">Secure checkout</span>
                <span className="text-xs text-fg-muted">Demo — no payment is taken</span>
              </span>
            </li>
          </ul>

          {details && <div className="mt-8">{details}</div>}
        </div>
      </div>

      {below && <div className="min-w-0 space-y-6 lg:col-span-7 lg:row-start-2">{below}</div>}
    </div>
  );
}
