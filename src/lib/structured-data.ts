import { siteConfig } from "@/config/site.config";
import type { Product } from "@/types/catalog";
import { productHref } from "./routes";

const abs = (path: string) => (path.startsWith("http") ? path : `${siteConfig.url}${path}`);

/** Lowest and highest purchasable price across variant option deltas. */
export function priceRange(p: Product) {
  let low = p.price;
  let high = p.price;
  for (const g of p.variants ?? []) {
    const deltas = g.options.map((o) => o.priceDelta ?? 0);
    low += Math.min(...deltas);
    high += Math.max(...deltas);
  }
  return { low, high };
}

/** schema.org Product built only from what the page displays (price, stock, rating, reviews). */
export function productJsonLd(p: Product) {
  const { low, high } = priceRange(p);
  const availability = p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";
  const url = abs(productHref(p.slug));
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    description: p.description,
    sku: p.id,
    brand: { "@type": "Brand", name: p.brand },
    image: p.images.map((i) => abs(i.src)),
    url,
    offers:
      low === high
        ? { "@type": "Offer", price: low.toFixed(2), priceCurrency: siteConfig.currency, availability, url, itemCondition: "https://schema.org/NewCondition" }
        : { "@type": "AggregateOffer", lowPrice: low.toFixed(2), highPrice: high.toFixed(2), priceCurrency: siteConfig.currency, availability, url },
    ...(p.reviewCount > 0 ? { aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating.toFixed(1), reviewCount: p.reviewCount } } : {}),
    ...(p.reviews?.length
      ? {
          review: p.reviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.author },
            datePublished: r.date,
            name: r.title,
            reviewBody: r.body,
            reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
          })),
        }
      : {}),
  };
}
