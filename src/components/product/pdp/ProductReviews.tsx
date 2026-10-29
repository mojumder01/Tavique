import { BadgeCheck } from "lucide-react";
import { RatingStars } from "@/components/ui/RatingStars";
import type { Product } from "@/types/catalog";

const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

/** Rating summary and review list, as a card. Demo reviews are fictional; connect a reviews provider in production. */
export function ProductReviews({ product }: { product: Product }) {
  const reviews = product.reviews ?? [];
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="scroll-mt-28 rounded-card border border-line bg-surface p-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
        <div>
          <h2 id="reviews-title" className="heading text-2xl md:text-3xl">
            Reviews
          </h2>
          <p className="mt-2 max-w-sm text-xs leading-relaxed text-fg-muted">
            Showing {reviews.length} of {product.reviewCount.toLocaleString("en-US")}. Demo reviews are sample content — connect a verified reviews provider before going live.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="heading text-5xl leading-none">{product.rating.toFixed(1)}</p>
          <div>
            <RatingStars rating={product.rating} size={15} />
            <p className="mt-1 text-xs text-fg-muted">{product.reviewCount.toLocaleString("en-US")} reviews</p>
          </div>
        </div>
      </div>
      <ul className="divide-y divide-line">
        {reviews.map((r) => (
          <li key={r.id} className="py-5 last:pb-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <RatingStars rating={r.rating} size={13} />
              <time dateTime={r.date} className="text-xs text-fg-muted">
                {fmt.format(new Date(r.date))}
              </time>
            </div>
            <h3 className="mt-2.5 font-medium">{r.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{r.body}</p>
            <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <span className="font-medium">{r.author}</span>
              {r.verified && (
                <span className="inline-flex items-center gap-1 text-success">
                  <BadgeCheck className="size-3.5" aria-hidden /> Verified buyer
                </span>
              )}
              {r.meta && <span className="text-fg-muted">{r.meta}</span>}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
