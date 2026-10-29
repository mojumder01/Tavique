"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge, DiscountBadge } from "@/components/ui/Badge";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { RatingStars } from "@/components/ui/RatingStars";
import { SmartImage } from "@/components/ui/SmartImage";
import { useAddToCart } from "@/hooks/useAddToCart";
import { discountPercent, formatPrice } from "@/lib/money";
import { productHref } from "@/lib/routes";
import { defaultSelection, needsSelection } from "@/lib/variants";
import { cn } from "@/lib/utils";
import { useUI } from "@/store/ui";
import type { ProductBadge, ProductSummary } from "@/types/catalog";
import type { StoreConfig } from "@/types/store";
import { WishlistButton } from "./WishlistButton";

type CardStyle = StoreConfig["productCard"]["style"];
const aspects = { "3/4": "aspect-[3/4]", "4/5": "aspect-[4/5]", "1/1": "aspect-square" } as const;
const badgeLabel: Record<ProductBadge, string> = { new: "New", bestseller: "Bestseller", limited: "Limited", eco: "Eco", exclusive: "Exclusive" };

interface Props {
  product: ProductSummary;
  style: CardStyle;
  aspect: keyof typeof aspects;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

export function ProductCard({ product, style, aspect, priority, sizes = "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw", className }: Props) {
  const addToCart = useAddToCart();
  const setQuickAdd = useUI((s) => s.setQuickAdd);
  const [preview, setPreview] = useState<string | null>(null);
  const soldOut = product.stock <= 0;
  const pct = discountPercent(product.price, product.originalPrice);
  const swatchGroup = product.variants.find((g) => g.display === "swatch");
  const hover = product.images[1];
  const primary = preview ?? product.images[0]?.src ?? "";
  const badge = product.badges[0];
  const href = productHref(product.slug);

  const quickAdd = () => {
    if (needsSelection(product)) setQuickAdd(product.slug);
    else addToCart(product, defaultSelection(product, { fillAll: true }));
  };

  return (
    <article className={cn("group/card relative flex flex-col", style === "tech" && "rounded-card border border-line bg-surface p-3 transition-shadow hover:shadow-[0_18px_40px_-24px_rgb(0_0_0/0.35)]", className)}>
      <div className={cn("relative overflow-hidden bg-muted", aspects[aspect], style === "tech" ? "rounded-[calc(var(--r-card)-4px)]" : "rounded-card")}>
        <SmartImage src={primary} alt={product.images[0]?.alt ?? product.title} fill preload={priority} sizes={sizes} className={cn("object-cover transition-[opacity,transform] duration-700", hover && !preview && "group-hover/card:opacity-0", style !== "tech" && "group-hover/card:scale-[1.02]")} />
        {hover && !preview && <SmartImage src={hover.src} alt="" aria-hidden fill sizes={sizes} className="object-cover opacity-0 transition-opacity duration-700 group-hover/card:opacity-100" />}

        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col items-start gap-1.5">
          {soldOut ? <Badge tone="dark">Sold out</Badge> : badge && <Badge tone={badge === "new" ? "neutral" : "dark"}>{badgeLabel[badge]}</Badge>}
          {!soldOut && <DiscountBadge percent={pct} />}
        </div>
        <WishlistButton productId={product.id} title={product.title} className="absolute top-2.5 right-2.5 z-10" />

        {style === "editorial" && !soldOut && (
          <button
            type="button"
            onClick={quickAdd}
            className="btn-type absolute inset-x-2.5 bottom-2.5 z-10 hidden h-10 items-center justify-center gap-1.5 rounded-btn bg-bg/95 text-fg opacity-0 shadow-sm backdrop-blur transition-opacity group-hover/card:opacity-100 focus-visible:opacity-100 sm:flex [@media(hover:none)]:hidden"
          >
            <Plus className="size-3.5" aria-hidden /> Quick add<span className="sr-only"> {product.title}</span>
          </button>
        )}
        {style === "editorial" && !soldOut && (
          <button
            type="button"
            onClick={quickAdd}
            aria-label={`Quick add ${product.title}`}
            className="absolute right-2.5 bottom-2.5 z-10 inline-flex size-9 items-center justify-center rounded-full bg-bg/95 text-fg shadow-sm sm:hidden [@media(hover:none)]:inline-flex"
          >
            <Plus className="size-4" aria-hidden />
          </button>
        )}
      </div>

      <div className={cn("flex flex-1 flex-col", style === "tech" ? "px-1 pt-4" : "pt-3.5")}>
        {style !== "editorial" && <p className="text-xs text-fg-muted">{product.brand}</p>}
        <h3 className={cn("leading-snug", style === "editorial" ? "text-[0.9375rem]" : "mt-1 text-[0.9375rem] font-medium")}>
          <Link href={href} className="after:absolute after:inset-0 after:z-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-fg">
            {product.title}
          </Link>
        </h3>

        {style === "tech" && product.keySpecs.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {product.keySpecs.map((s) => (
              <li key={s} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-fg-muted">
                {s}
              </li>
            ))}
          </ul>
        )}

        {style === "beauty" && product.subtitle && <p className="mt-1 text-xs tracking-[0.12em] text-fg-muted uppercase">{product.subtitle}</p>}

        <div className={cn("mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1", style === "tech" && "mt-3")}>
          {style !== "beauty" && <PriceDisplay price={product.price} originalPrice={product.originalPrice} size={style === "tech" ? "md" : "sm"} className={style === "tech" ? "font-semibold" : ""} />}
          {style !== "editorial" && <RatingStars rating={product.rating} count={product.reviewCount} size={12} />}
        </div>

        {swatchGroup && swatchGroup.options.length > 1 && style !== "tech" && (
          <div className="relative z-10 mt-2.5 flex items-center gap-1.5" onMouseLeave={() => setPreview(null)}>
            {swatchGroup.options.slice(0, 5).map((o) => (
              <span
                key={o.value}
                aria-hidden
                title={o.label}
                onMouseEnter={() => o.image && setPreview(o.image)}
                className="size-3.5 rounded-full border border-black/15 ring-offset-2 ring-offset-bg hover:ring-1 hover:ring-fg"
                style={{ background: o.swatch }}
              />
            ))}
            {swatchGroup.options.length > 5 && <span className="text-xs text-fg-muted">+{swatchGroup.options.length - 5}</span>}
            <span className="sr-only">Available in {swatchGroup.options.length} {swatchGroup.name.toLowerCase()}s</span>
          </div>
        )}

        {style === "tech" && <span aria-hidden className="min-h-4 flex-1" />}
        {style === "tech" && (
          <button type="button" onClick={quickAdd} disabled={soldOut} className="btn-type relative z-10 inline-flex h-10 items-center justify-center gap-1.5 rounded-btn bg-primary text-primary-fg transition-opacity hover:opacity-90 disabled:bg-muted disabled:text-fg-muted">
            {soldOut ? "Sold out" : "Add to cart"}
            <span className="sr-only"> {product.title}</span>
          </button>
        )}
        {style === "beauty" && <span aria-hidden className="min-h-3.5 flex-1" />}
        {style === "beauty" && (
          <button type="button" onClick={quickAdd} disabled={soldOut} className="btn-type relative z-10 inline-flex h-11 items-center justify-center gap-2 rounded-btn bg-accent text-accent-fg transition-opacity hover:opacity-90 disabled:bg-muted disabled:text-fg-muted">
            {soldOut ? "Sold out" : <>Add to bag · {formatPrice(product.price)}</>}
            {product.originalPrice && !soldOut && <s className="font-normal opacity-75">{formatPrice(product.originalPrice)}</s>}
            <span className="sr-only"> {product.title}</span>
          </button>
        )}
      </div>
    </article>
  );
}
